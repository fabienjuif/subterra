import React, { useState, useEffect } from 'react'
import { Provider } from '@myrtille/react'
import { createEngine } from './engine'
import Game from './screens/game'
import cardsData from './utils/cards'
import { getRandomInArray, roll6 } from './utils/dices'

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

    const engine = createEngine()
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
