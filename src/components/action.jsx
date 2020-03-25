import React from 'react'

import cn from 'classnames'
import classes from './action.module.scss'

const Action = ({ onClick, ...action }) => {
  return (
    <button
      className={cn('action', classes.action)}
      onClick={(e) => onClick && onClick(action)}
    >
      {action.type}
    </button>
  )
}

export default Action
