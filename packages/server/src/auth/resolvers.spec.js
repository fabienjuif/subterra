import { promisify } from 'util'
import jwt from 'jsonwebtoken'
import send from '@polka/send-type'
import { getToken, verifyAndGetInfos } from './resolvers'

jest.mock('@polka/send-type', () => ({ __esModule: true, default: jest.fn() }))

const verify = promisify(jwt.verify)
const sign = promisify(jwt.sign)

describe('auth/resolvers', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('getToken', () => {
    process.env.PRIVATE_KEY = 'test'

    it('should generate a JWT token', async () => {
      await getToken({
        users: [{ id: 'id-test', username: 'test', password: 'yespass' }],
      })(
        {
          body: {
            username: 'test',
            password: 'yespass',
          },
        },
        { res: true },
      )

      expect(send).toHaveBeenCalledTimes(1)
      expect(send).toHaveBeenCalledWith(
        { res: true },
        200,
        expect.stringMatching(/.+/),
      )

      const token = send.mock.calls[0][2]

      expect(await verify(token, 'test')).toEqual(
        expect.objectContaining({ userId: 'id-test' }),
      )
    })

    it('should NOT generate a JWT token because username does not match password', async () => {
      await getToken({
        users: [{ id: 'id-test', username: 'test', password: 'yespass' }],
      })(
        {
          body: {
            username: 'test',
            password: 'nopass',
          },
        },
        { res: true },
      )

      expect(send).toHaveBeenCalledTimes(1)
      expect(send).toHaveBeenCalledWith({ res: true }, 401)
    })

    it('should NOT generate a JWT token because username does not exists', async () => {
      await getToken({
        users: [],
      })(
        {
          body: {
            username: 'no',
            passsword: 'yespass',
          },
        },
        { res: true },
      )

      expect(send).toHaveBeenCalledTimes(1)
      expect(send).toHaveBeenCalledWith({ res: true }, 401)
    })
  })

  describe('verifyAndGetInfos', () => {
    it('should retrieve informations from query param', async () => {
      const token = await sign({ userId: 2 }, 'test')

      await verifyAndGetInfos()(
        { query: { token }, headers: {} },
        { res: true },
      )

      expect(send).toHaveBeenCalledTimes(1)
      expect(send).toHaveBeenCalledWith({ res: true }, 200, {
        userId: 2,
      })
    })

    it('should retrieve informations from header', async () => {
      const token = await sign({ userId: 2 }, 'test')

      await verifyAndGetInfos()(
        { query: {}, headers: { authorization: `Bearer ${token}` } },
        { res: true },
      )

      expect(send).toHaveBeenCalledTimes(1)
      expect(send).toHaveBeenCalledWith({ res: true }, 200, {
        userId: 2,
      })
    })

    it('should send error because JWT is not valid', async () => {
      const token = await sign({ userId: 2 }, 'test2')

      await verifyAndGetInfos()(
        { query: {}, headers: { authorization: `Bearer ${token}` } },
        { res: true },
      )

      expect(send).toHaveBeenCalledTimes(1)
      expect(send).toHaveBeenCalledWith({ res: true }, 401)
    })

    it('should send error because no token is found', async () => {
      await verifyAndGetInfos()({ query: {}, headers: {} }, { res: true })

      expect(send).toHaveBeenCalledTimes(1)
      expect(send).toHaveBeenCalledWith({ res: true }, 401)
    })
  })
})
