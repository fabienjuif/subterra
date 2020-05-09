import { createClient } from '@fabienjuif/dynamo-client'
import { nanoid } from 'nanoid'
import { cards, tiles } from '@subterra/data'
import { createEngine, seeds, initState } from '@subterra/engine'
import { broadcast } from '@subterra/ws-utils'

const dynamoClient = createClient()

export const start = async (wsConnection, lobby) => {
  const lobbyCollection = dynamoClient.collection('lobby')
  const games = dynamoClient.collection('games')
  const wsConnections = dynamoClient.collection('wsConnections')

  const gameId = nanoid()

  const engine = createEngine({
    ...initState(),
    id: gameId,
  })

  const gameState = engine.getState()
  const state = JSON.stringify(gameState)

  const game = {
    id: gameId,
    connectionsIds: lobby.connectionsIds,
    initState: state,
    state,
    actionsSnapshot: [],
    actions: [
      {
        type: '@seeds>init',
        payload: {
          master: seeds.getNanoid(Math.random)(),
        },
      },
      {
        type: '@cards>init',
        payload: {
          remaining: 15,
          deck: cards.map((card) => ({ ...card })),
        },
      },
      {
        type: '@tiles>init',
        payload: {
          remaining: 20,
          deck: tiles.map((tile) => ({ ...tile })),
        },
      },
      {
        type: '@players>init',
        payload: JSON.parse(lobby.state).players,
      },
    ].map((action) => JSON.stringify(action)),
    createdAt: Date.now(),
  }

  await Promise.all([
    // remove lobby
    lobbyCollection.delete(lobby.id),
    // create game
    games.put(game),
    // attach game to the wsConnection
    // remove lobby from the wsConnection
    ...lobby.connectionsIds.map((connectionId) =>
      wsConnections.update({
        id: connectionId,
        updatedAt: Date.now(),
        lobbyId: undefined,
        gameId: game.id,
      }),
    ),
  ])

  // redirect
  broadcast(lobby.connectionsIds, {
    type: '@server>redirect',
    payload: {
      domain: 'game',
      id: game.id,
    },
  })
}
