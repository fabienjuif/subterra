const AWS = require('aws-sdk')

AWS.config.update({ region: 'eu-west-3' })
const ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' })

exports.arn =
  'arn:aws:lambda:eu-west-3:427962677004:function:wsSubterraDisconnect'

exports.handler = async (event) => {
  const { requestContext } = event
  const { connectionId } = requestContext

  const params = {
    TableName: 'websockets',
    Key: {
      connectionId: {
        S: connectionId,
      },
    },
  }

  await ddb.deleteItem(params).promise()

  return {
    statusCode: 200,
  }
}
