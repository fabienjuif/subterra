import React from 'react'
import cn from 'classnames'
import classes from './action.module.scss'

const isExcess = (action) => action.type === '@players>excess'

const mapName = (action) => {
  const type = isExcess(action)
    ? action.payload.actionOnSuccess.type
    : action.type

  if (type.startsWith('@players>')) return type.replace('@players>', '')
  return type
}

const Action = ({ onClick, ...action }) => {
  return (
    <button
      className={cn('action', classes.action, {
        [classes.excess]: isExcess(action),
      })}
      onClick={() => onClick && onClick(action)}
    >
      {mapName(action)}
    </button>
  )
}

export default Action
