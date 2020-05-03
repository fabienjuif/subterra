import React, { useCallback, useState, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import cn from 'classnames'
// TODO: remove this dependency import SockJS from 'sockjs-client'
import { wrapSubmit } from 'from-form-submit'
import { Archetype, useWebSocket } from '../components'
import classes from './lobby.module.scss'

const Lobby = () => {
  const history = useHistory()
  const [state, setState] = useState({})
  const { lobbyId } = useParams()

  const dispatch = useWebSocket(
    'lobby',
    useCallback(
      (action) => {
        if (action.type === '@server>setState') {
          setState(action.payload)
        } else if (action.type === '@server>redirect') {
          history.push(`/${action.payload.domain}/${action.payload.id}`)
        } else {
          console.trace('Action unknown: ', action)
        }
      },
      [history],
    ),
  )

  useEffect(() => {
    dispatch({ type: '@client>init' }, false)
  }, [dispatch])

  useEffect(() => {
    if (lobbyId !== state.id) {
      if (lobbyId) dispatch({ type: '@lobby>getState' })
      if (state.id) history.push(`/lobby/${state.id}`)
    }
  }, [lobbyId, dispatch, state.id, history])

  const onStart = useCallback(() => {
    dispatch({ type: '@lobby>start' })
  }, [dispatch])

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
      dispatch({
        type: '@lobby>join',
        payload: {
          id: lobbyId,
        },
      })
    }),
    [dispatch],
  )

  const onCreate = useCallback(() => {
    dispatch({ type: '@lobby>create' })
  }, [dispatch])

  const onLeave = useCallback(async () => {
    dispatch({ type: '@lobby>leave' })
    setState({})
    history.push('/lobby')
  }, [dispatch, history])

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
