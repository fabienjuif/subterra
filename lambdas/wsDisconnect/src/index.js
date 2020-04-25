const AWS = require('aws-sdk')

AWS.config.update({ region: 'eu-west-3' })
const docClient = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' })

exports.handler = async (event) => {
  const connectionId = event.connectionId || event.requestContext.connectionId

  if (connectionId) {
    const { Item: connection } = await docClient
      .get({
        TableName: 'wsConnections',
        Key: {
          id: connectionId,
        },
      })
      .promise()

    if (!connection || !connection.lobbyId) return
    const { Item: lobby } = await docClient
      .get({
        TableName: 'lobby',
        Key: {
          id: connection.lobbyId,
        },
      })
      .promise()

    await docClient
      .put({
        TableName: 'lobby',
        Item: {
          ...lobby,
          connectionsId: lobby.connectionsId.filter(
            (id) => id !== connectionId,
          ),
        },
      })
      .promise()
  }

  return {
    statusCode: 200,
  }
}
