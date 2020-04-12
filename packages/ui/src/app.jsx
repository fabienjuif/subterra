import React from 'react'
import { Firebase } from './components'
import Router from './screens'
import './variables.css'

const App = () => {
  return (
    <Firebase>
      <Router />
    </Firebase>
  )
}

export default App
