import React from 'react'
import cn from 'classnames'
import classes from './player.module.scss'
import gameClasses from '../player.module.scss'

const Player = ({ actionPoints, health, name, archetype, current }) => {
  return (
    <table
      className={cn('player', classes.player, gameClasses[archetype], {
        [classes.current]: current,
      })}
    >
      <tbody>
        <tr>
          <td>name</td>
          <td>{name}</td>
        </tr>
        <tr>
          <td>archetype</td>
          <td>{archetype}</td>
        </tr>
        <tr>
          <td>action points</td>
          <td>{actionPoints}</td>
        </tr>
        <tr>
          <td>health</td>
          <td>{health}</td>
        </tr>
      </tbody>
    </table>
  )
}

export default Player
