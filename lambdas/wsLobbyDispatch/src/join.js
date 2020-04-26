import AWS from 'aws-sdk'
import { dispatch } from './dispatch'
import { alreadyInLobby, lobbyNotFound } from './errors'

AWS.config.update({ region: 'eu-west-3' })
const docClient = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' })

export const join = async (wsConnection, lobbyId) => {
  if (wsConnection.lobbyId) {
    return alreadyInLobby(wsConnection.id, {
      lobbyId: wsConnection.lobbyId,
      userId: wsConnection.userId,
    })
  }

  // read lobby
  const { Item: lobby } = await docClient
    .get({
      TableName: 'lobby',
      Key: {
        id: lobbyId,
      },
    })
    .promise()
  if (!lobby) {
    return lobbyNotFound(wsConnection.id, lobbyId)
  }

  const newLobby = {
    ...lobby,
    connectionsIds: [...lobby.connectionsIds, wsConnection.id],
  }

  const [{ Item: user }] = await Promise.all([
    // get the user (to have its pseudo)
    docClient
      .get({
        TableName: 'users',
        Key: {
          id: wsConnection.userId,
        },
        ProjectionExpression: 'pseudo',
      })
      .promise(),

    // update the lobby
    docClient
      .put({
        TableName: 'lobby',
        Item: newLobby,
      })
      .promise(),

    // update wsConnection to match this new lobbyId
    docClient
      .update({
        TableName: 'wsConnections',
        Key: {
          id: wsConnection.id,
        },
        UpdateExpression: 'set lobbyId = :lobbyId',
        ExpressionAttributeValues: {
          ':lobbyId': newLobby.id,
        },
      })
      .promise(),
  ])

  // add the user to the lobby
  await dispatch(newLobby, wsConnection.userId)(lobby.state, {
    type: '@players>add',
    payload: { name: user.pseudo },
  })
}
