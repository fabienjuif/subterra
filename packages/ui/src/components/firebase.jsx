import React, { createContext, useEffect, useState } from 'react'
import firebase from 'firebase/app'
import 'firebase/analytics'
import 'firebase/firestore'
import 'firebase/auth'

export const FirebaseContext = createContext()

const Firebase = ({ children }) => {
  const [value, setValue] = useState({
    isConnected: false,
    isInitialized: false,
    fetch: () => {
      console.error('not initialized yet')
    },
  })

  useEffect(() => {
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

    firebase.auth().onAuthStateChanged((user) => {
      setValue((old) => ({
        ...old,
        user,
        isConnected: !!user,
        isInitialized: true,
      }))
    })

    setValue((old) => ({
      ...old,
      firebase,
      fetch: (url, options) =>
        firebase
          .auth()
          .currentUser.getIdToken(true)
          .then((idToken) =>
            fetch(url, {
              ...options,
              headers: {
                Authorization: `Bearer ${idToken}`,
                'Content-Type': 'application/json',
                ...options.headers,
              },
            }),
          ),
    }))
  }, [])

  return (
    <FirebaseContext.Provider value={value}>
      {value.firebase && children}
    </FirebaseContext.Provider>
  )
}

export default Firebase
