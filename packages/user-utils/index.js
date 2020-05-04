import fetch from 'node-fetch'
import { pick } from 'lodash'
import { createClient } from '@fabienjuif/dynamo-client'

const dynamoClient = createClient()

export const getAndUpdate = async (token) => {
  if (!token) {
    const error = new Error('Token should be set')
    error.code = 'no_token_provided'
    throw error
  }

  // TODO: env variable
  const AUTH0_API_ENDPOINT = 'https://crawlandsurvive.eu.auth0.com'

  const auth0User = await fetch(`${AUTH0_API_ENDPOINT}/userinfo`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then((d) => d.json())

  const users = dynamoClient.collection('users')

  let user = await users.get(auth0User.sub)

  user = {
    id: auth0User.sub,
    ...pick(auth0User, ['name', 'email', 'picture']),
    pseudo: auth0User.nickname,
    createdAt: Date.now(),
    ...user,
    updatedAt: Date.now(),
    [auth0User.sub.split('|')[0]]: auth0User,
  }

  await users.put(user)

  return user
}
