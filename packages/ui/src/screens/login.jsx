import React from 'react'
import { useUser } from '../components'

const Login = () => {
  const user = useUser()
  // TODO: move this
  // useEffect(() => {
  //   if (!token) return

  //   const ws = new WebSocket(
  //     `wss://iv082u46jh.execute-api.eu-west-3.amazonaws.com/beta/?token=${token}`,
  //   )
  //   ws.onopen = function (event) {
  //     console.log('open!')
  //     console.log(event)
  //     ws.send(
  //       JSON.stringify({
  //         domain: 'lobby',
  //         type: '@players>add',
  //         payload: {
  //           id: 1,
  //           name: 'Sutat',
  //         },
  //       }),
  //     )
  //   }
  //   ws.onmessage = function (event) {
  //     console.log('new message:')
  //     console.log(event)
  //     console.log(JSON.parse(event.data))
  //   }
  // }, [token])

  return (
    <>
      <h2>SPA Authentication Sample</h2>
      <p>Welcome to our page!</p>
      <pre>{user.token}</pre>
      {user.logged || (
        <button id="btn-login" onClick={user.login}>
          Log in
        </button>
      )}
      {user.logged && (
        <button id="btn-logout" onClick={user.logout}>
          Log out
        </button>
      )}
    </>
  )
}

export default Login
