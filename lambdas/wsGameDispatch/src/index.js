import { createClient } from '@fabienjuif/dynamo-client'
import { dispatch } from './dispatch'
import { webSocketNotFound, userNotInGame, gameNotFound } from './errors'
import { getState } from './getState'
import { createEngine } from '@subterra/engine'

const dynamoClient = createClient()

const MAX_ACTIONS = 5

export const handler = async (event) => {
  const { requestContext, body } = event
  const { connectionId } = requestContext

  const action = JSON.parse(body)
  console.log(connectionId, JSON.stringify(action, null, 2))

  const wsConnections = dynamoClient.collection('wsConnections')
  const games = dynamoClient.collection('games')

  return (async () => {
    const wsConnection = await wsConnections.get(connectionId, [
      'id',
      'gameId',
      'userId',
    ])
    if (!wsConnection) return webSocketNotFound(connectionId)
    if (!wsConnection.gameId) return userNotInGame(connectionId)

    const game = await games.get(wsConnection.gameId, [
      'id',
      'state',
      'actions',
      'connectionsIds',
    ])
    if (!game) return gameNotFound(connectionId, wsConnection.gameId)

    // replay actions on top of the current state
    const engine = createEngine(JSON.parse(game.state))
    game.actions.forEach((action) => engine.dispatch(JSON.parse(action)))

    if (action.type === '@game>getState') {
      return getState(connectionId, engine.getState())
    }

    // use engine in all other cases
    await dispatch(game, wsConnection.userId)(engine, action)

    // if actions list is fat we do a snapshot
    if (game.actions.length + [].concat(action).length > MAX_ACTIONS) {
      await dynamoClient.docClient
        .update({
          TableName: 'games',
          Key: {
            id: game.id,
          },
          UpdateExpression:
            'set updatedAt = :updatedAt, ' +
            'actionsSnapshot = list_append(actionsSnapshot, actions), ' +
            'actions = :actions, ' +
            '#s = :state',
          ExpressionAttributeNames: {
            '#s': 'state',
          },
          ExpressionAttributeValues: {
            ':updatedAt': Date.now(),
            ':actions': [],
            ':state': JSON.stringify(engine.getState()),
          },
        })
        .promise()
    }
  })().then(
    () => ({ statusCode: 200 }),
    (err) => {
      console.trace(err)
      return { statusCode: 500, err }
    },
  )
}
