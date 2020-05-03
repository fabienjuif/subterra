import { createClient } from '@fabienjuif/dynamo-client'

const dynamoClient = createClient()

exports.handler = async (event) => {
  const connectionId = event.connectionId || event.requestContext.connectionId

  if (connectionId) {
    const connection = await dynamoClient
      .collection('wsConnections')
      .get(connectionId)

    if (!connection) return

    if (connection.lobbyId) {
      const lobbyCollection = dynamoClient.collection('lobby')
      const lobby = await lobbyCollection.get(connection.lobbyId)
      await lobbyCollection.put({
        ...lobby,
        updatedAt: Date.now(),
        connectionsIds: (lobby.connectionsIds || []).filter(
          (id) => id !== connectionId,
        ),
      })
    }

    if (connection.gameId) {
      const games = dynamoClient.collection('games')
      const game = await games.get(connection.gameId)
      await games.put({
        ...game,
        updatedAt: Date.now(),
        connectionsIds: (game.connectionsIds || []).filter(
          (id) => id !== connectionId,
        ),
      })
    }
  }

  return {
    statusCode: 200,
  }
}
