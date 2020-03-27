import React, { useState, useEffect } from 'react'
import cn from 'classnames'
import { useStateAt, useDispatch } from '@myrtille/react'
import { Grid, UIPlayer, CardsDeck, Logs, MovableGrid } from '../components'
import { getWrappingCells, isCellEqual } from '../utils/tiles'
import classes from './game.module.scss'

const Game = () => {
  const state = useStateAt()
  const dispatch = useDispatch()
  const [cells, setCells] = useState([])

  useEffect(() => {
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
          <UIPlayer key={player.id} {...player} />
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

export default Game
