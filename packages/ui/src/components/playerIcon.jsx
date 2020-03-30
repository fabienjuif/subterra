import React from 'react'
import cn from 'classnames'
import { TiUser } from 'react-icons/ti'
import classes from './playerIcon.module.scss'

const PlayerIcon = ({ type, className }) => {
  return (
    <TiUser className={cn('icon', className, classes.icon, classes[type])} />
  )
}

export default PlayerIcon
