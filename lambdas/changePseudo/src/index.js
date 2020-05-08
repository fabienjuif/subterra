import { createClient } from '@fabienjuif/dynamo-client'
import { getAndUpdate } from '@subterra/user-utils'

const dynamoClient = createClient()

const createError = (message, code, statusCode = 400) => {
  const error = new Error(message)
  error.code = code
  error.statusCode = statusCode

  console.trace(error)

  return {
    statusCode,
    body: JSON.stringify({
      code,
      message,
    }),
  }
}

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
