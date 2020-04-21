const AWS = require('aws-sdk')

AWS.config.update({ region: 'eu-west-3' })
const docClient = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' })

const WS_API_ENDPOINT =
  'https://iv082u46jh.execute-api.eu-west-3.amazonaws.com/beta'

const api = new AWS.ApiGatewayManagementApi({ endpoint: WS_API_ENDPOINT })

exports.handler = async (event) => {
  const { requestContext, body } = event
  const { connectionId } = requestContext

  const action = JSON.parse(body)
  console.log(JSON.stringify(action, null, 2))

  if (action.type === '@client>getState') {
    const { Item: connection } = await docClient
      .get({
        TableName: 'wsConnections',
        Key: {
          id: connectionId,
        },
        ProjectionExpression: 'id, lobbyId',
      })
      .promise()

    let state
    if (connection.lobbyId) {
      const { Item: lobby } = await docClient
        .get({
          TableName: 'lobby',
          Key: {
            id: connection.lobbyId,
          },
          ProjectionExpression: '#s',
          // we have to do this because state is reserved...
          ExpressionAttributeNames: {
            '#s': 'state',
          },
        })
        .promise()

      state = lobby.state
    }

    await api
      .postToConnection({
        ConnectionId: connectionId,
        Data: JSON.stringify({
          type: '@server>setState',
          payload: JSON.parse(state),
        }),
      })
      .promise()
  }

  return {
    statusCode: 200,
  }
}
