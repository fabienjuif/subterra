import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { Prepare, Game, Lobby, Welcome } from './screens'
import UserProvider from './userContext'
import './variables.css'
import { nanoid } from 'nanoid'
import firebase from 'firebase/app'
import * as firebaseui from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'
import 'firebase/analytics'
import 'firebase/firebase'
import 'firebase/database'

// Initialize Firebase
firebase.initializeApp({
  apiKey: 'AIzaSyCu39RbUJs5u5ppJ6uOuw87tAT_LyhpSH8',
  authDomain: 'crawlandsurvive.firebaseapp.com',
  databaseURL: 'https://crawlandsurvive.firebaseio.com',
  projectId: 'crawlandsurvive',
  storageBucket: 'crawlandsurvive.appspot.com',
  messagingSenderId: '469041482667',
  appId: '1:469041482667:web:a6707600bf3612611420ee',
  measurementId: 'G-3G1JSEHW40',
})
firebase.analytics()

var uiConfig = {
  signInSuccessUrl: '<url-to-redirect-to-on-success>',
  signInOptions: [
    // Leave the lines as is for the providers you want to offer your users.
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
  ],
  // tosUrl and privacyPolicyUrl accept either url string or a callback
  // function.
  // Terms of service url/callback.
  // tosUrl: '<your-tos-url>',
  // Privacy policy url/callback.
  // privacyPolicyUrl: function() {
  //   window.location.assign('<your-privacy-policy-url>');
  // }
}

firebase.auth().onAuthStateChanged(function (user) {
  if (!user) {
    // Initialize the FirebaseUI Widget using Firebase.
    var ui = new firebaseui.auth.AuthUI(firebase.auth())
    // The start method will wait until the DOM is loaded.
    ui.start('#firebaseui-auth-container', uiConfig)
  }
  console.log(user)
})

const App = () => {
  return (
    <UserProvider>
      <BrowserRouter>
        <Switch>
          {/* <div id="firebaseui-auth-container"></div> */}

          <div
            onClick={async () => {
              const idToken = await firebase.auth().currentUser.getIdToken(true)

              const raw = await fetch('/api/lobby', {
                method: 'POST',
                headers: {
                  authorization: `Bearer ${idToken}`,
                },
              })
              const { id } = await raw.json()

              console.log('trying to listen to', id)
              firebase
                .database()
                .ref(`lobby/${id}`)
                .on('value', (snapshot) => {
                  console.log('new value?')
                  console.log(snapshot.val())
                })
            }}
          >
            Click me
          </div>
          <Route exact path="/" component={Welcome} />
          <Route exact path={['/lobby', '/lobby/:lobbyId']} component={Lobby} />
          <Route exact path={['/game', '/game/:gameId']} component={Game} />
          <Route exact path="/local" component={Prepare} />
        </Switch>
      </BrowserRouter>
    </UserProvider>
  )
}

export default App
