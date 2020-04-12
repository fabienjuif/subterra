import React, { useContext } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { FirebaseContext } from '../components'
import Welcome from './welcome'
import Lobby from './lobby'
import Game from './game'
import Prepare from './prepare/prepare'
import Login from './login'

const Router = () => {
  const { user, isInitialized } = useContext(FirebaseContext)

  if (!isInitialized) return null
  if (!user) return <Login />

  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Welcome} />
        <Route exact path={['/lobby', '/lobby/:lobbyId']} component={Lobby} />
        <Route exact path={['/game', '/game/:gameId']} component={Game} />
        <Route exact path="/local" component={Prepare} />
      </Switch>
    </BrowserRouter>
  )
}

export default Router
