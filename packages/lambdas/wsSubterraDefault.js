const AWS = require('aws-sdk')

AWS.config.update({ region: 'eu-west-3' })
const ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' })

exports.arn = 'arn:aws:lambda:eu-west-3:427962677004:function:wsSubterraDefault'

exports.handler = async (event) => {
  const { requestContext, body } = event
  const { connectionId } = requestContext

  // TODO: test jwt token from headers

  const params = {
    TableName: 'websockets',
    Item: {
      connectionId: {
        S: connectionId,
      },
      event: {
        S: JSON.stringify(event),
      },
      action: {
        S: JSON.stringify(body),
      },
    },
  }

  await ddb.putItem(params).promise()

  return {
    statusCode: 200,
  }
}
