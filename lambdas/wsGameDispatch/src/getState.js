import AWS from 'aws-sdk'
import { setState } from './setState'

// TODO: env var
const WS_API_ENDPOINT =
  'https://iv082u46jh.execute-api.eu-west-3.amazonaws.com/beta'

const api = new AWS.ApiGatewayManagementApi({ endpoint: WS_API_ENDPOINT })

export const getState = (connectionId, state) =>
  api
    .postToConnection({
      ConnectionId: connectionId,
      Data: JSON.stringify(setState(state)),
    })
    .promise()
