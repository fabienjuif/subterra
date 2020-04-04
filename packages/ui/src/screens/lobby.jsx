import React, { useEffect, useRef, useCallback, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import cn from 'classnames'
import SockJS from 'sockjs-client'
import { wrapSubmit } from 'from-form-submit'
import { Archetype } from '../components'
import { useToken } from '../userContext'
import classes from './lobby.module.scss'

const Lobby = () => {
  const [token] = useToken()
  const sendRef = useRef()
  const history = useHistory()
  const { lobbyId } = useParams()
  const [{ state, dispatch }, setStore] = useState({
    state: {},
    dispatch: () => {},
  })

  useEffect(() => {
    if (sendRef.current) return

    if (!token) {
      history.push('/')
      return
    }

    const server = new SockJS('/lobby/ws')

    sendRef.current = (action) => server.send(JSON.stringify(action))

    // send our token
    const sendToken = () =>
      sendRef.current({
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
        history.push(`/${payload.type}/${payload.id}`)
        return
      } else if (type === '@server>setState') {
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

      setStore((old) => ({
        ...old,
        dispatch: (action) => {
          sendRef.current({ type: '@client>dispatch', payload: action })
        },
      }))
    }
  }, [token, history, lobbyId])

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

  const onJoin = useCallback(
    wrapSubmit(({ lobbyId }) => {
      sendRef.current({
        type: '@client>join',
        payload: {
          lobbyId,
        },
      })
    }),
    [],
  )

  const onCreate = useCallback(() => {
    sendRef.current({ type: '@client>create' })
  }, [])

  const onLeave = useCallback(() => {
    sendRef.current({ type: '@client>leave' })
    history.push('/lobby')
  }, [history])

  if (!lobbyId) {
    return (
      <div>
        online
        <div>
          <button onClick={onCreate}>create</button>
          <form onSubmit={onJoin}>
            <input type="text" placeholder="id" name="lobbyId" />
            <button type="submit">join</button>
          </form>
        </div>
      </div>
    )
  }

  if (!state.players) {
    return <div>Joining lobby...</div>
  }

  return (
    <div className={cn('lobby')}>
      Lobby {lobbyId}
      <div className={cn('archetypes', classes.archetypes)}>
        {state.archetypes.map((archetype) => (
          <Archetype
            {...archetype}
            onClick={onChooseArchetype}
            key={archetype.type}
          />
        ))}
      </div>
      <div className={cn('players', classes.players)}>
        {state.players.map((player) => (
          <div key={player.id}>
            <div>{player.name}</div>
            {player.archetype && <Archetype {...player.archetype} />}
          </div>
        ))}
      </div>
      <button type="button" onClick={onStart}>
        start
      </button>
      <button type="button" onClick={onLeave}>
        leave
      </button>
    </div>
  )
}

export default Lobby
