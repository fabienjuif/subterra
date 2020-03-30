import React, { useState, useEffect } from 'react'
import cn from 'classnames'
import { getCellsBounds, isCellEqual } from '../utils/tiles'
import Cell from './cell'
import classes from './grid.module.scss'

const Grid = ({ cells, onAction, players, nextTile, possibilities }) => {
  const [translateX, setTranslateX] = useState(0)
  const [translateY, setTranslateY] = useState(0)

  useEffect(() => {
    const { left, top } = getCellsBounds(cells)

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
          (!nextTile || !isCellEqual(cell)(nextTile)) && (
            <Cell
              key={`${cell.x}:${cell.y}`}
              {...cell}
              onAction={onAction}
              players={players.filter(isCellEqual(cell))}
            />
          ),
      )}

      {nextTile && (
        <Cell
          {...nextTile}
          tile={nextTile}
          empty={false}
          actions={possibilities}
          onAction={onAction}
        />
      )}
    </div>
  )
}

export default Grid
