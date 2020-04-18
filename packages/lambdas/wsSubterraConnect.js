const AWS = require('aws-sdk')

AWS.config.update({ region: 'eu-west-3' })
const ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' })

exports.arn = 'arn:aws:lambda:eu-west-3:427962677004:function:wsSubterraConnect'

exports.handler = async (event) => {
  const { requestContext, headers } = event
  const { connectionId } = requestContext
  const { Authorization } = headers

  // TODO: test jwt token from headers

  const params = {
    TableName: 'websockets',
    Item: {
      connectionId: {
        S: connectionId,
      },
    },
  }

  await ddb.putItem(params).promise()

  return {
    statusCode: 200,
  }
}
