import { createEngine } from '@subterra/engine'
import http from 'http'
import sockjs from 'sockjs'

const engine = createEngine()

const echo = sockjs.createServer({})
echo.on('connection', function (conn) {
  conn.on('data', function (message) {
    console.log({ message })
    conn.write(message)
  })
  conn.on('close', function () {})
})

const server = http.createServer()
echo.installHandlers(server, { prefix: '/game' })
server.listen(9999, '0.0.0.0')
