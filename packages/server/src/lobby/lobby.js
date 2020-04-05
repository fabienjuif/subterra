import bodyParser from 'body-parser'
import send from '@polka/send-type'
import { create } from '../sock'
import listeners from './listeners'

const context = {
  // TODO: check lobbies timeout time to time
  clients: new Map(), // <userId,client>
  lobbies: [], // TODO: should be a database
  waitingLobbies: new Set(), // TODO: should be a database
  gameNodes: new Map(), // TODO: should be a database
}

export default (polka, prefix) => {
  const withPrefix = (path) => `${prefix}${path}`

  polka.use(bodyParser.json()).post(withPrefix('/gameNodes'), (req, res) => {
    // TODO: FIXME: security issue, the game server that's call this endpoint
    //       should give a GPG public key
    const { id, url } = req.body
    console.log('gameNode trying to register with id and url', id, url)
    if (!id || !url) {
      send(res, 400, 'Body needs id and url')
      return
    }

    if (context.gameNodes.has(id)) {
      console.warn('Node already exists! Changing its informations...', id)
      context.gameNodes.delete(id)
    }

    // remove lobby attached to this game node (if it exists)
    const lobbyIndex = context.lobbies.findIndex(
      (lobby) => lobby.game.id === id,
    )
    context.lobbies.splice(lobbyIndex, 1)

    // game node is available
    context.gameNodes.set(id, { id, url })
  })

  const sockServer = create(listeners(context))
  sockServer.installHandlers(polka.server, { prefix: `${prefix}/ws` })
}
