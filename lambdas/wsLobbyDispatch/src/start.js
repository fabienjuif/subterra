import { createClient } from '@fabienjuif/dynamo-client'
import { nanoid } from 'nanoid'
import { cards } from '@subterra/data'
import { createEngine, dices, initState } from '@subterra/engine'
import { broadcast } from '@subterra/ws-utils'

const dynamoClient = createClient()

export const start = async (wsConnection, lobby) => {
  const lobbyCollection = dynamoClient.collection('lobby')
  const games = dynamoClient.collection('games')
  const wsConnections = dynamoClient.collection('wsConnections')

  const gameState = createEngine({
    ...initState(),
    players: JSON.parse(lobby.state).players,
    cards: [
      ...Array.from({ length: 10 }).map(() =>
        dices.getRandomInArray(cards.slice(1)),
      ),
      cards[0],
    ],
    dices: Array.from({ length: 5000 }).map(() => dices.roll6()),
  }).getState()

  const game = {
    id: nanoid(),
    connectionsIds: lobby.connectionsIds,
    state: JSON.stringify(gameState),
    initState: JSON.stringify(gameState),
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
