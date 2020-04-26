import fetch from 'node-fetch'
import { pick } from 'lodash'
import { createClient } from '@fabienjuif/dynamo-client'
import { updateLobby } from './updateLobby'
import { updateGame } from './updateGame'

const dynamoClient = createClient()

// TODO: env variable
const AUTH0_API_ENDPOINT = 'https://crawlandsurvive.eu.auth0.com'

exports.handler = async (event) => {
  const { requestContext, queryStringParameters } = event
  if (!requestContext) return
  const { connectionId } = requestContext

  if (!queryStringParameters || !queryStringParameters.token) {
    const error = new Error('Token should be provided in queryParams (token)')
    throw error
  }

  const auth0User = await fetch(`${AUTH0_API_ENDPOINT}/userinfo`, {
    headers: { Authorization: `Bearer ${queryStringParameters.token}` },
  }).then((d) => d.json())

  const users = dynamoClient.collection('users')
  const wsConnections = dynamoClient.collection('wsConnections')

  let user = await users.get(auth0User.sub, ['id', 'connectionId'])

  user = {
    id: auth0User.sub,
    ...pick(auth0User, ['name', 'email', 'picture']),
    pseudo: auth0User.nickname,
    ...user,
    [auth0User.sub.split('|')[0]]: auth0User,
  }

  await users.put(user)

  let previousWsConnection
  if (user.connectionId) {
    const wsConnection = await wsConnections.get(user.connectionId)

    previousWsConnection = wsConnection
  }

  await Promise.all([
    // set websocket connectionId to user
    users.update({ id: user.id, connectionId }),

    // create connections
    wsConnections.put({
      ...(previousWsConnection || {}),
      id: connectionId,
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
