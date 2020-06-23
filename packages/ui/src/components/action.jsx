import React from 'react'
import cn from 'classnames'
import classes from './action.module.scss'

const Action = ({ onClick, ...action }) => {
  const isExcess = action.type === '@players>excess'

  return (
    <button
      className={cn('action', classes.action, { [classes.excess]: isExcess })}
      onClick={() => onClick && onClick(action)}
    >
      {isExcess ? action.payload.actionOnSuccess.type : action.type}
    </button>
  )
}

export default Action
