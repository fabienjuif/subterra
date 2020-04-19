const AWS = require('aws-sdk')

exports.arn = 'arn:aws:lambda:eu-west-3:427962677004:function:wsSendLobbyState'

// TODO: env variable
const WS_API_ENDPOINT =
  'https://iv082u46jh.execute-api.eu-west-3.amazonaws.com/beta'

const api = new AWS.ApiGatewayManagementApi({ endpoint: WS_API_ENDPOINT })
const lambda = new AWS.Lambda()

exports.handler = async (event, context) => {
  const { Records } = event
  console.log(JSON.stringify(Records, null, 2))
  const lobby = Records[0].dynamodb.NewImage

  try {
    await Promise.all(
      lobby.connectionsIds.L.map(({ S: connectionId }) =>
        api
          .postToConnection({
            ConnectionId: connectionId,
            Data: lobby.state.S,
          })
          .promise()
          .catch((ex) => {
            console.error(ex)

            return lambda
              .invokeAsync({
                FunctionName:
                  'arn:aws:lambda:eu-west-3:427962677004:function:wsSubterraDisconnect',
                InvokeArgs: JSON.stringify({
                  connectionId,
                }),
              })
              .promise()
          }),
      ),
    )
  } catch (err) {
    console.trace(err)
    if (err.response) console.error(err.response.body)
    throw err
  }
}
