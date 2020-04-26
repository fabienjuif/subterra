const AWS = require('aws-sdk')

// TODO: env var
const WS_API_ENDPOINT =
  'https://iv082u46jh.execute-api.eu-west-3.amazonaws.com/beta'
const DISCONNECT_ARN_LAMBDA =
  'arn:aws:lambda:eu-west-3:427962677004:function:wsDisconnect'

const api = new AWS.ApiGatewayManagementApi({ endpoint: WS_API_ENDPOINT })
const lambda = new AWS.Lambda()

export const broadcast = (connectionsIds, data) => {
  const Data = JSON.stringify(data)

  return Promise.all(
    connectionsIds.map((connectionId) =>
      api
        .postToConnection({
          ConnectionId: connectionId,
          Data,
        })
        .promise()
        .catch((ex) => {
          console.error(ex)

          return lambda
            .invokeAsync({
              FunctionName: DISCONNECT_ARN_LAMBDA,
              InvokeArgs: JSON.stringify({
                connectionId,
              }),
            })
            .promise()
        }),
    ),
  ).catch((err) => {
    console.trace(err)
    if (err.response) console.error(err.response.body)
    throw err
  })
}
