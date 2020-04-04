import React from 'react'
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
          <Route exact path="/local" component={Prepare} />
        </Switch>
      </BrowserRouter>
    </UserProvider>
  )
}

export default App
