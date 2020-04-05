import got from 'got'
import sockjs from 'sockjs'

// TODO: should be unit tested
// TODO: use it in game server

const PORT = process.env.PORT || 9999
const ENDPOINT_AUTH_VERIFY =
  process.env.ENDPOINT_AUTH_VERIFY || `http://localhost:${PORT}/auth`

const wrapSocket = (socket) => {
  socket.send = (action, mute) => {
    if (!mute) console.log('<<<', action.type)
    socket.write(JSON.stringify(action))
  }

  const listeners = []

  socket.addListener = (type, reaction) => {
    listeners.push([type, reaction])
  }

  socket.dispatch = (action) => {
    listeners
      .filter(([type]) => type === action.type)
      .forEach(([, reaction]) => reaction(socket, action))
  }

  socket.on('data', (message) => {
    const action = JSON.parse(message)

    console.log('>>>', action.type)

    socket.dispatch(action)
  })

  return socket
}

const checkToken = async (client, { payload }) => {
  if (client.verifying) return

  const notFound = () => {
    throw new Error('User not found')
  }

  try {
    client.verifying = true

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

    client.verified = true
    client.verifying = false
    client.user = user
    client.dispatch({ type: '@server>user>verified' })
  } catch (ex) {
    console.trace(ex)

    client.close(client, 'Error while checking token')
  }
}

export const create = (listeners, sockjsOptions = {}) => {
  let clients = []

  const server = sockjs.createServer(sockjsOptions)

  server.on('connection', function (socket) {
    const client = wrapSocket(socket)
    clients.push(client)

    client.verified = false
    client.verifying = false

    const sockjsClose = client.close
    client.close = (client, reason) => {
      clients = clients.filter((curr) => curr !== client)
      client.send({ type: '@server>error', payload: reason })
      client.verified = false
      client.verifying = false
      sockjsClose.call(client, [])
    }

    client.broadcast = (action) => {
      clients.forEach((c) => {
        console.log('<<<', action.type, '[broadcast]')
        c.send(action, true)
      })
    }

    client.addListener('@client>token', checkToken)

    // register given listeners
    if (listeners) {
      listeners.forEach(([type, reaction]) => {
        client.addListener(type, reaction)
      })
    }
  })

  return server
}
