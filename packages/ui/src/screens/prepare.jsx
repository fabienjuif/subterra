import React, { useState, useCallback } from 'react'
import cn from 'classnames'
import {
  archetypes as archetypesData,
  cards as cardsData,
  tiles,
} from '@subterra/data'
import seedrandom from 'seedrandom'
import { dices, seeds } from '@subterra/engine'
import { Archetype } from '../components'
import Game from './game'
import classes from './prepare.module.scss'

const Prepare = () => {
  const [archetypesPool, setArchetypesPool] = useState(archetypesData)
  const [archetypes, setArchetypes] = useState([])
  const [startInfos, setStartInfos] = useState(undefined)

  const innerOnStart = useCallback(() => {
    const masterSeed = seeds.getNanoid(Math.random)()
    const masterRandom = seedrandom(masterSeed)
    const masterNanoid = seeds.getNanoid(masterRandom)
    const dicesSeed = masterNanoid()
    const cardsSeed = masterNanoid()
    const tilesSeed = masterNanoid()

    let nextCardsSeed = cardsSeed

    const cards = [
      ...Array.from({ length: 10 }).map(() => {
        const { value, nextSeed } = dices.getRandomInArray(
          cardsData.slice(1),
          nextCardsSeed,
        )
        nextCardsSeed = nextSeed
        return value
      }),
      cardsData[0],
    ]

    setStartInfos({
      cards,
      players: archetypes.map((archetype) => ({
        ...archetype,
        archetype,
        name: archetype.type,
      })),
      tiles: tiles.map((tile) => ({ ...tile })),
      seeds: {
        master: masterSeed,
        tiles: tilesSeed,
        cards: cardsSeed,
        dices: dicesSeed,
      },
    })
  }, [archetypes])

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

  if (startInfos) {
    return <Game {...startInfos} />
  }

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
