import got from 'got'
import { nanoid } from 'nanoid'
import createEngine from './engine'

/* //////////////////////////////////////////////////////////////////////
 
⚡⚡⚡   This file heavely use mutation.
          This is not myrtille reactions!

Be aware that functions are currified with a context that includes
what will be replaced by data accessors (with database).

The format is this one fonction(context)(client, action)
  - context: contains all data accessors
  - client: this is a wrapped socket that includes:
      * send(action): send to the connected client
      * lobby: the attached lobby if it exists
      * lobby.engine: the lobby engine if it exists
      * user: the related user
  
//////////////////////////////////////////////////////////////////////// */

/**
 * Broadcast state to all players in the lobby
 */
export const broadcastState = (context) => (client, action) => {
  const { clients } = context
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
export const joinGameNode = (context) => async (client, action) => {
  const { waitingLobbies, gameNodes, clients } = context
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
export const createOrJoinLobby = (context) => (join) => (client, action) => {
  const { lobbies } = context

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
        id: nanoid(),
        users: new Set([client.user.userId]),
        startedAt: Date.now(),
        engine: createEngine(),
      }

      lobbies.push(lobby)
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

  broadcastState(context)(client, {})
}

/**
 * Leave lobby
 */
export const leaveLobby = (context) => (client, action) => {
  const { waitingLobbies, lobbies } = context

  if (!client.lobby) {
    console.log(
      '\tlobby not found (trying to leave), user:',
      client.user.userId,
    )
    client.send({
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
    const lobbyIndex = lobbies.findIndex((curr) => curr === client.lobby)
    lobbies.splice(lobbyIndex, 1)
    waitingLobbies.delete(client.lobby.id)
  }

  client.lobby.engine.dispatch({
    type: '@players>remove',
    payload: { id: client.user.userId },
  })

  broadcastState(context)(client, {})

  client.lobby = undefined
}

/**
 * Starting the game.
 */
export const startGame = (context) => (client, action) => {
  const { gameNodes, waitingLobbies } = context
  const lobby = client.lobby

  if (!lobby) {
    console.log(
      '\tlobby not found (trying to start game), user:',
      client.user.userId,
    )
    client.send({
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

  joinGameNode(context)(client, {})
}

/**
 * Add a client
 */
export const addClient = (context) => (client, action) => {
  const { clients } = context

  clients.set(client.user.userId, client)
  // TODO: disconnected
}

/**
 * Calls the engine and broadcast state
 */
export const callsEngineAndBroadcastState = (context) => (
  client,
  { payload },
) => {
  const { engine } = client.lobby
  // TODO: copy state then dispatch, then check the client has the right to do this?
  //      (anticheat)
  engine.dispatch({ ...payload, userId: client.user.userId })

  // TODO: better logs on server
  console.log('\t-', typeof payload === 'string' ? payload : payload.type)

  broadcastState(context)(client, {})
}
