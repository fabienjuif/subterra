import { createClient } from '@fabienjuif/dynamo-client'
import { dispatch } from './dispatch'

const dynamoClient = createClient()

export const leave = async (wsConnection, lobby) => {
  const lobbyCollection = dynamoClient.collection('lobby')
  const wsConnections = dynamoClient.collection('wsConnections')

  let newLobby = {
    ...lobby,
    connectionsIds: lobby.connectionsIds.filter((id) => id !== wsConnection.id),
  }

  const mustRemoveLobby = newLobby.connectionsIds.length === 0

  // if there still has users we just update the lobby
  await Promise.all([
    // update lobby to remove connectionId or remove it if this is empty
    mustRemoveLobby
      ? lobbyCollection.delete(newLobby.id)
      : lobbyCollection.update({
          id: newLobby.id,
          connectionsIds: newLobby.connectionsIds,
        }),
    // update wsConnection to remove the lobbyId
    wsConnections.update({
      id: wsConnection.id,
      lobbyId: undefined,
    }),
  ])

  // remove user from the lobby state
  if (!mustRemoveLobby) {
    await dispatch(newLobby, wsConnection.userId)(newLobby.state, {
      type: '@players>remove',
    })
  }
}
