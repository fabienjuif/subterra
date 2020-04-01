import React from 'react'
import cn from 'classnames'
import classes from './emptyCell.module.scss'

const EmptyCell = () => {
  return <div className={cn(classes.emptyCell)}>&nbsp;</div>
}

export default EmptyCell
