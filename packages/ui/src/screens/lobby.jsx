import React, { useEffect, useRef, useCallback } from 'react'
import { useHistory, useParams, useLocation } from 'react-router-dom'
import cn from 'classnames'
import SockJS from 'sockjs-client'

const Lobby = () => {
  const sendRef = useRef()
  const location = useLocation()
  const history = useHistory()
  const { lobbyId } = useParams()

  useEffect(() => {
    if (sendRef.current) return

    if (!location.state || !location.state.token) {
      history.push('/')
      return
    }

    const server = new SockJS('/lobby/ws')

    sendRef.current = (action) => server.send(JSON.stringify(action))

    // send our token
    const sendToken = () =>
      sendRef.current({
        type: '@client>token',
        payload: location.state.token,
      })

    server.onmessage = function (e) {
      const action = JSON.parse(e.data)

      const { type, payload } = action

      if (type === '@server>error') {
        console.error(action)
        return
      } else if (type === '@server>redirect') {
        history.push(`/${payload.type}/${payload.id}`)
        return
      }

      console.warn('Unknown type from server', type)
    }

    server.onclose = function () {
      console.log('TODO: close server socket')
    }

    server.onopen = () => {
      sendToken()
      sendRef.current({ type: '@client>create' })
    }
  }, [location.state, history])

  const onStart = useCallback(() => {
    sendRef.current({ type: '@client>start' })
  }, [])

  if (!lobbyId) {
    return <div>Creating lobby...</div>
  }

  return (
    <div className={cn('lobby')}>
      Lobby {lobbyId}
      <button type="button" onClick={onStart}>
        start
      </button>
    </div>
  )
}

export default Lobby
