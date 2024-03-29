import React from 'react'
import cn from 'classnames'
import classes from './tile.module.scss'

const Tile = ({ id, type, top, bottom, left, right, rotation }) => {
  return (
    <div
      className={cn('tile', classes.tile, classes[type])}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <div>
        {top || <div className={classes.top}>&nbsp;</div>}
        {bottom || <div className={classes.bottom}>&nbsp;</div>}
        {left || <div className={classes.left}>&nbsp;</div>}
        {right || <div className={classes.right}>&nbsp;</div>}
      </div>
    </div>
  )
}

export default Tile
