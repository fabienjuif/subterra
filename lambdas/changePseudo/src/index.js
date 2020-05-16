import { createClient } from '@fabienjuif/dynamo-client'
import { getAndUpdate } from '@subterra/user-utils'
import { createError } from '@subterra/rest-utils'

const dynamoClient = createClient()

export const handler = async (event) => {
  const { headers, body } = event

  if (
    !headers ||
    !headers.Authorization ||
    !headers.Authorization.split('Bearer ')[1]
  ) {
    return createError(
      'Token should be provided in Authorization header',
      'token_should_be_in_header',
    )
  }

  const users = dynamoClient.collection('users')
  const user = await getAndUpdate(headers.Authorization.split('Bearer ')[1])

  if (!body) return createError('You should send a body', 'no_body')
  const { pseudo } = JSON.parse(body)
  if (!pseudo) return createError('No pseudo provided', 'no_pseudo')

  await users.update({
    id: user.id,
    pseudo,
    updatedAt: Date.now(),
    newPseudoAt: Date.now(),
    previousPseudo: user.pseudo,
  })

  return {
    statusCode: 201,
  }
}
