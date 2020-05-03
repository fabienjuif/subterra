import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { Prepare, Game, Lobby, Over, Welcome } from './screens'
import { UserProvider, WebSocketProvider } from './components'
import './variables.css'

const App = () => {
  return (
    <UserProvider>
      {/* TODO: env var */}
      <WebSocketProvider url="wss://iv082u46jh.execute-api.eu-west-3.amazonaws.com/beta/">
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={Welcome} />
            <Route exact path="/gameover" component={Over} />
            <Route
              exact
              path={['/lobby', '/lobby/:lobbyId']}
              component={Lobby}
            />
            <Route exact path={['/game', '/game/:gameId']} component={Game} />
            <Route exact path="/local" component={Prepare} />
          </Switch>
        </BrowserRouter>
      </WebSocketProvider>
    </UserProvider>
  )
}

export default App
