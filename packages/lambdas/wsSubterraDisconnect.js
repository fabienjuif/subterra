const AWS = require('aws-sdk')

AWS.config.update({ region: 'eu-west-3' })
const docClient = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' })

exports.arn =
  'arn:aws:lambda:eu-west-3:427962677004:function:wsSubterraDisconnect'

exports.handler = async (event) => {
  console.log(JSON.stringify(event, null, 2))

  const connectionId = event.connectionId || event.requestContext.connectionId
  console.log('connectionId', connectionId)

  if (connectionId) {
    const { Item: connection } = await docClient
      .get({
        TableName: 'wsConnections',
        Key: {
          id: connectionId,
        },
      })
      .promise()

    console.log(JSON.stringify(connection, null, 2))
    if (!connection) return

    await docClient
      .delete({
        TableName: 'wsConnections',
        Key: {
          id: connectionId,
        },
      })
      .promise()

    if (!connection.lobbyId) return
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
