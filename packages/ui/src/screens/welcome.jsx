import React from 'react'
import { useHistory } from 'react-router-dom'

const Welcome = () => {
  const history = useHistory()

  return (
    <div>
      <button onClick={() => history.push('/lobby')}>online</button>
      <button onClick={() => history.push('/local')}>local</button>
    </div>
  )
}

export default Welcome
