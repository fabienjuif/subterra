import { createClient } from '@fabienjuif/dynamo-client'

const dynamoClient = createClient()

export const updateGame = async (connectionId, user, gameId) => {
  if (!gameId) return

  const games = dynamoClient.collection('games')
  const game = await games.get(gameId)

  if (game) {
    await games.put({
      ...game,
      connectionsIds: [
        ...(game.connectionsIds || []).filter((id) => id !== user.connectionId),
        connectionId,
      ],
    })
  }
}
