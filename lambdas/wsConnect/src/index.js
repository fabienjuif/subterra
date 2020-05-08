import { createClient } from '@fabienjuif/dynamo-client'
import { getAndUpdate } from '@subterra/user-utils'
import { updateLobby } from './updateLobby'
import { updateGame } from './updateGame'

const dynamoClient = createClient()

exports.handler = async (event) => {
  const { requestContext, queryStringParameters } = event
  if (!requestContext) return
  const { connectionId } = requestContext

  if (!queryStringParameters || !queryStringParameters.token) {
    const error = new Error('Token should be provided in queryParams (token)')
    throw error
  }

  const wsConnections = dynamoClient.collection('wsConnections')
  const users = dynamoClient.collection('users')

  const user = await getAndUpdate(queryStringParameters.token)

  let previousWsConnection
  if (user.connectionId) {
    const wsConnection = await wsConnections.get(user.connectionId)

    previousWsConnection = wsConnection
  }

  await Promise.all([
    // set websocket connectionId to user
    users.update({
      id: user.id,
      connectionId,
      updatedAt: Date.now(),
    }),

    // create connections
    wsConnections.put({
      ...(previousWsConnection || {}),
      id: connectionId,
      createdAt: Date.now(),
      userId: user.id,
    }),
  ])

  if (previousWsConnection) {
    await Promise.all([
      updateLobby(connectionId, user, previousWsConnection.lobbyId),
      updateGame(connectionId, user, previousWsConnection.gameId),
      wsConnections.delete(previousWsConnection.id),
    ])
  }

  return {
    statusCode: 200,
  }
}
