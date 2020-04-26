import { createClient } from '@subterra/dynamodb'
import { dispatch } from './dispatch'
import { alreadyInLobby, lobbyNotFound } from './errors'

const dynamoClient = createClient()

export const join = async (wsConnection, lobbyId) => {
  if (wsConnection.lobbyId) {
    return alreadyInLobby(wsConnection.id, {
      lobbyId: wsConnection.lobbyId,
      userId: wsConnection.userId,
    })
  }

  const users = dynamoClient.collection('users')
  const wsConnections = dynamoClient.collection('wsConnections')
  const lobbyCollection = dynamoClient.collection('lobby')

  // read lobby
  const lobby = await lobbyCollection.get(lobbyId)
  if (!lobby) {
    return lobbyNotFound(wsConnection.id, lobbyId)
  }

  const newLobby = {
    ...lobby,
    connectionsIds: [...lobby.connectionsIds, wsConnection.id],
  }

  const [user] = await Promise.all([
    // get the user (to have its pseudo)
    users.get(wsConnection.userId, ['pseudo']),
    // update the lobby
    lobbyCollection.put(newLobby),
    // update wsConnection to match this new lobbyId
    wsConnections.update({
      id: wsConnection.id,
      lobbyId: newLobby.id,
    }),
  ])

  // add the user to the lobby
  await dispatch(newLobby, wsConnection.userId)(lobby.state, {
    type: '@players>add',
    payload: { name: user.pseudo },
  })
}
