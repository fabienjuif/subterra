import { createClient } from '@subterra/dynamodb'

const dynamoClient = createClient()

exports.handler = async (event) => {
  const connectionId = event.connectionId || event.requestContext.connectionId

  if (connectionId) {
    const connection = await dynamoClient
      .collection('wsConnections')
      .get(connectionId)

    if (!connection || !connection.lobbyId) return

    const lobbyCollection = dynamoClient.collection('lobby')
    const lobby = await lobbyCollection.get(connection.lobbyId)
    await lobbyCollection.put({
      ...lobby,
      connectionsIds: (lobby.connectionsIds || []).filter(
        (id) => id !== connectionId,
      ),
    })
  }

  return {
    statusCode: 200,
  }
}
