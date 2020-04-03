import bodyParser from 'body-parser'
import uuidPackage from 'uuid'
import got from 'got'
import { archetypes, cards } from '@subterra/data'
import { createEngine, dices } from '@subterra/engine'
import { create } from './sock'

const { v4: uuid } = uuidPackage

const ID = process.env.NODE_ID || uuid()
const PORT = process.env.PORT || 9999
const URL = process.env.URL || `http://localhost:${PORT}/game`
const ENDPOINT_LOBBY_REGISTERS =
  process.env.ENDPOINT_LOBBY_REGISTERS ||
  `http://localhost:${PORT}/lobby/gameNodes`

let engine
let users = []

const sendState = (client, action) => {
  client.broadcast({ type: '@server>setState', payload: engine.getState() })
}

const verifyAndSendState = (client, action) => {
  if (!engine || engine.getState().players.length === 0) {
    client.send({
      type: '@server>error',
      payload: {
        message: 'Game is not initialized',
      },
    })
  } else if (users.includes(client.user.userId)) {
    sendState(client, action)
  } else {
    client.send({
      type: '@server>error',
      payload: {
        message: 'User not authorized to access this game',
        userId: client.user.userId,
      },
    })

    client.close()
  }
}

const clientDispatch = (client, { payload }) => {
  // TODO: copy state then dispatch, then check the client has the right to do this?
  //      (anticheat)
  engine.dispatch(payload)

  // TODO: better logs on server
  console.log('\t-', typeof payload === 'string' ? payload : payload.type)

  sendState(client, {})
}

const listeners = [
  ['@server>user>verified', verifyAndSendState],
  ['client>dispatch', clientDispatch],
]

export default (polka, prefix) => {
  const withPrefix = (path) => `${prefix}${path}`

  polka.use(bodyParser.json()).post(withPrefix('/'), (req, res) => {
    // TODO: FIXME: security issue, the game server that's call this endpoint
    //       should give a GPG public key

    // add authorized users uuid
    users = req.body.users.map(({ id }) => id)

    // create game engine and init it
    engine = createEngine({})
    // TODO: tile deck
    engine.dispatch({
      type: '@dices>init',
      payload: Array.from({ length: 5000 }).map(() => dices.roll6()),
    })
    engine.dispatch({
      type: '@cards>init',
      payload: [
        ...Array.from({ length: 10 }).map(() =>
          dices.getRandomInArray(cards.slice(1)),
        ),
        cards[0],
      ],
    })
    engine.dispatch({
      type: '@players>init',
      payload: req.body.users,
    })
  })

  const sockServer = create(listeners)
  sockServer.installHandlers(polka.server, { prefix: `${prefix}/ws` })

  // send the lobby that this server is ready to be called

  got(ENDPOINT_LOBBY_REGISTERS, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: ID,
      url: URL,
    }),
  })
}
