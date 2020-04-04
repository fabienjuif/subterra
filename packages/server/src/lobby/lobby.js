import got from 'got'
import bodyParser from 'body-parser'
import uuidPackage from 'uuid'
import send from '@polka/send-type'
import { create } from '../sock'
import createEngine from './engine'

const { v4: uuid } = uuidPackage

// TODO: check lobbies timeout time to time
const clients = new Map() // <userId,client>
let lobbies = [] // TODO: should be a database
const waitingLobbies = new Set() // TODO: should be a database
const gameNodes = new Map() // TODO: should be a database

/**
 * Broadcast state to all players in the lobby
 */
const broadcastState = (client, action) => {
  const { lobby } = client
  const { engine } = lobby

  lobby.users.forEach((userId) => {
    const cl = clients.get(userId)
    if (!cl) {
      console.log('\tclient not found while sending the lobby state', userId)
      return
    }

    cl.send({
      type: '@server>setState',
      payload: engine.getState(),
    })
  })
}

/**
 * LobbyId can join the next game node
 */
const joinGameNode = async (client, action) => {
  waitingLobbies.delete(client.lobby.id)
  const [gameNodeId, gameNode] = gameNodes.entries().next().value
  console.log('Joining game server (id/url)', gameNodeId, gameNode.url)

  // remove the gameNode from available list
  gameNodes.delete(gameNodeId)

  // send informations to game server
  await got(gameNode.url, {
    method: 'POST',
    body: JSON.stringify({
      // TODO: only send archetype type and player (id/name)
      players: client.lobby.engine.getState().players,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  })

  // mark the lobby as started
  client.lobby.game = {
    ...gameNode,
    startedAt: Date.now(),
  }

  // send the game url to the lobby users
  client.lobby.users.forEach((userId) => {
    const cl = clients.get(userId)
    if (!cl) {
      console.log('\tclient not found while starting the game', userId)
      return
    }

    cl.send({
      type: '@server>redirect',
      payload: {
        ...client.lobby.game,
        type: 'game',
      },
    })
  })
}

/**
 * Creates or join a lobby when a player ask.
 *
 * If a game is found for this player, we redirect to this game instead.
 * If a lobby is found for this player, we redirect to this lobby instead.
 */
const createOrJoinLobby = (join) => (client, action) => {
  // looking for a lobby
  let lobby = lobbies.find(({ users }) => users.has(client.user.userId))
  if (lobby && lobby.game) {
    console.log('\tjoining existing game', client.user.userId)
    client.send({
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

        client.send({
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

        client.send({
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
        users: new Set([client.user.userId]),
        startedAt: Date.now(),
        engine: createEngine(),
      }

      lobbies = [...lobbies, lobby]
    }
  }

  lobby.users.add(client.user.userId)
  client.lobby = lobby
  lobby.engine.dispatch({
    type: '@players>add',
    payload: {
      name: client.user.name || client.user.userId,
      id: client.user.userId,
    },
  })
  client.send({
    type: '@server>redirect',
    payload: {
      type: 'lobby',
      id: lobby.id,
    },
  })

  broadcastState(client, {})
}

const leaveLobby = (client, action) => {
  if (!client.lobby) {
    console.log(
      '\tlobby not found (trying to leave), user:',
      client.user.userId,
    )
    send({
      type: '@server>error',
      payload: {
        message: 'lobby not found (trying to leave)',
        userId: client.user.userId,
      },
    })
    return
  }

  client.lobby.users.delete(client.user.userId)
  if (client.lobby.users.size === 0) {
    lobbies = lobbies.filter((curr) => curr !== client.lobby)
    waitingLobbies.delete(client.lobby.id)
  }

  client.lobby.engine.dispatch({
    type: '@players>remove',
    payload: { id: client.user.userId },
  })

  broadcastState(client, {})

  client.lobby = undefined
}

const startGame = (client, action) => {
  const lobby = client.lobby

  if (!lobby) {
    console.log(
      '\tlobby not found (trying to start game), user:',
      client.user.userId,
    )
    send({
      type: '@server>error',
      payload: {
        message: 'lobby not found (trying to start game)',
        userId: client.user.userId,
      },
    })
    return
  }

  const gameNode = gameNodes.values().next().value
  if (!gameNode) {
    console.log(
      '\tno server found yet... adding the lobby in the waiting list',
      lobby.id,
    )
    // TODO: when a server add itself it should look at this
    waitingLobbies.add(lobby.id)
    return
  }
  joinGameNode(client, {})
}

const addClient = (client, action) => {
  clients.set(client.user.userId, client)
  // TODO: disconnected
}

const clientDispatch = (client, { payload }) => {
  const { engine } = client.lobby
  // TODO: copy state then dispatch, then check the client has the right to do this?
  //      (anticheat)
  engine.dispatch({ ...payload, userId: client.user.userId })

  // TODO: better logs on server
  console.log('\t-', typeof payload === 'string' ? payload : payload.type)

  broadcastState(client, {})
}

const listeners = [
  ['@server>user>verified', addClient],
  ['@client>create', createOrJoinLobby(false)],
  ['@client>join', createOrJoinLobby(true)],
  ['@client>leave', leaveLobby],
  ['@client>start', startGame],
  ['@client>dispatch', clientDispatch],
]

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

    if (gameNodes.has(id)) {
      console.warn('Node already exists! Changing its informations...', id)
      gameNodes.delete(id)
    }

    // remove lobby attached to this game node (if it exists)
    lobbies = lobbies.filter((lobby) => lobby.game.id !== id)

    // game node is available
    gameNodes.set(id, { id, url })
  })

  const sockServer = create(listeners)
  sockServer.installHandlers(polka.server, { prefix: `${prefix}/ws` })
}
