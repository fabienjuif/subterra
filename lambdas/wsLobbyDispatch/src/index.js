import AWS from 'aws-sdk'
import { create } from './create'
import { dispatch } from './dispatch'
import { webSocketNotFound, userNotInLobby } from './errors'
import { getState } from './getState'

AWS.config.update({ region: 'eu-west-3' })
const docClient = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' })

export const handler = async (event) => {
  const { requestContext, body } = event
  const { connectionId } = requestContext

  const action = JSON.parse(body)
  console.log(connectionId, JSON.stringify(action, null, 2))

  return (async () => {
    const { Item: wsConnection } = await docClient
      .get({
        TableName: 'wsConnections',
        Key: {
          id: connectionId,
        },
        ProjectionExpression: 'id, lobbyId, userId',
      })
      .promise()

    if (!wsConnection) return webSocketNotFound(connectionId)
    if (action.type === '@lobby>create')
      return create(wsConnection, connectionId)
    if (!wsConnection.lobbyId) return userNotInLobby(connectionId)

    const { Item: lobby } = await docClient
      .get({
        TableName: 'lobby',
        Key: {
          id: wsConnection.lobbyId,
        },
        ProjectionExpression: 'id, #s, connectionsIds',
        // we have to do this because state is reserved...
        ExpressionAttributeNames: {
          '#s': 'state',
        },
      })
      .promise()

    if (action.type === '@lobby>getState')
      return getState(connectionId, lobby.state)

    // use engine in all other cases
    return dispatch(lobby, wsConnection.userId)(lobby.state, action)
  })().then(
    () => ({ statusCode: 200 }),
    (err) => ({ statusCode: 500, err }),
  )
}
