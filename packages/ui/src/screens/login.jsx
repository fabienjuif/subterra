import React, { useEffect } from 'react'
import firebase from 'firebase/app'
import * as firebaseui from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'

const Login = () => {
  useEffect(() => {
    const uiConfig = {
      signInSuccessUrl: '/', // TODO: should take previous URL
      signInOptions: [
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

    const ui = new firebaseui.auth.AuthUI(firebase.auth())
    ui.start('#firebaseui-auth-container', uiConfig)
  }, [])

  return <div id="firebaseui-auth-container" />
}

export default Login
