import React from 'react'
import cn from 'classnames'
import Action from '../action'
import classes from './player.module.scss'
import gameClasses from '../playerIcon.module.scss' // TODO: use icon react

const PLAYER_ACTIONS_TYPES = ['@players>heal']

const Player = ({
  id,
  actionPoints,
  health,
  name,
  type,
  current,
  possibilities,
}) => {
  return (
    <table
      className={cn('player', classes.player, gameClasses[type], {
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
          <td>{type}</td>
        </tr>
        <tr>
          <td>action points</td>
          <td>{actionPoints}</td>
        </tr>
        <tr>
          <td>health</td>
          <td>{health}</td>
        </tr>
        <tr>
          <td colSpan={2}>
            {possibilities
              .filter((possibility) => {
                const action =
                  possibility.payload.actionOnSuccess || possibility
                const { type, payload } = action

                return (
                  payload.playerId === id && PLAYER_ACTIONS_TYPES.includes(type)
                )
              })
              .map((possibility) => (
                <Action {...possibility} />
              ))}
          </td>
        </tr>
      </tbody>
    </table>
  )
}

export default Player
