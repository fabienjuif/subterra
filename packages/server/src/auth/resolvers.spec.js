import { promisify } from 'util'
import jwt from 'jsonwebtoken'
import { getToken, verifyAndGetInfos } from './resolvers'

const verify = promisify(jwt.verify)
const sign = promisify(jwt.sign)

describe('auth/resolvers', () => {
  describe('getToken', () => {
    process.env.PRIVATE_KEY = 'test'

    it.todo('should generate a JWT token')

    it.todo(
      'should NOT generate a JWT token because username does not match password',
    )

    it.todo('should NOT generate a JWT token because username does not exists')
  })

  describe('verifyAndGetInfos', () => {
    it.todo('should retrieve informations from query param')
    it.todo('should retrieve informations from header')
    it.todo('should send error because JWT is not valid')
    it.todo('should send error because no token is found')
  })
})
