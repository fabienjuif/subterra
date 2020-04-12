import React, { useEffect, useCallback, useState, useContext } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import cn from 'classnames'
import { wrapSubmit } from 'from-form-submit'
// TODO: remove from deps import SockJS from 'sockjs-client'
import { Archetype, FirebaseContext } from '../components'
import classes from './lobby.module.scss'

const Lobby = () => {
  const { firebase, fetch } = useContext(FirebaseContext)
  const history = useHistory()
  const { lobbyId } = useParams()
  const [state, setState] = useState({})

  useEffect(() => {
    if (!lobbyId) return

    firebase
      .firestore()
      .collection('lobby')
      .doc(lobbyId)
      .onSnapshot((doc) => {
        setState(doc.data().state)
      })
  }, [firebase, lobbyId])

  const callAndRedirect = useCallback(
    (url) => async (params = {}) => {
      const res = await fetch(url, { method: 'POST', ...params })
      if (res.ok) {
        const { type, id } = await res.json()
        history.push(`/${type}/${id}`)
        return
      }

      // TODO: handle KO
      console.error(await res.text())
    },
    [history, fetch],
  )

  const onStart = useCallback(callAndRedirect('/api/lobby/start'), [
    callAndRedirect,
  ])
  const onJoin = useCallback(
    wrapSubmit(async ({ lobbyId }) => {
      await callAndRedirect('/api/lobby/join')({
        body: JSON.stringify({ id: lobbyId }),
      })
    }),
    [callAndRedirect],
  )
  const onCreate = useCallback(callAndRedirect('/api/lobby'), [callAndRedirect])
  const onLeave = useCallback(callAndRedirect('/api/lobby/leave'), [
    callAndRedirect,
  ])

  const dispatch = useCallback(
    async (action) => {
      await fetch('/api/lobby/dispatch', {
        method: 'POST',
        body: JSON.stringify(action),
      })
    },
    [fetch],
  )

  const onChooseArchetype = useCallback(
    (type) => {
      dispatch({
        type: '@players>setArchetype',
        payload: { archetypeType: type },
      })
    },
    [dispatch],
  )

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
