import React, { useState, useEffect, useRef, useCallback } from 'react'
import SockJS from 'sockjs-client'
import { Provider } from '@myrtille/react'
import { createEngine, initState } from '@subterra/engine'
import { Prepare, Game } from './screens'
import './variables.css'

const App = () => {
  const sockRef = useRef()
  const dispatchRef = useRef()
  const [state, setState] = useState()

  useEffect(() => {
    sockRef.current = new SockJS('/game')

    sockRef.current.onmessage = function (e) {
      const { type, payload } = JSON.parse(e.data)

      if (type === '@server>setState') {
        console.log(payload)
        return setState(payload)
      }

      console.warn('Unknown type from server', type)
    }

    sockRef.current.onclose = function () {
      console.log('close')
    }

    dispatchRef.current = (action) => {
      sockRef.current.send(
        JSON.stringify({ type: '@client>dispatch', payload: action }),
      )
    }
  }, [])

  // const onStart = useCallback(({ cards, dices, players }) => {
  //   // const engine = createMockedEngine
  //   // engine.dispatch({
  //   //   type: '@cards>init',
  //   //   payload: cards,
  //   // })
  //   // engine.dispatch({
  //   //   type: '@dices>init',
  //   //   payload: dices,
  //   // })
  //   // engine.dispatch({
  //   //   type: '@players>init',
  //   //   payload: players,
  //   // })
  //   // setEngine(engine)
  // }, [])

  if (!state) return <Prepare />

  return (
    // <Provider store={engine}>
    <Game dispatch={dispatchRef.current} state={state} />
    // </Provider>
  )
}

export default App
