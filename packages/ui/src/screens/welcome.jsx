import React from 'react'
import { useUser } from '../components'
import { useHistory } from 'react-router-dom'
import { useEffect } from 'react'

const Welcome = () => {
  const history = useHistory()
  const user = useUser()

  useEffect(() => {
    if (!user.logged) return
    history.push('/lobby')
  }, [history, user.logged])

  return (
    <div>
      <button onClick={user.login}>online</button>
      <button onClick={() => history.push('/local')}>local</button>
    </div>
  )
}

export default Welcome
