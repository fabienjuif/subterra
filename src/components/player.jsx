import React from 'react'
import cn from 'classnames'
import classes from './player.module.scss'

const Player = ({ health, archetype }) => {
  return (
    <div className={cn('player', classes.player, classes[archetype])}>
      {health <= 0 && <span>X</span>}
    </div>
  )
}

export default Player
