import React, { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { wrapSubmit } from 'from-form-submit'
import { useToken } from '../userContext'

const Welcome = () => {
  const history = useHistory()
  const [, setToken] = useToken()

  const connect = useCallback(
    wrapSubmit(async (login) => {
      const raw = await fetch('/auth', {
        method: 'POST',
        body: JSON.stringify(login),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (raw.ok) {
        setToken(await raw.text())

        history.push('/lobby')
      }
    }),
    [],
  )

  return (
    <div>
      <form onSubmit={connect}>
        <input name="username" type="text" placeholder="username" />
        <input name="password" type="password" placeholder="password" />
        <button type="submit">connect</button>
      </form>
      <button onClick={() => alert('TODO:')}>local</button>
    </div>
  )
}

export default Welcome
