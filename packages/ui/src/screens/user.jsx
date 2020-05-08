import React from 'react'
import { useUser } from '../components'

const User = () => {
  const { user } = useUser()

  return <pre>{JSON.stringify(user, null, 2)}</pre>
}

export default User
