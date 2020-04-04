import React, { useState, useCallback } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { Prepare, Game, Lobby, Welcome } from './screens'
import UserProvider from './userContext'
import './variables.css'

const App = () => {
  return (
    <UserProvider>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Welcome} />
          <Route exact path={['/lobby', '/lobby/:lobbyId']} component={Lobby} />
          <Route exact path={['/game', '/game/:gameId']} component={Game} />
        </Switch>
      </BrowserRouter>
    </UserProvider>
  )
  // const [mode, setMode] = useState()
  // const [init, setInit] = useState()

  // const connect = useCallback(
  //   wrapSubmit(async (login) => {
  //     const raw = await fetch('/auth', {
  //       method: 'POST',
  //       body: JSON.stringify(login),
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //     })
  //     if (raw.ok) {
  //       const token = await raw.text()
  //       setInit({ token })
  //       setMode('online')
  //     }
  //   }),
  //   [],
  // )

  // const onStart = useCallback((init) => {
  //   setInit(init)
  // }, [])

  // if (!mode) {
  //   return (
  //     <div>
  //       <form onSubmit={connect}>
  //         <input name="username" type="text" placeholder="username" />
  //         <input name="password" type="password" placeholder="password" />
  //         <button type="submit">connect</button>
  //       </form>
  //       <button onClick={() => setMode('local')}>local</button>
  //     </div>
  //   )
  // }

  // if (init && init.token) return <Lobby {...init} />
  // return null

  // if (mode === 'local') {
  //   if (!init) return <Prepare onStart={onStart} />
  //   return <Game {...init} mode={mode} />
  // }

  // return <Game {...init} mode={mode} />
}

export default App
