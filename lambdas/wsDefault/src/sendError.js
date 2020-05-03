import AWS from 'aws-sdk'

// TODO: env var
const WS_API_ENDPOINT =
  'https://iv082u46jh.execute-api.eu-west-3.amazonaws.com/beta'

const api = new AWS.ApiGatewayManagementApi({ endpoint: WS_API_ENDPOINT })

export const sendError = async (connectionId, error) => {
  console.trace(error)

  await api
    .postToConnection({
      ConnectionId: connectionId,
      Data: JSON.stringify({
        type: '@server>error',
        payload: error,
      }),
    })
    .promise()

  return { statusCode: 200 }
}
