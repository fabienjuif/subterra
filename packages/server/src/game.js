import { createEngine, dices } from '@subterra/engine'
import { archetypes, cards } from '@subterra/data'
import sockjs from 'sockjs'

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
  socket.dispatch = (action) => {
    socket.write(JSON.stringify(action))
  }

  const listeners = []

  socket.addListener = (type, reaction) => {
    listeners.push([type, reaction])
  }

  socket.on('data', (message) => {
    const action = JSON.parse(message)

    listeners
      .filter(([type]) => type === action.type)
      .forEach(([, reaction]) => reaction(action))
  })

  return socket
}

const gameServer = sockjs.createServer({})
const clients = []

const broadcast = (action) => {
  clients.forEach((client) => {
    client.dispatch(action)
  })
}

gameServer.on('connection', function (socket) {
  const client = wrapSocket(socket)
  clients.push(client)

  // register reactions
  client.addListener('@client>dispatch', ({ payload }) => {
    // TODO: copy state then dispatch, then check the client has the right to do this?
    //      (anticheat)
    engine.dispatch(payload)

    // TODO: better logs on server
    console.log(typeof payload === 'string' ? payload : payload.type)

    broadcast({ type: '@server>setState', payload: engine.getState() })
  })

  // send the known data to the client when it connects
  client.dispatch({ type: '@server>setState', payload: engine.getState() })

  client.on('close', function () {})
})

export default (server, prefix) => {
  gameServer.installHandlers(server, { prefix })
}
