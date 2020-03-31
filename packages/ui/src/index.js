import React from 'react'
import ReactDOM from 'react-dom'
import SockJS from 'sockjs-client'
import './index.css'
import App from './app'
import * as serviceWorker from './serviceWorker'

const sock = new SockJS('/game')
sock.onopen = function () {
  console.log('open')
  sock.send('test')
}

sock.onmessage = function (e) {
  console.log('message', e.data)
  sock.close()
}

sock.onclose = function () {
  console.log('close')
}

ReactDOM.render(<App />, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
