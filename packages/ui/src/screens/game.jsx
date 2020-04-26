import React, { useState, useEffect, useCallback } from 'react'
import cn from 'classnames'
import SockJS from 'sockjs-client'
import { motion } from 'framer-motion'
import { useParams, useHistory } from 'react-router-dom'
import createStore from '@myrtille/core'
import { createEngine, initState } from '@subterra/engine'
import { tiles as tilesHelpers } from '@subterra/engine'
import {
  Grid,
  UIPlayer,
  CardsDeck,
  Logs,
  MovableGrid,
  useWebSocket,
} from '../components'
import classes from './game.module.scss'

const Game = ({ cards, players, tiles, dices }) => {
  const history = useHistory()
  const { gameId } = useParams()
  const [cells, setCells] = useState([])
  const [orderedPlayers, setOrderedPlayers] = useState([])
  const [{ state, dispatch }, setStore] = useState({
    state: initState(),
    dispatch: () => {},
  })

  const serverDispatch = useWebSocket(
    'game',
    useCallback(
      (action) => {
        if (action.type === '@server>setState') {
          setStore((old) => ({ ...old, state: action.payload }))
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
    if (gameId !== state.id) {
      if (gameId) dispatch({ type: '@game>getState' })
      if (state.id) history.push(`/lobby/${state.id}`)
    }
  }, [gameId, dispatch, state.id, history])

  useEffect(() => {
    if (gameId) {
      setStore((old) => ({
        ...old,
        dispatch: serverDispatch,
      }))
    } else {
      const engine = createEngine()
      // connects engine to react
      setStore((old) => ({ ...old, dispatch: engine.dispatch }))
      engine.subscribe(() =>
        setStore((old) => ({
          ...old,
          state: engine.getState(),
        })),
      )

      // init
      engine.dispatch({ type: '@dices>init', payload: dices })
      engine.dispatch({ type: '@cards>init', payload: cards })
      engine.dispatch({ type: '@tiles>init', payload: tiles })
      engine.dispatch({ type: '@players>init', payload: players })
    }
  }, [cards, dices, gameId, players, serverDispatch, tiles])

  useEffect(() => {
    let cells = tilesHelpers.getWrappingCells(state.grid)

    cells = cells.map((cell) => ({
      ...cell,
      actions: state.playerActions.possibilities.filter((action) =>
        tilesHelpers.isCellEqual(action.payload)(cell),
      ),
    }))

    setCells(cells)
  }, [state.grid, state.playerActions.possibilities])

  useEffect(() => {
    if (state.players.length <= 0) return

    const firstPlayerIndex = state.players.findIndex(({ first }) => first)

    setOrderedPlayers([
      ...state.players.slice(firstPlayerIndex),
      ...state.players.slice(0, firstPlayerIndex),
    ])
  }, [state.players])

  if (state.players.length === 0) return null

  return (
    <div className={cn('app', classes.app)}>
      <div className={cn('players', classes.players)}>
        <button onClick={() => serverDispatch('@players>pass')}>pass</button>
        {orderedPlayers.map((player) => (
          <motion.div key={player.type} positionTransition>
            <UIPlayer {...player} />
          </motion.div>
        ))}
      </div>
      <MovableGrid className={cn('board', classes.board)}>
        <Grid
          onAction={serverDispatch}
          cells={cells}
          players={state.players}
          nextTile={state.playerActions.tile}
          possibilities={state.playerActions.possibilities}
        />
      </MovableGrid>
      <div className={cn('turn', classes.turn)}>turn: {state.turn}</div>
      <div className={cn('tiles-deck', classes.tilesDeck)}>
        tiles: {state.deckTiles.length}
      </div>
      <CardsDeck
        className={cn('cards-deck', classes.cardsDeck)}
        size={state.deckCards.length}
        card={state.activeCard}
      />
      <Logs
        className={cn('logs', classes.logs)}
        actions={state.technical.actions}
      />
    </div>
  )
}

export default Game
