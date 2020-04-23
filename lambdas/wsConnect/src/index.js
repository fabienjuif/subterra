const fetch = require('node-fetch')
const { pick } = require('lodash')
const AWS = require('aws-sdk')

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
    [auth0User.sub]: auth0User,
  }

  await docClient
    .put({
      TableName: 'users',
      Item: user,
    })
    .promise()

  let hasPreviousLobby = false

  if (user.connectionId) {
    const { Item: wsConnection } = await docClient
      .get({
        TableName: 'wsConnections',
        Key: {
          id: user.connectionId,
        },
      })
      .promise()

    hasPreviousLobby = !!(wsConnection && wsConnection.lobbyId)
  }

  if (hasPreviousLobby) {
    await docClient
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
      .promise()
  } else {
    await docClient
      .update({
        TableName: 'users',
        Key: {
          id: user.id,
        },
        UpdateExpression:
          'set lobbyId = :lobbyId, connectionId = :connectionId',
        ExpressionAttributeValues: {
          ':lobbyId': '1',
          ':connectionId': connectionId,
        },
      })
      .promise()
  }

  // create connections
  await docClient
    .put({
      TableName: 'wsConnections',
      Item: {
        id: connectionId,
        userId: user.id,
        lobbyId: '1',
      },
    })
    .promise()

  const { Item: lobby } = await docClient
    .get({
      TableName: 'lobby',
      Key: {
        id: '1',
      },
    })
    .promise()

  await docClient
    .put({
      TableName: 'lobby',
      Item: {
        ...lobby,
        connectionsIds: [
          ...(lobby.connectionsIds || []).filter(
            (id) => id !== user.connectionId,
          ),
          connectionId,
        ],
        users: Array.from(new Set([...(lobby.users || []), user.pseudo])),
      },
    })
    .promise()

  return {
    statusCode: 200,
  }
}
