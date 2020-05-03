import { createClient } from '@fabienjuif/dynamo-client'
import { nanoid } from 'nanoid'
import { cards, tiles } from '@subterra/data'
import { createEngine, dices, initState } from '@subterra/engine'
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
    type: '@tiles>init',
    payload: [
      ...Array.from({ length: 9 }).map(() =>
        dices.getRandomInArray(tiles.slice(2)),
      ),
      tiles[1],
    ],
  })
  engine.dispatch({
    type: '@players>init',
    payload: JSON.parse(lobby.state).players,
  })

  const gameState = engine.getState()

  const game = {
    id: gameId,
    connectionsIds: lobby.connectionsIds,
    state: JSON.stringify(gameState),
    initState: JSON.stringify(gameState),
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
