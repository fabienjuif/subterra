import React, { useState, useEffect } from 'react'
import cn from 'classnames'
import { motion } from 'framer-motion'
import { tiles } from '@subterra/engine'
import { Grid, UIPlayer, CardsDeck, Logs, MovableGrid } from '../components'
import classes from './game.module.scss'

const Game = ({ state, dispatch }) => {
  const [cells, setCells] = useState([])
  const [players, setPlayers] = useState([])

  useEffect(() => {
    let cells = tiles.getWrappingCells(state.grid)

    cells = cells.map((cell) => ({
      ...cell,
      actions: state.playerActions.possibilities.filter((action) =>
        tiles.isCellEqual(action.payload)(cell),
      ),
    }))

    setCells(cells)
  }, [state.grid, state.playerActions.possibilities])

  useEffect(() => {
    if (state.players.length <= 0) return

    const firstPlayerIndex = state.players.findIndex(({ first }) => first)

    setPlayers([
      ...state.players.slice(firstPlayerIndex),
      ...state.players.slice(0, firstPlayerIndex),
    ])
  }, [state.players])

  if (state.players.length === 0) return null

  return (
    <div className={cn('app', classes.app)}>
      <div className={cn('players', classes.players)}>
        <button onClick={() => dispatch('@players>pass')}>pass</button>
        {players.map((player) => (
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
