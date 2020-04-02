import bodyParser from 'body-parser'
import uuidPackage from 'uuid'
import send from '@polka/send-type'
import { create } from './sock'

const { v4: uuid } = uuidPackage

// TODO: check lobbies timeout time to time
let lobbies = [] // TODO: should be a database
const waitingLobbies = new Set() // TODO: should be a database
const gameNodes = new Map() // TODO: should be a database

/**
 * LobbyId can join the next game node
 */
const joinGameNode = (lobbyId) => {
  waitingLobbies.delete(lobbyId)
  const [gameNodeId, gameNode] = gameNodes.entries().next.value
  // FIXME: need a userId -> client Map
  const lobby = lobbies.find(({ id }) => lobbyId)
  // TODO: send informations to game node (REST)
  lobby.game = {
    id: gameNodeId,
    startedAt: Date.now(),
  }
  // TODO: send @server>redirect / type: 'game'
}

/**
 * Creates or join a lobby when a player ask.
 *
 * If a game is found for this player, we redirect to this game instead.
 * If a lobby is found for this player, we redirect to this lobby instead.
 */
const createOrJoinLobby = (join) => (client, action) => {
  // looking for a lobby
  let lobby = lobbies.find(({ users }) => users.includes(client.user.userId))
  if (lobby && lobby.game) {
    console.log('\tjoining existing game', client.user.userId)
    client.dispatch({
      type: '@server>redirect',
      payload: {
        ...lobby.game,
        type: 'game',
      },
    })
    return
  }

  if (lobby) {
    console.log(
      '\tjoining existing lobby that user did not leave',
      client.user.userId,
    )
  } else {
    if (join) {
      lobby = lobbies.find(({ id }) => id === action.payload.lobbyId)
      if (!lobby || lobby.game) {
        console.log(
          '\tlobby not found or game already started',
          action.payload.lobbyId,
        )

        client.dispatch({
          type: '@server>error',
          payload: {
            message: 'lobby not found or game already started',
            lobbyId: action.payload.lobbyId,
          },
        })
        return
      }

      if (lobby.users.length >= 6) {
        console.log('\tlobby is full', action.payload.lobbyId)

        client.dispatch({
          type: '@server>error',
          payload: {
            message: 'lobby is full',
            lobbyId: action.payload.lobbyId,
          },
        })
        return
      }

      console.log('\tjoining lobby', action.payload.lobbyId)
    } else {
      console.log('\tcreating a new lobby', client.user.userId)
      lobby = {
        id: uuid(),
        users: [client.user.userId],
        startedAt: Date.now(),
        archetypes: new Map(),
      }

      lobbies = [...lobbies, lobby]
    }
  }

  client.dispatch({
    type: '@server>redirect',
    payload: {
      type: 'lobby',
      id: lobby.id,
    },
  })
}

const leaveLobby = (client, action) => {
  const lobby = lobbies.find(({ users }) => users.includes(client.user.userId))
  if (!lobby) return

  lobby.users = lobby.users.filters((userId) => userId !== client.user.userId)
  if (lobby.users.length === 0) {
    lobbies = lobbies.filter((curr) => curr !== lobby)
    waitingLobbies.delete(lobby.id)
  }
}

const startGame = (client, action) => {
  const lobby = lobbies.find(({ id }) => id === action.payload.lobbyId)
  if (!lobby) {
    console.log('\tlobby not found', action.payload.lobbyId)
    send({
      type: '@server>error',
      payload: {
        message: 'lobby not found',
        lobbyId: action.payload.lobbyId,
      },
    })
    return
  }

  const [gameNodeId, gameNode] = gameNodes.entries().next().value || []
  if (!gameNode) {
    console.log(
      '\tno server found yet... adding the lobby in the waiting list',
      action.payload.lobbyId,
    )
    // TODO: when a server add itself it should look at this
    waitingLobbies.add(lobby.id)
    return
  }
  joinGameNode(lobby.id)
}

const listeners = [
  ['@client>create', createOrJoinLobby(false)],
  ['@client>join', createOrJoinLobby(true)],
  ['@client>leave', leaveLobby],
  ['@client>start', startGame],
]

export default (polka, prefix) => {
  const withPrefix = (path) => `${prefix}${path}`

  polka.use(bodyParser.json()).post(withPrefix('/gameNodes'), (req, res) => {
    // TODO: FIXME: security issue, the game server that's call this endpoint
    //       should give a GPG public key
    const { id, url } = req.body
    if (!id || !url) {
      send(res, 400, 'Body needs id and url')
      return
    }

    if (gameNodes.has(id)) {
      console.warn('Node already exists! Changing its informations...', id)
      gameNodes.delete(id)
    }

    gameNodes.add(id, { id, url })
  })

  const sockServer = create(listeners)
  sockServer.installHandlers(polka.server, { prefix })
}
