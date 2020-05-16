import { createError } from '@subterra/rest-utils'
import { createClient } from '@fabienjuif/dynamo-client'

const dynamoClient = createClient()

export const handler = async (event) => {
  const {
    queryStringParameters: { kind },
  } = event
  if (!kind) {
    return createError('No kind specified in query param "kind"', 'no_kind')
  }

  const items = await dynamoClient
    .collection('subterra_items', 'kind')
    .query({ kind })

  return {
    statusCode: 200,
    body: JSON.stringify({ kind, items }),
  }
}
