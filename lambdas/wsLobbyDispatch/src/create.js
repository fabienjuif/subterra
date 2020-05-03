import { createClient } from '@fabienjuif/dynamo-client'
import { nanoid } from 'nanoid'
import createEngine from './engine'
import { dispatch } from './dispatch'
import { alreadyInLobby } from './errors'

const dynamoClient = createClient()

export const create = async (wsConnection, connectionId) => {
  if (wsConnection.lobbyId) {
    return alreadyInLobby(connectionId, {
      lobbyId: wsConnection.lobbyId,
      userId: wsConnection.userId,
    })
  }

  const users = dynamoClient.collection('users')
  const lobbyCollection = dynamoClient.collection('lobby')
  const wsConnections = dynamoClient.collection('wsConnections')

  const lobbyId = nanoid()
  const lobby = {
    id: lobbyId,
    connectionsIds: [connectionId],
    createdAt: Date.now(),
    state: JSON.stringify({ ...createEngine(), id: lobbyId }),
  }
  const [user] = await Promise.all([
    // get the user (to have its pseudo)
    users.get(wsConnection.userId, ['pseudo']),
    // create new lobby
    lobbyCollection.put(lobby),
    // update wsConnection to match this new lobbyId
    wsConnections.update({
      id: connectionId,
      lobbyId: lobby.id,
      updatedAt: Date.now(),
    }),
  ])

  // add the user to the lobby
  await dispatch(lobby, wsConnection.userId)(undefined, {
    type: '@players>add',
    payload: { name: user.pseudo },
  })
}
