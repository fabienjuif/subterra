import got from 'got'
import sockjs from 'sockjs'
import { createEngine, dices } from '@subterra/engine'
import { archetypes, cards } from '@subterra/data'

// TODO: use sock.js wrapper of sockjs

const PORT = process.env.PORT || 9999
const ENDPOINT_AUTH_VERIFY =
  process.env.ENDPOINT_AUTH_VERIFY || `http://localhost:${PORT}/auth`

const engine = createEngine()
engine.dispatch({
  type: '@players>init',
  payload: [
    {
      ...archetypes[0],
      archetype: archetypes[0],
      name: 'from-server',
    },
    {
      ...archetypes[1],
      archetype: archetypes[1],
      name: 'from-server-2',
    },
  ],
})

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

const wrapSocket = (socket) => {
  socket.dispatch = (action, mute) => {
    if (!mute) console.log('<<<', action.type)
    socket.write(JSON.stringify(action))
  }

  const listeners = []

  socket.addListener = (type, reaction) => {
    listeners.push([type, reaction])
  }

  socket.on('data', (message) => {
    const action = JSON.parse(message)

    console.log('>>>', action.type)

    listeners
      .filter(([type]) => type === action.type)
      .forEach(([, reaction]) => reaction(action))
  })

  return socket
}

const gameServer = sockjs.createServer({})
let clients = []

const broadcast = (action) => {
  clients.forEach((client) => {
    console.log('<<<', action.type, '[broadcast]')
    client.dispatch(action, true)
  })
}

const close = (client, reason) => {
  clients = clients.filter((curr) => curr !== client)
  client.dispatch({ type: '@server>error', payload: reason })
  client.close()
}

gameServer.on('connection', function (socket) {
  const client = wrapSocket(socket)
  clients.push(client)

  let verified = false
  let verifying = false

  const sendState = () =>
    broadcast({ type: '@server>setState', payload: engine.getState() })

  // register reactions
  client.addListener('@client>token', async ({ payload }) => {
    if (verifying) return

    const notFound = () => {
      throw new Error('User not found')
    }

    try {
      verifying = true

      const res = await got(ENDPOINT_AUTH_VERIFY, {
        headers: {
          authorization: `Bearer ${payload}`,
        },
      })
      const { body } = res || {}
      if (!body) notFound()
      const user = JSON.parse(body)
      if (!user.userId) notFound()

      console.log(`\tWelcome to ${user.userId}`)

      verified = true
      verifying = false
      sendState()
    } catch (ex) {
      console.trace(ex)

      close(client, 'Error while checking token')
      verified = false
      verifying = false
    }
  })

  client.addListener('@client>dispatch', ({ payload }) => {
    if (!verified) {
      if (verifying) return
      client.dispatch({ type: '@server>askToken' })
      return
    }

    // TODO: copy state then dispatch, then check the client has the right to do this?
    //      (anticheat)
    engine.dispatch(payload)

    // TODO: better logs on server
    console.log('\t-', typeof payload === 'string' ? payload : payload.type)

    sendState()
  })

  client.on('close', function () {})
})

export default (polka, prefix) => {
  gameServer.installHandlers(polka.server, { prefix })
}
