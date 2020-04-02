import http from 'http'
import polka from 'polka'
import auth from './auth'
import game from './game'
import lobby from './lobby'

// TODO: in future all servers will be decoupled
//  - auth
//  - lobby
//  - game
// TODO: cert?
const httpServer = http.createServer()

const server = polka({ server: httpServer })

auth(server, '/auth')
game(server, '/game')
lobby(server, '/lobby')

const PORT = process.env.PORT || 9999
const ADDRESS = process.env.ADDRESS || '0.0.0.0'
server.listen(PORT, ADDRESS, () => {
  console.log('listening', ADDRESS, PORT)
})
