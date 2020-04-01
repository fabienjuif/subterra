import React, { useState, useCallback } from 'react'
import { Prepare, Game } from './screens'
import './variables.css'

const App = () => {
  const [mode, setMode] = useState()
  const [init, setInit] = useState()

  const onStart = useCallback((init) => {
    setInit(init)
  }, [])

  if (!mode) {
    return (
      <div>
        <button onClick={() => setMode('online')}>online</button>
        <button onClick={() => setMode('local')}>local</button>
      </div>
    )
  }

  if (mode === 'local') {
    if (!init) return <Prepare onStart={onStart} />
    return <Game {...init} mode={mode} />
  }

  return <Game mode={mode} />
}

export default App
