import React, { useState, useEffect, useContext } from 'react'
import cn from 'classnames'
import { motion } from 'framer-motion'
import { useParams, useHistory } from 'react-router-dom'
import { createEngine, initState } from '@subterra/engine'
import { tiles as tilesHelpers } from '@subterra/engine'
import {
  Grid,
  UIPlayer,
  CardsDeck,
  Logs,
  MovableGrid,
  FirebaseContext,
} from '../components'
import classes from './game.module.scss'

const Game = ({ cards, players, tiles, dices }) => {
  const { gameId } = useParams()
  const history = useHistory()
  const { fetch, firebase } = useContext(FirebaseContext)

  const [cells, setCells] = useState([])
  const [orderedPlayers, setOrderedPlayers] = useState([])
  const [{ state, dispatch }, setStore] = useState({
    state: initState(),
    dispatch: () => {},
  })

  useEffect(() => {
    if (gameId) {
      firebase
        .firestore()
        .collection('games')
        .doc(gameId)
        .onSnapshot((doc) => {
          setStore((old) => ({
            ...old,
            state: doc.data().state,
          }))
        })

      setStore((old) => ({
        ...old,
        dispatch: (action) =>
          fetch('/api/lobby/dispatch', {
            method: 'POST',
            body: JSON.stringify(action),
            headers: { 'content-type': 'application/json' },
          }),
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
  }, [cards, dices, fetch, firebase, gameId, history, players, tiles])

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
        <button onClick={() => dispatch('@players>pass')}>pass</button>
        {orderedPlayers.map((player) => (
          <motion.div key={player.type} positionTransition>
            <UIPlayer {...player} />
          </motion.div>
        ))}
      </div>
      <MovableGrid className={cn('board', classes.board)}>
        <Grid
          onAction={dispatch}
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
