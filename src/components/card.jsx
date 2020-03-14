import React from 'react'
import cn from 'classnames'
import classes from './card.module.scss'

const Card = ({ id, type }) => {
    return (
        <div className={cn(classes.card, classes[type])}>
            Card - {id}
        </div>
    )
}

export default Card