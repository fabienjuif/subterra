import functions from 'firebase-functions'
import firebase from 'firebase-admin'
import express from 'express'
import bodyParser from 'body-parser'
import { lobby, game } from './services'

firebase.initializeApp()
const firestore = firebase.firestore()
const app = express()

app.use(bodyParser.json())
app.use(async (req, res, next) => {
  const idToken = (req.headers.authorization || '').replace('Bearer ', '')
  const { uid } = await firebase.auth().verifyIdToken(idToken, true)
  let playerRef = firestore.collection('players').doc(uid)
  const playerDoc = await playerRef.get()
  if (!playerDoc.exists) {
    next(new Error('User is not known'))
    return
  }

  req.playerDoc = playerDoc

  next()
})

app.post('/lobby', async (req, res) => {
  const player = req.playerDoc.data()
  if (player.gameId) {
    res.send({
      id: player.gameId,
      type: 'game',
    })

    return
  }

  const lobbyId =
    player.lobbyId || (await lobby.create(firestore)(req.playerDoc))

  res.send({
    id: lobbyId,
    type: 'lobby',
  })
})

app.post('/lobby/start', async (req, res) => {
  const player = req.playerDoc.data()
  const gameId = player.gameId || (await game.create(firestore)(req.playerDoc))

  res.send({
    id: gameId,
    type: 'game',
  })
})

app.post('/lobby/dispatch', async (req, res) => {
  await lobby.dispatch(firestore)(req.playerDoc, req.body)

  res.sendStatus(200)
})

app.post('/game/dispatch', async (req, res) => {
  await game.dispatch(firestore)(req.playerDoc, req.body)

  res.sendStatus(200)
})

export const api = functions.region('europe-west1').https.onRequest(app)
