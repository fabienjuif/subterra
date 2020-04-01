import React, { useState, useEffect } from 'react'
import cn from 'classnames'
import SockJS from 'sockjs-client'
import { motion } from 'framer-motion'
import createStore from '@myrtille/core'
import { createEngine, initState } from '@subterra/engine'
import { tiles as tilesHelpers } from '@subterra/engine'
import { Grid, UIPlayer, CardsDeck, Logs, MovableGrid } from '../components'
import classes from './game.module.scss'

const Game = ({ mode, cards, players, tiles, dices }) => {
  const [cells, setCells] = useState([])
  const [orderedPlayers, setOrderedPlayers] = useState([])
  const [{ state, dispatch }, setStore] = useState({
    state: initState(),
    dispatch: () => {},
  })

  useEffect(() => {
    if (mode === 'online') {
      const server = new SockJS('/game')

      // this is just for DEBUG purpose in redux-devtools
      let store = { state: {}, dispatch: () => {} }
      if (process.env.NODE_ENV === 'development') {
        store = createStore()
        // TODO: server should send state and the player action that did this state
        //      so we can better debug
        store.addListener('@server>setState', (store, action) => {
          store.setState(action.payload)
        })
      }

      server.onmessage = function (e) {
        const action = JSON.parse(e.data)
        store.dispatch(action)

        const { type, payload } = action
        if (type === '@server>setState') {
          setStore((old) => ({ ...old, state: payload }))
          return
        }

        console.warn('Unknown type from server', type)
      }

      server.onclose = function () {
        console.log('TODO: close server socket')
      }

      setStore((old) => ({
        ...old,
        dispatch: (action) => {
          server.send(
            JSON.stringify({ type: '@client>dispatch', payload: action }),
          )
        },
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
  }, [mode, cards, dices, tiles, players])

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
