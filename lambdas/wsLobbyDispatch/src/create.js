import AWS from 'aws-sdk'
import { nanoid } from 'nanoid'
import createEngine from './engine'
import { dispatch } from './dispatch'
import { alreadyInLobby } from './errors'

AWS.config.update({ region: 'eu-west-3' })
const docClient = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' })

export const create = async (wsConnection, connectionId) => {
  if (wsConnection.lobbyId) {
    return alreadyInLobby(connectionId, {
      lobbyId: wsConnection.lobbyId,
      userId: wsConnection.userId,
    })
  }

  const lobbyId = nanoid()
  const lobby = {
    id: lobbyId,
    connectionsIds: [connectionId],
    state: JSON.stringify({ ...createEngine(), id: lobbyId }),
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

    // create new lobby
    docClient
      .put({
        TableName: 'lobby',
        Item: lobby,
      })
      .promise(),

    // update wsConnection to match this new lobbyId
    docClient
      .update({
        TableName: 'wsConnections',
        Key: {
          id: connectionId,
        },
        UpdateExpression: 'set lobbyId = :lobbyId',
        ExpressionAttributeValues: {
          ':lobbyId': lobby.id,
        },
      })
      .promise(),
  ])

  // add the user to the lobby
  await dispatch(lobby, wsConnection.userId)(undefined, {
    type: '@players>add',
    payload: { name: user.pseudo },
  })
}
