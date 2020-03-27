import React, { useState, useEffect } from 'react'
import { Provider } from '@myrtille/react'
import { createEngine } from './engine'
import Game from './screens/game'
import cardsData from './utils/cards'
import { getRandomInArray, roll6 } from './utils/dices'
import { initState } from './engine/core'

const App = () => {
  const [engine, setEngine] = useState()

  useEffect(() => {
    const cards = [
      ...Array.from({ length: 10 }).map(() =>
        getRandomInArray(cardsData.slice(1)),
      ),
      cardsData[0],
    ]

    const dices = Array.from({ length: 5000 }).map(() => roll6())

    const engine = createMockedEngine
    engine.dispatch({
      type: '@cards>init',
      payload: cards,
    })
    engine.dispatch({
      type: '@dices>init',
      payload: dices,
    })
    engine.dispatch('@players>init')

    setEngine(engine)
  }, [])

  if (!engine) return null

  return (
    <Provider store={engine}>
      <Game />
    </Provider>
  )
}

export default App

const createMockedEngine = createEngine({
  ...initState(),
  // mock necessary as long as the view or explore actions are not functional.
  grid: [
    {
      id: 0,
      type: 'start',
      x: 0,
      y: 0,
      top: true,
      right: true,
      bottom: true,
      left: true,
      status: [],
    },
    { id: 1, type: 'end', x: 0, y: -1, bottom: true, status: [] },
    {
      id: 2,
      type: 'gaz',
      x: 1,
      y: 0,
      top: true,
      bottom: true,
      left: true,
      status: [],
    },
    { id: 3, x: 1, y: -1, bottom: true, status: [] },
    { id: 4, type: 'water', x: 1, y: 1, top: true, left: true, status: [] },
    {
      id: 5,
      type: 'landslide',
      dices: [2, 3],
      x: 0,
      y: 1,
      top: true,
      right: true,
      status: [],
    },
    {
      id: 6,
      x: -1,
      y: 1,
      top: true,
      right: true,
      bottom: true,
      left: true,
      status: [],
    },
    { id: 7, type: 'tight', x: -1, y: 0, top: true, right: true, status: [] },
    {
      id: 8,
      type: 'enemy',
      x: -1,
      y: -1,
      top: true,
      right: true,
      bottom: true,
      left: true,
      status: [],
    },
  ],
  // mock necessary as long as possibilities are not calculated
  playerActions: {
    tile: undefined,
    current: {}, // action the player is currently doing
    possibilities: [
      {
        type: '@players>move',
        payload: { playerName: 'Sutat', cost: 1, x: 0, y: -1 },
      },
      {
        type: '@players>move',
        payload: { playerName: 'Sutat', cost: 1, x: 1, y: 0 },
      },
      {
        type: '@players>move',
        payload: { playerName: 'Sutat', cost: 1, x: 0, y: 1 },
      },
      {
        type: '@players>move',
        payload: { playerName: 'Sutat', cost: 2, x: -1, y: 0 },
      },
    ],
  },
})
