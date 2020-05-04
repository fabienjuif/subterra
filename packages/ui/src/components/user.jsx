import React, { createContext, useState, useEffect, useContext } from 'react'
import createAuth0Client from '@auth0/auth0-spa-js'

// TODO: env variable
const AUTH0_DOMAIN = 'crawlandsurvive.eu.auth0.com'
const AUTH0_CLIENTID = 'l2M5yWr6oaAXcuBpaHD7nZMPHsr2dliI'

const notReady = async () => {
  throw new Error('not ready')
}

const defaultValue = {
  user: undefined,
  logged: false,
  token: undefined,
  logout: notReady,
  login: notReady,
}

const UserContext = createContext(defaultValue)

export const useUser = () => useContext(UserContext)

const UserProvider = ({ children }) => {
  const [value, setValue] = useState({
    ...defaultValue,
  })

  const [auth0, setAuth0] = useState()

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
    let login = notReady
    let logout = notReady

    if (auth0) {
      login = () => auth0.loginWithRedirect()
      logout = () =>
        auth0.logout({
          returnTo: window.location.origin,
        })
    }

    setValue((old) => ({
      ...old,
      logout,
      login,
    }))
  }, [auth0])

  // auto login
  useEffect(() => {
    if (!auth0) return

    const login = async () => {
      const query = window.location.search
      if (query.includes('code=') && query.includes('state=')) {
        await auth0.handleRedirectCallback()
        window.history.replaceState({}, document.title, '/')
      }

      const [logged, token] = await Promise.all([
        auth0.isAuthenticated(),
        auth0.getTokenSilently(),
        auth0.getUser(),
      ])

      setValue((old) => ({
        ...old,
        logged,
        token,
      }))
    }

    login().catch(console.error)
  }, [auth0])

  if (!auth0) return null

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export default UserProvider
