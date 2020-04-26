import AWS from 'aws-sdk'

AWS.config.update({ region: 'eu-west-3' })
const docClient = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' })

export const updateLobby = async (connectionId, user, lobbyId) => {
  if (!lobbyId) return

  const { Item: lobby } = await docClient
    .get({
      TableName: 'lobby',
      Key: {
        id: lobbyId,
      },
    })
    .promise()

  if (lobby) {
    await docClient
      .put({
        TableName: 'lobby',
        Item: {
          ...lobby,
          connectionsIds: [
            ...(lobby.connectionsIds || []).filter(
              (id) => id !== user.connectionId,
            ),
            connectionId,
          ],
        },
      })
      .promise()
  }
}
