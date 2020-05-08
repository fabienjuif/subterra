import fetch from 'node-fetch'
import { pick } from 'lodash'
import { createClient } from '@fabienjuif/dynamo-client'

// TODO: env var
const MAX_TRY = 3
const dynamoClient = createClient()

export const getAndUpdate = async (token) => {
  if (!token) {
    const error = new Error('Token should be set')
    error.code = 'no_token_provided'
    throw error
  }

  // TODO: env variable
  const AUTH0_API_ENDPOINT = 'https://crawlandsurvive.eu.auth0.com'

  let retry = 0
  let auth0User
  let lastKnownException

  while (!auth0User && retry < MAX_TRY) {
    try {
      auth0User = await fetch(`${AUTH0_API_ENDPOINT}/userinfo`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((d) => d.json())
    } catch (ex) {
      lastKnownException = ex
    }
    retry += 1
  }

  if (!auth0User) {
    console.trace(lastKnownException)
    console.error('Retried times:', retry)
    return {
      statusCode: 500,
    }
  }

  const users = dynamoClient.collection('users')

  let user = await users.get(auth0User.sub)

  user = {
    ...pick(auth0User, ['name', 'email', 'picture']),
    ...user,
    id: auth0User.sub,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    [auth0User.sub.split('|')[0]]: auth0User,
  }

  await users.put(user)

  return user
}
