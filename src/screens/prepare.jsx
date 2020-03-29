import React, { useState, useCallback } from 'react'
import cn from 'classnames'
import archetypesData from '../utils/archetypes'
import cardsData from '../utils/cards'
import { getRandomInArray, roll6 } from '../utils/dices'
import classes from './prepare.module.scss'

const Prepare = ({ onStart }) => {
  const [archetypesPool, setArchetypesPool] = useState(archetypesData)
  const [archetypes, setArchetypes] = useState([])

  const innerOnStart = useCallback(() => {
    const cards = [
      ...Array.from({ length: 10 }).map(() =>
        getRandomInArray(cardsData.slice(1)),
      ),
      cardsData[0],
    ]

    const dices = Array.from({ length: 5000 }).map(() => roll6())

    onStart({
      cards,
      dices,
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
          <div>
            <h3>archetypes pool</h3>
            <ul>
              {archetypesPool.map(({ type }) => (
                <li
                  key={type}
                  onClick={() => onAddArchetype(type)}
                  className={cn('archetype', classes.archetype)}
                >
                  {type}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3>You choose</h3>
            <ul>
              {archetypes.map(({ type }) => (
                <li
                  key={type}
                  onClick={() => onRemoveArchetype(type)}
                  className={cn('archetype', classes.archetype)}
                >
                  {type}
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