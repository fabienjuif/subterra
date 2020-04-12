import functions from 'firebase-functions'
import firebase from 'firebase-admin'
import express from 'express'
import bodyParser from 'body-parser'
import { createEngine } from '@subterra/engine'
import { lobby, game } from './services'

firebase.initializeApp()
const firestore = firebase.firestore()
const app = express()

app.use(bodyParser.json())

app.post('/lobby', async (req, res) => {
  // check that the UID is known
  // TODO: move this in a middleware?
  const idToken = (req.headers.authorization || '').replace('Bearer ', '')
  const { uid } = await firebase.auth().verifyIdToken(idToken, true)
  let playerRef = firestore.collection('players').doc(uid)
  const playerDoc = await playerRef.get()
  if (!playerDoc.exists) {
    throw new Error('User is not known')
  }

  const player = playerDoc.data()
  if (player.gameId) {
    res.send({
      id: player.gameId,
      type: 'game',
    })

    return
  }

  const lobbyId = player.lobbyId || (await lobby.create(firestore)(playerDoc))

  res.send({
    id: lobbyId,
    type: 'lobby',
  })
})

app.post('/lobby/start', async (req, res) => {
  // check that the UID is known
  // TODO: move this in a middleware?
  const idToken = (req.headers.authorization || '').replace('Bearer ', '')
  const { uid } = await firebase.auth().verifyIdToken(idToken, true)
  let playerRef = firestore.collection('players').doc(uid)
  const playerDoc = await playerRef.get()
  if (!playerDoc.exists) {
    throw new Error('User is not known')
  }

  const player = playerDoc.data()
  const gameId = player.gameId || (await game.create(firestore)(playerDoc))

  res.send({
    id: gameId,
    type: 'game',
  })
})

app.post('/game/dispatch', async (req, res) => {
  // check that the UID is known
  // TODO: move this in a middleware?
  const idToken = (req.headers.authorization || '').replace('Bearer ', '')
  const { uid } = await firebase.auth().verifyIdToken(idToken, true)
  let playerRef = firestore.collection('players').doc(uid)
  const playerDoc = await playerRef.get()
  if (!playerDoc.exists) {
    throw new Error('User is not known')
  }

  await game.dispatch(firestore)(playerDoc, req.body)

  res.sendStatus(200)
})

export const api = functions.region('europe-west1').https.onRequest(app)

// createEngine().dispatch('@players>pass')
