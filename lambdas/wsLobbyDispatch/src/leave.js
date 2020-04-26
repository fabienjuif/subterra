import AWS from 'aws-sdk'
import { dispatch } from './dispatch'

AWS.config.update({ region: 'eu-west-3' })
const docClient = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' })

export const leave = async (wsConnection, lobby) => {
  let newLobby = {
    ...lobby,
    connectionsIds: lobby.connectionsIds.filter((id) => id !== wsConnection.id),
  }

  // if there is no more user in lobby we just remove it
  if (newLobby.connectionsIds.length === 0) {
    return docClient
      .delete({
        TableName: 'lobby',
        Key: {
          id: newLobby.id,
        },
      })
      .promise()
  }

  // if there still has users we just update the lobby
  await Promise.all([
    // update lobby to remove connectionId
    docClient
      .put({
        TableName: 'lobby',
        Item: newLobby,
      })
      .promise(),

    // update wsConnection to remove the lobbyId
    docClient
      .update({
        TableName: 'wsConnections',
        Key: {
          id: wsConnection.id,
        },
        UpdateExpression: 'remove lobbyId',
      })
      .promise(),
  ])

  // remove user from the lobby state
  await dispatch(newLobby, wsConnection.userId)(newLobby.state, {
    type: '@players>remove',
  })
}
