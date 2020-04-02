import React, { useEffect } from 'react'
import cn from 'classnames'
import SockJS from 'sockjs-client'

const Lobby = ({ token }) => {
  useEffect(() => {
    const server = new SockJS('/lobby')

    const send = (action) => server.send(JSON.stringify(action))

    // send our token
    const sendToken = () =>
      send({
        type: '@client>token',
        payload: token,
      })

    server.onmessage = function (e) {
      const action = JSON.parse(e.data)

      const { type, payload } = action

      if (type === '@server>error') {
        console.error(action)
        return
      } else if (type === '@server>redirect') {
        console.log(action)
        return
      }

      console.warn('Unknown type from server', type)
    }

    server.onclose = function () {
      console.log('TODO: close server socket')
    }

    server.onopen = () => {
      sendToken()

      // send({ type: '@client>create' })
      send({
        type: '@client>join',
        payload: { lobbyId: '76fe0fc3-5127-4ea1-992b-9ede20673cde' },
      })
    }
  }, [token])

  return <div className={cn('lobby')}>Lobby</div>
}

export default Lobby
