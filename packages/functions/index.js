const functions = require('firebase-functions')
const firebase = require('firebase-admin')
const { nanoid } = require('nanoid')

firebase.initializeApp()

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions
  .region('europe-west1')
  .https.onRequest((request, response) => {
    response.send('Hello from Firebase!')
  })

const express = require('express')
const app = express()
app.post('/lobby', (req, res) => {
  const idToken = (req.headers.authorization || '').replace('Bearer ', '')

  firebase
    .auth()
    .verifyIdToken(idToken, true)
    .then((decodedToken) => {
      const { uid } = decodedToken

      // check that the UID is known
      let playerRef = firebase.firestore().collection('players').doc(uid)
      playerRef.get().then((doc) => {
        if (!doc.exists) {
          throw new Error('User is not known')
        }

        // find a lobby with this player
        let { lobbyId } = doc.data()
        const sendResponse = () => {
          res.send({ id: lobbyId })
        }

        if (lobbyId) return sendResponse()

        // create a new lobby
        lobbyId = nanoid()
        firebase
          .database()
          .ref('lobby/' + lobbyId)
          .set({
            lobbyId,
            users: { [uid]: true },
            createdAt: new Date(Date.now()),
          })
          .then(() =>
            playerRef.set(
              {
                lobbyId,
              },
              { merge: true },
            ),
          )
          .then(sendResponse)
      })
    })
})

exports.api = functions.region('europe-west1').https.onRequest(app)
