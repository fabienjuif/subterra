import React, { createContext, useState, useContext, useEffect } from 'react'

// TODO: remove

const UserContext = createContext({ token: undefined, setToken: () => {} })

const Provider = ({ children }) => {
  const [value, setValue] = useState({
    token: undefined,
    setToken: (token) => {
      setValue((old) => ({ ...old, token }))
    },
  })

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}
export default Provider

export const useToken = () => {
  const userContext = useContext(UserContext)
  const [token, setToken] = useState(userContext.token)

  useEffect(() => {
    if (token !== userContext.token) setToken(userContext.token)
  }, [token, userContext])

  return [token, userContext.setToken]
}
