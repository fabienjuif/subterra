import AWS from 'aws-sdk'
import { createClient } from '@fabienjuif/dynamo-client'
import { webSocketNotFound } from './errors'

AWS.config.update({ region: 'eu-west-3' })

const dynamoClient = createClient()

// TODO: env variable
const WS_API_ENDPOINT =
  'https://iv082u46jh.execute-api.eu-west-3.amazonaws.com/beta'

const api = new AWS.ApiGatewayManagementApi({ endpoint: WS_API_ENDPOINT })

exports.handler = async (event) => {
  const { requestContext, body } = event
  const { connectionId } = requestContext

  let action
  try {
    action = JSON.parse(body)
    console.log(connectionId, JSON.stringify(action, null, 2))
  } catch {
    /* ignore error */
  }

  // this is the only action this file will accept
  // - it will redirect the user to the right domain
  if (action && action.type === '@client>init') {
    const wsConnection = await dynamoClient
      .collection('wsConnections')
      .get(connectionId, ['id', 'lobbyId', 'userId'])
    if (!wsConnection) return webSocketNotFound(connectionId)

    let responseAction = {
      type: '@server>init',
      payload: { domain: undefined },
    }
    if (wsConnection.lobbyId) {
      responseAction = {
        type: '@server>redirect',
        payload: {
          domain: 'lobby',
          id: wsConnection.lobbyId,
        },
      }
    }

    return api
      .postToConnection({
        ConnectionId: connectionId,
        Data: JSON.stringify(responseAction),
      })
      .promise()
  }

  const error = {
    code: 'no_domain',
    message: 'domain is not set on body or is not known',
  }
  console.error(JSON.stringify({ ...error, body }, null, 2))

  await api
    .postToConnection({
      ConnectionId: connectionId,
      Data: JSON.stringify({ type: '@server>error', payload: error }),
    })
    .promise()

  return {
    statusCode: 400,
  }
}
