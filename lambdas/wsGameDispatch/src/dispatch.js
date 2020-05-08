import { createClient } from '@fabienjuif/dynamo-client'
import { broadcast } from '@subterra/ws-utils'
import { setState } from './setState'

const dynamoClient = createClient()

export const dispatch = (game, userId) => async (engine, actions) => {
  const prevState = engine.getState()

  const wsConnections = dynamoClient.collection('wsConnections')

  // dispatch actions
  ;[].concat(actions).forEach((action) =>
    engine.dispatch({
      ...action,
      userId,
    }),
  )
  const newState = engine.getState()

  // closure to broadcast new state
  const broadcastState = () =>
    broadcast(game.connectionsIds, setState(newState))

  // closure to update game
  const udpateGame = () =>
    dynamoClient.docClient
      .update({
        TableName: 'games',
        Key: {
          id: game.id,
        },
        UpdateExpression:
          'set updatedAt = :updatedAt, actions = list_append(actions, :actions)',
        ExpressionAttributeValues: {
          ':updatedAt': Date.now(),
          ':actions': []
            .concat(actions)
            .map((action) => JSON.stringify(action)),
        },
      })
      .promise()

  // if this is game over clean up all states
  if (newState.gameOver) {
    return Promise.all([
      broadcastState(),
      udpateGame(),
      // remove gameId from connectionsIds (user are not in "game" state)
      // but we keep game row in dynamo so we can do some stats
      ...game.connectionsIds.map((id) =>
        wsConnections.update({
          id,
          lobbyId: undefined,
          gameId: undefined,
          updatedAt: Date.now(),
        }),
      ),
    ])
  }

  // if no modification does nothing
  if (newState === prevState) {
    return Promise.resolve([prevState])
  }

  // if there is modification
  return Promise.all([broadcastState(), udpateGame()])
}
