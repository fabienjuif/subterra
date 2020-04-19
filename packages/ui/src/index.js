import React, { useEffect, useState, useRef } from 'react'
import ReactDOM from 'react-dom'
import createAuth0Client from '@auth0/auth0-spa-js'
import './index.css'
// import App from './app'
import * as serviceWorker from './serviceWorker'

const AUTH0_DOMAIN = 'crawlandsurvive.eu.auth0.com'
const AUTH0_CLIENTID = 'l2M5yWr6oaAXcuBpaHD7nZMPHsr2dliI'

const App = () => {
  const [auth0, setAuth0] = useState()
  const [logged, setLogged] = useState(false)
  const [token, setToken] = useState()

  useEffect(() => {
    if (!auth0) return

    const login = async () => {
      const query = window.location.search
      if (query.includes('code=') && query.includes('state=')) {
        await auth0.handleRedirectCallback()
        window.history.replaceState({}, document.title, '/')
      }
      setLogged(await auth0.isAuthenticated())
      setToken(await auth0.getTokenSilently())
    }

    login().catch(console.error)
  }, [auth0])

  useEffect(() => {
    createAuth0Client({
      domain: AUTH0_DOMAIN,
      client_id: AUTH0_CLIENTID,
      redirect_uri: window.location.origin,
      scope: 'openid',
      cacheLocation: 'localstorage',
    })
      .then(setAuth0)
      .catch(console.error)
  }, [])

  useEffect(() => {
    if (!token) return

    const ws = new WebSocket(
      `wss://iv082u46jh.execute-api.eu-west-3.amazonaws.com/beta/?token=${token}`,
    )
    ws.onopen = function (event) {
      console.log('open!')
      console.log(event)
      ws.send(
        JSON.stringify({
          type: '@client>getState',
        }),
      )
    }
    ws.onmessage = function (event) {
      console.log('new message:')
      console.log(event)
      console.log(JSON.parse(event.data))
    }
  }, [token])

  const login = () => auth0.loginWithRedirect()

  const logout = () =>
    auth0.logout({
      returnTo: window.location.origin,
    })

  if (!auth0) return null

  return (
    <>
      <h2>SPA Authentication Sample</h2>
      <p>Welcome to our page!</p>
      {logged || (
        <button id="btn-login" onClick={login}>
          Log in
        </button>
      )}
      {logged && (
        <button id="btn-logout" onClick={logout}>
          Log out
        </button>
      )}
    </>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
