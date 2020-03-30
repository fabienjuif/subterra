import React, { useState, useEffect } from 'react'
import cn from 'classnames'
import { tiles } from '@subterra/engine'
import Cell from './cell'
import classes from './grid.module.scss'

const Grid = ({ cells, onAction, players, nextTile }) => {
  const [translateX, setTranslateX] = useState(0)
  const [translateY, setTranslateY] = useState(0)

  useEffect(() => {
    const { left, top } = tiles.getCellsBounds(cells)

    setTranslateX(left * -1)
    setTranslateY(top * -1)
  }, [cells])

  return (
    <div
      className={cn('grid', classes.grid)}
      style={{
        transform: `translate(${translateX * 4}em, ${translateY * 4}em)`,
      }}
    >
      {cells.map(
        (cell) =>
          (!nextTile || !tiles.isCellEqual(cell)(nextTile)) && (
            <Cell
              key={`${cell.x}:${cell.y}`}
              {...cell}
              onAction={onAction}
              players={players.filter(tiles.isCellEqual(cell))}
            />
          ),
      )}

      {nextTile && (
        <Cell
          {...nextTile}
          tile={nextTile}
          empty={false}
          actions={[{ code: 'done' }, { code: 'rotate' }]}
          onAction={onAction}
        />
      )}
    </div>
  )
}

export default Grid
