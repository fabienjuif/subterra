import uuidPackage from 'uuid'
import { promisify } from 'util'
import bodyParser from 'body-parser'
import send from '@polka/send-type'
import jwt from 'jsonwebtoken'

const uuid = uuidPackage.v4
const sign = promisify(jwt.sign)
const verify = promisify(jwt.verify)

let { PRIVATE_KEY } = process.env
if (!PRIVATE_KEY) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('PRIVATE_KEY must be assigned for security reasons')
  }

  PRIVATE_KEY = 'devmode'
}

export default (server, prefix) => {
  const withPrefix = (path) => `${prefix}${path}`

  server
    .use(bodyParser.json())
    .post(withPrefix('/'), async (req, res) => {
      const { username, password } = req.body

      if (username !== 'fabienjuif' || password !== 'oui') {
        // TODO: use database
        send(res, 401)
      } else {
        const userId = uuid() // TODO: use database
        const token = await sign({ userId }, PRIVATE_KEY)

        send(res, 200, token)
      }
    })
    .get(withPrefix('/'), async (req, res) => {
      let token = req.query.token
      if (!token) {
        const authorization = req.headers['authorization']
        if (authorization) {
          const split = authorization.split('Bearer ')
          if (split) token = split[1]
          console.log(token)
        }
      }

      if (!token) {
        console.trace(new Error('No token found'))
        send(res, 401)
        return
      }

      try {
        const decoded = await verify(token, PRIVATE_KEY)

        // filters what we send to the user
        const { userId } = decoded
        send(res, 200, { userId })
      } catch (ex) {
        console.trace(ex)
        send(res, 401)
        return
      }
    })

  console.log('[auth] bounded to', prefix)
}
