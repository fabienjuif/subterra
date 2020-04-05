import bodyParser from 'body-parser'
import { getToken, verifyAndGetInfos } from './resolvers'

// TODO: database or auth0
const USERS = [
  { id: 'id-1-fabien', username: 'fabienjuif', password: 'yespassword' },
  { id: 'id-2-florent', username: 'florentjuif', password: 'ouchpassword' },
  {
    id: 'id-3-delphine',
    username: 'delphinemillet',
    password: 'isitapassword',
  },
  { id: 'id-4-wesley', username: 'wesleyruchaud', password: 'youpipassword' },
]

export default (server, prefix) => {
  const withPrefix = (path) => `${prefix}${path}`

  const context = { users: USERS }

  server
    .use(bodyParser.json())
    .post(withPrefix('/'), getToken(context))
    .get(withPrefix('/'), verifyAndGetInfos(context))

  console.log('[auth] bounded to', prefix)
}
