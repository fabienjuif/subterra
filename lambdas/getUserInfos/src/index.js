import { pick } from 'lodash'
import { getAndUpdate } from '@subterra/user-utils'

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
  const { headers } = event

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

  const user = await getAndUpdate(headers.Authorization.split('Bearer ')[1])

  return {
    statusCode: 200,
    body: JSON.stringify(pick(user, ['name', 'email', 'picture', 'pseudo'])),
  }
}
