import React, { useEffect, useState } from 'react'
import { useHistory, useLocation, Link } from 'react-router-dom'

const Over = () => {
  const location = useLocation()
  const history = useHistory()
  const [status, setStatus] = useState()

  useEffect(() => {
    const gameOver = location.search.split('gameOver=')[1]
    if (gameOver) {
      setStatus(gameOver)
      history.replace('/gameover')
    }
  }, [history, location.search])

  return (
    <>
      {status === 'win' && <div>Win</div>}
      {status === 'loose' && <div>Loose</div>}
      <Link to="/">Play again</Link>
    </>
  )
}

export default Over
