const AWS = require('aws-sdk')

AWS.config.update({ region: 'eu-west-3' })

// TODO: env variable
const WS_API_ENDPOINT =
  'https://iv082u46jh.execute-api.eu-west-3.amazonaws.com/beta'

const api = new AWS.ApiGatewayManagementApi({ endpoint: WS_API_ENDPOINT })

exports.handler = async (event) => {
  const { requestContext, body } = event
  const { connectionId } = requestContext

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
