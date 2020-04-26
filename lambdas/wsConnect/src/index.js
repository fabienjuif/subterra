import fetch from 'node-fetch'
import { pick } from 'lodash'
import AWS from 'aws-sdk'
import { updateLobby } from './updateLobby'

AWS.config.update({ region: 'eu-west-3' })
const docClient = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' })

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

  let { Item: user } = await docClient
    .get({
      TableName: 'users',
      Key: {
        id: auth0User.sub,
      },
      ProjectionExpression: 'id, connectionId',
    })
    .promise()

  user = {
    id: auth0User.sub,
    ...pick(auth0User, ['name', 'email', 'picture']),
    pseudo: auth0User.nickname,
    ...user,
    [auth0User.sub.split('|')[0]]: auth0User,
  }

  await docClient
    .put({
      TableName: 'users',
      Item: user,
    })
    .promise()

  let previousWsConnection
  if (user.connectionId) {
    const { Item: wsConnection } = await docClient
      .get({
        TableName: 'wsConnections',
        Key: {
          id: user.connectionId,
        },
      })
      .promise()

    previousWsConnection = wsConnection
  }

  await Promise.all([
    // set websocket connectionId to user
    docClient
      .update({
        TableName: 'users',
        Key: {
          id: user.id,
        },
        UpdateExpression: 'set connectionId = :connectionId',
        ExpressionAttributeValues: {
          ':connectionId': connectionId,
        },
      })
      .promise(),

    // create connections
    docClient
      .put({
        TableName: 'wsConnections',
        Item: {
          ...(previousWsConnection || {}),
          id: connectionId,
          userId: user.id,
        },
      })
      .promise(),
  ])

  if (previousWsConnection) {
    await Promise.all([
      updateLobby(connectionId, user, previousWsConnection.lobbyId),
      docClient
        .delete({
          TableName: 'wsConnections',
          Key: {
            id: previousWsConnection.id,
          },
        })
        .promise(),
    ])
  }

  return {
    statusCode: 200,
  }
}
