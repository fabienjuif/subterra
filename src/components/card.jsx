import React from 'react'
import cn from 'classnames'
import classes from './card.module.scss'

const Card = ({ id, type, text }) => {
  return <div className={cn(classes.card, classes[type])}>{text || type}</div>
}

export default Card
