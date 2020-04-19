const AWS = require('aws-sdk')

AWS.config.update({ region: 'eu-west-3' })
const docClient = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' })

exports.arn = 'arn:aws:lambda:eu-west-3:427962677004:function:wsSubterraConnect'

// TODO: retrieve this
const USER = {
  id: '1',
  name: 'Fabien JUIF',
  pseudo: 'Sutat',
}

// TODO: env variable
const WS_API_ENDPOINT =
  'https://iv082u46jh.execute-api.eu-west-3.amazonaws.com/beta'

const api = new AWS.ApiGatewayManagementApi({ endpoint: WS_API_ENDPOINT })

exports.handler = async (event) => {
  const { requestContext, headers } = event
  if (!requestContext) return
  const { connectionId } = requestContext
  const { Authorization } = headers

  // TODO: test jwt token from headers

  const { Item: user } = await docClient
    .get({
      TableName: 'users',
      Key: {
        id: USER.id,
      },
      ProjectionExpression: 'id, connectionId',
    })
    .promise()

  const deletePreviousConnection = !!user.connectionId
  let hasPreviousLobby = false

  if (deletePreviousConnection) {
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
          id: USER.id,
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
          id: USER.id,
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
        userId: USER.id,
        lobbyId: '1',
      },
    })
    .promise()

  if (deletePreviousConnection) {
    // TODO: call disconnect lambda
  }

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
        users: Array.from(new Set([...(lobby.users || []), USER.pseudo])),
      },
    })
    .promise()

  console.log({
    deletePreviousConnection,
  })

  return {
    statusCode: 200,
  }
}
