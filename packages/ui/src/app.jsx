import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { Prepare, Game, Lobby, Over, Pseudo, User, Welcome } from './screens'
import { UserProvider, WebSocketProvider, useUser } from './components'
import './variables.css'

const RouteAuthenticated = (props) => {
  const { user } = useUser()

  // TODO: timeout to wait user
  // TODO: if it fails, return to a message screen
  if (!user) return null
  return <Route {...props} />
}

const App = () => {
  return (
    <BrowserRouter>
      <UserProvider>
        {/* TODO: env var */}
        <WebSocketProvider url="wss://iv082u46jh.execute-api.eu-west-3.amazonaws.com/beta/">
          <Switch>
            <Route exact path="/" component={Welcome} />
            <Route exact path="/gameover" component={Over} />
            <Route exact path="/local" component={Prepare} />

            <RouteAuthenticated
              exact
              path={['/lobby', '/lobby/:lobbyId']}
              component={Lobby}
            />
            <RouteAuthenticated
              exact
              path={['/game', '/game/:gameId']}
              component={Game}
            />
            <RouteAuthenticated exact path="/user" component={User} />
            <RouteAuthenticated exact path="/pseudo" component={Pseudo} />
          </Switch>
        </WebSocketProvider>
      </UserProvider>
    </BrowserRouter>
  )
}

export default App
