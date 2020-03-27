import React, { useState, useCallback } from 'react'
import { Provider } from '@myrtille/react'
import { createEngine } from './engine'
import { Prepare, Game } from './screens'

const App = () => {
  const [engine, setEngine] = useState()

  const onStart = useCallback(({ cards, dices, players }) => {
    const engine = createEngine()

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
