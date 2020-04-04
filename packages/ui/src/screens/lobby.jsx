import React, { useEffect, useRef, useCallback, useState } from 'react'
import { useHistory, useParams, useLocation } from 'react-router-dom'
import cn from 'classnames'
import SockJS from 'sockjs-client'
import { archetypes as archetypesData } from '@subterra/data'
import { Archetype } from '../components'
import classes from './lobby.module.scss'

const Lobby = () => {
  const sendRef = useRef()
  const location = useLocation()
  const history = useHistory()
  const { lobbyId } = useParams()
  const [{ state, dispatch }, setStore] = useState({
    state: {},
    dispatch: () => {},
  })

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
      } else if (type === '@server>setState') {
        console.log(payload)
        setStore((old) => ({ ...old, state: payload }))
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
      setStore((old) => ({
        ...old,
        dispatch: (action) => {
          sendRef.current({ type: '@client>dispatch', payload: action })
        },
      }))
    }
  }, [location.state, history])

  const onStart = useCallback(() => {
    sendRef.current({ type: '@client>start' })
  }, [])

  const onChooseArchetype = useCallback(
    (type) => {
      dispatch({
        type: '@players>setArchetype',
        payload: { archetypeType: type },
      })
    },
    [dispatch],
  )

  if (!lobbyId || !state.players) {
    return <div>Creating lobby...</div>
  }

  return (
    <div className={cn('lobby')}>
      Lobby {lobbyId}
      <div className={cn('archetypes', classes.archetypes)}>
        {state.archetypes.map((archetype) => (
          <Archetype {...archetype} onClick={onChooseArchetype} />
        ))}
      </div>
      <button type="button" onClick={onStart}>
        start
      </button>
    </div>
  )
}

export default Lobby
