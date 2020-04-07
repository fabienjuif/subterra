import { promisify } from 'util'
import send from '@polka/send-type'
import jwt from 'jsonwebtoken'

const sign = promisify(jwt.sign)
const verify = promisify(jwt.verify)

const getPrivateKey = () => {
  let { PRIVATE_KEY } = process.env
  if (!PRIVATE_KEY) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('PRIVATE_KEY must be assigned for security reasons')
    }

    PRIVATE_KEY = 'devmode'
  }

  return PRIVATE_KEY
}

export const getToken = (context) => async (req, res) => {
  const { username, password } = req.body
  const { users } = context

  const user = users.find(
    (user) => user.username === username && user.password === password,
  )
  if (!user) {
    send(res, 401)
  } else {
    const token = await sign({ userId: user.id }, getPrivateKey())

    send(res, 200, token)
  }
}

export const verifyAndGetInfos = (context) => async (req, res) => {
  let token = req.query.token
  if (!token) {
    const authorization = req.headers['authorization']
    if (authorization) {
      const split = authorization.split('Bearer ')
      if (split) token = split[1]
    }
  }

  if (!token) {
    console.trace(new Error('No token found'))
    send(res, 401)
    return
  }

  try {
    const decoded = await verify(token, getPrivateKey())

    // filters what we send to the user
    const { userId } = decoded
    send(res, 200, { userId })
  } catch (ex) {
    console.trace(ex)
    send(res, 401)
    return
  }
}
