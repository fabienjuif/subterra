import React, { useState, useCallback } from 'react'
import cn from 'classnames'
import {
  archetypes as archetypesData,
  cards as cardsData,
} from '@subterra/data'
import { dices } from '@subterra/engine'
import Archetype from './archetype'
import classes from './prepare.module.scss'

const Prepare = ({ onStart }) => {
  const [archetypesPool, setArchetypesPool] = useState(archetypesData)
  const [archetypes, setArchetypes] = useState([])

  const innerOnStart = useCallback(() => {
    const cards = [
      ...Array.from({ length: 10 }).map(() =>
        dices.getRandomInArray(cardsData.slice(1)),
      ),
      cardsData[0],
    ]

    onStart({
      cards,
      dices: Array.from({ length: 5000 }).map(() => dices.roll6()),
      players: archetypes.map((archetype) => ({
        ...archetype,
        archetype,
        name: archetype.type,
      })),
    })
  }, [onStart, archetypes])

  const onAddArchetype = useCallback((type) => {
    setArchetypesPool((old) => old.filter((a) => a.type !== type))
    setArchetypes((old) => [
      ...old,
      archetypesData.find((a) => a.type === type),
    ])
  }, [])

  const onRemoveArchetype = useCallback((type) => {
    setArchetypes((old) => old.filter((a) => a.type !== type))
    setArchetypesPool((old) => [
      ...old,
      archetypesData.find((a) => a.type === type),
    ])
  }, [])

  return (
    <div>
      <h1>Prepare</h1>
      <div className={cn('players', classes.players)}>
        <h2>Players</h2>
        <div className={cn('body', classes.body)}>
          <div className={cn('side', classes.side)}>
            <h3>archetypes pool</h3>
            <ul className={cn('list', classes.list)}>
              {archetypesPool.map(({ type, ...archetype }) => (
                <li key={type}>
                  <Archetype
                    {...archetype}
                    onClick={() => onAddArchetype(type)}
                    className={cn('archetype', classes.archetype)}
                    type={type}
                  />
                </li>
              ))}
            </ul>
          </div>

          <div className={cn('side', classes.side)}>
            <h3>You choose</h3>
            <ul className={cn('list', classes.list)}>
              {archetypes.map(({ type, ...archetype }) => (
                <li key={type}>
                  <Archetype
                    {...archetype}
                    onClick={() => onRemoveArchetype(type)}
                    className={cn('archetype', classes.archetype)}
                    type={type}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <button onClick={innerOnStart} disabled={archetypes.length < 3}>
        start
      </button>
    </div>
  )
}

export default Prepare
