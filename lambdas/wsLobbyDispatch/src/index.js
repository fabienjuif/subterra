import AWS from 'aws-sdk'
import create from './engine'

AWS.config.update({ region: 'eu-west-3' })
const docClient = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' })

const WS_API_ENDPOINT =
  'https://iv082u46jh.execute-api.eu-west-3.amazonaws.com/beta'

const api = new AWS.ApiGatewayManagementApi({ endpoint: WS_API_ENDPOINT })

export const handler = async (event) => {
  const { requestContext, body } = event
  const { connectionId } = requestContext

  const action = JSON.parse(body)
  console.log(JSON.stringify(action, null, 2))

  const { Item: wsConnection } = await docClient
    .get({
      TableName: 'wsConnections',
      Key: {
        id: connectionId,
      },
      ProjectionExpression: 'id, lobbyId',
    })
    .promise()

  if (!wsConnection) {
    const error = {
      code: 'websocket_not_found',
      message: 'Websocket was not found',
      connectionId,
    }
    console.error(error)

    await api
      .postToConnection({
        ConnectionId: connectionId,
        Data: JSON.stringify({
          type: '@server>error',
          payload: error,
        }),
      })
      .promise()

    return
  }

  if (!wsConnection.lobbyId) {
    const error = {
      code: 'user_not_in_lobby_state',
      message: 'the user is not in a lobby state',
      connectionId,
    }
    console.error(error)

    await api
      .postToConnection({
        ConnectionId: connectionId,
        Data: JSON.stringify({
          type: '@server>error',
          payload: error,
        }),
      })
      .promise()

    return
  }

  const { Item: lobby } = await docClient
    .get({
      TableName: 'lobby',
      Key: {
        id: wsConnection.lobbyId,
      },
      ProjectionExpression: 'id, #s',
      // we have to do this because state is reserved...
      ExpressionAttributeNames: {
        '#s': 'state',
      },
    })
    .promise()

  // dispatch action
  const engine = create(JSON.parse(lobby.state))
  engine.dispatch(action)

  // update dynamo
  await docClient
    .update({
      TableName: 'lobby',
      Key: {
        id: lobby.id,
      },
      UpdateExpression: 'set #s = :state',
      ExpressionAttributeNames: {
        '#s': 'state',
      },
      ExpressionAttributeValues: {
        ':state': JSON.stringify(engine.getState()),
      },
    })
    .promise()

  return {
    statusCode: 200,
  }
}
