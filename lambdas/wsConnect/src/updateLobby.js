import { createClient } from '@fabienjuif/dynamo-client'

const dynamoClient = createClient()

export const updateLobby = async (connectionId, user, lobbyId) => {
  if (!lobbyId) return

  const lobbyCollection = dynamoClient.collection('lobby')
  const lobby = await lobbyCollection.get(lobbyId)

  if (lobby) {
    await lobbyCollection.put({
      ...lobby,
      updatedAt: Date.now(),
      connectionsIds: [
        ...(lobby.connectionsIds || []).filter(
          (id) => id !== user.connectionId,
        ),
        connectionId,
      ],
    })
  }
}
