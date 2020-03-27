import React, { useState, useEffect } from 'react'
import cn from 'classnames'
import { provider, useStateAt, useDispatch } from '@myrtille/react'
import { createEngine } from './engine'
import Grid from './components/grid'
import Player from './components/ui/player'
import CardsDeck from './components/cardsDeck'
import Logs from './components/logs'
import MovableGrid from './components/movableGrid'
import { getWrappingCells, isCellEqual } from './utils/tiles'
import { getRandomInArray, roll6 } from './utils/dices'
import cards from './utils/cards'
import classes from './app.module.scss'
import { initState } from './engine/core'

function App() {
  const state = useStateAt()
  const dispatch = useDispatch()
  const [cells, setCells] = useState([])

  useEffect(() => {
    dispatch({
      type: '@cards>init',
      payload: [
        ...Array.from({ length: 10 }).map(() =>
          getRandomInArray(cards.slice(1)),
        ),
        cards[0],
      ],
    })
    dispatch({
      type: '@dices>init',
      payload: Array.from({ length: 5000 }).map(() => roll6()),
    })
    dispatch('@players>init')

    // this is for debug purpose
    dispatch('@cards>pick')
    dispatch('@cards>pick')
    dispatch('@cards>pick')
    dispatch('@cards>pick')
  }, [dispatch])

  useEffect(() => {
    let cells = getWrappingCells(state.grid)

    cells = cells.map((cell) => ({
      ...cell,
      actions: state.playerActions.possibilities.filter((action) =>
        isCellEqual(action.cell)(cell),
      ),
    }))

    setCells(cells)
  }, [state.grid, state.playerActions.possibilities])

  if (state.players.length === 0) return null

  return (
    <div className={cn('app', classes.app)}>
      <div className={cn('players', classes.players)}>
        <button onClick={() => dispatch('@players>pass')}>pass</button>
        {state.players.map((player) => (
          <Player key={player.id} {...player} />
        ))}
      </div>
      <MovableGrid className={cn('board', classes.board)}>
        <Grid
          onAction={dispatch}
          cells={cells}
          players={state.players}
          nextTile={state.playerActions.tile}
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

export default provider(
  createEngine({
    ...initState(),
    // mock necessary as long as the view or explore actions are not functional.
    grid: [
      {
        id: 0,
        type: 'start',
        bottom: true,
        top: true,
        left: true,
        right: true,
        x: 0,
        y: 0,
        status: [],
      },
      { id: 1, type: 'end', bottom: true, x: 0, y: 1, status: [] },
      {
        id: 2,
        type: 'gaz',
        left: true,
        top: true,
        bottom: true,
        x: 1,
        y: 0,
        status: [],
      },
      { id: 3, bottom: true, x: 1, y: 1, status: [] },
      { id: 4, type: 'water', left: true, top: true, x: 1, y: -1 },
      {
        id: 5,
        type: 'landslide',
        dices: [2, 3],
        top: true,
        right: true,
        x: 0,
        y: -1,
        status: [],
      },
      {
        id: 6,
        top: true,
        bottom: true,
        left: true,
        right: true,
        x: -1,
        y: -1,
        status: [],
      },
      { id: 7, type: 'tight', right: true, top: true, x: -1, y: 0, status: [] },
      {
        id: 8,
        type: 'enemy',
        top: true,
        bottom: true,
        left: true,
        right: true,
        x: -1,
        y: 1,
        status: [],
      },
    ],
    // mock necessary as long as possibilities are not calculated
    playerActions: {
      tile: undefined,
      current: {}, // action the player is currently doing
      possibilities: [
        {
          type: '@players>move',
          payload: { playerName: 'Sutat', cost: 1, x: 0, y: 1 },
        },
        {
          type: '@players>move',
          payload: { playerName: 'Sutat', cost: 1, x: 1, y: 0 },
        },
        {
          type: '@players>move',
          payload: { playerName: 'Sutat', cost: 1, x: 0, y: -1 },
        },
        {
          type: '@players>move',
          payload: { playerName: 'Sutat', cost: 2, x: -1, y: 0 },
        },
      ],
    },
  }),
)(App)
