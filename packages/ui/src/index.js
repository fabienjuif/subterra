import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './app'
import * as serviceWorker from './serviceWorker'

const ws = new WebSocket(
  'wss://iv082u46jh.execute-api.eu-west-3.amazonaws.com/beta/',
  // 'wss://iv082u46jh.execute-api.eu-west-3.amazonaws.com/beta/',
)

ws.onopen = function (event) {
  console.log('open!')
  console.log(event)
  ws.send(
    JSON.stringify({
      type: '@client>getState',
    }),
  )

  // setTimeout(() => {
  //   ws.close()
  // }, 2000)
}

ws.onmessage = function (event) {
  console.log('new message:')
  console.log(event)
  console.log(JSON.parse(event.data))
}

// setTimeout(() => {
//   ws.send(JSON.stringify({ type: '@players>pass', payload: { name: 'Sutat' } }))
//   setTimeout(() => {
//     ws.close()
//     console.log('ws closed')
//   }, 1000)
// }, 2000)

// ReactDOM.render(<App />, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
