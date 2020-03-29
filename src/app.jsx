import React, { useState, useCallback } from 'react'
import { Provider } from '@myrtille/react'
import { createEngine } from './engine'
import { Prepare, Game } from './screens'
import { initState } from './engine/core'
import './variables.css'

const App = () => {
  const [engine, setEngine] = useState()

  const onStart = useCallback(({ cards, dices, players }) => {
    const engine = createMockedEngine

    engine.dispatch({
      type: '@cards>init',
      payload: cards,
    })
    engine.dispatch({
      type: '@dices>init',
      payload: dices,
    })
    engine.dispatch({
      type: '@players>init',
      payload: players,
    })

    setEngine(engine)
  }, [])

  if (!engine) return <Prepare onStart={onStart} />

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
})
