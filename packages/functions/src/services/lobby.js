import { nanoid } from 'nanoid'
import createLobbyEngine from './lobbyEngine'

export const create = (firestore) => async (playerDoc) => {
  // create a new lobby
  const player = playerDoc.data()
  const lobbyId = nanoid()
  const engine = createLobbyEngine()
  engine.dispatch({
    type: '@players>add',
    payload: {
      id: player.userId,
      name: player.pseudo || player.name,
    },
  })

  await firestore
    .collection('lobby')
    .doc(lobbyId)
    .set({
      lobbyId,
      createdAt: new Date(Date.now()),
      state: JSON.parse(JSON.stringify(engine.getState())),
    })

  await playerDoc.ref.update({
    lobbyId,
  })

  return lobbyId
}

export const join = (firestore) => async (playerDoc, lobbyId) => {
  const lobbyDoc = await firestore.collection('lobby').doc(lobbyId).get()

  if (!lobbyDoc.exists) {
    const error = new Error('Lobby does not exist')
    error.code = 'LOBBY_NOT_FOUND'
    error.lobbyId = lobbyId
    throw error
  }

  const { state } = lobbyDoc.data()
  if (!state || state.players.length > 6) {
    const error = new Error('Lobby is full')
    error.code = 'LOBBY_FULL'
    error.lobbyId = lobbyId
    throw error
  }

  const player = playerDoc.data()
  const engine = createLobbyEngine(state)
  engine.dispatch({
    type: '@players>add',
    payload: {
      id: player.userId,
      name: player.pseudo || player.name,
    },
  })

  await lobbyDoc.ref.update({
    state: JSON.parse(JSON.stringify(engine.getState())),
  })

  await playerDoc.ref.update({
    lobbyId,
  })

  return lobbyId
}

export const dispatch = (firestore) => async (playerDoc, action) => {
  const player = playerDoc.data()
  if (!player.lobbyId) {
    console.warn('Lobby does not exist on player', player.uid)
    return
  }

  const lobbyDoc = await firestore.collection('lobby').doc(player.lobbyId).get()
  if (!lobbyDoc.exists) {
    console.warn('Lobby does not exist on id', player.lobbyId)
    console.warn('\tremoving its reference on player', player.userId)
    await playerDoc.ref.update({
      lobbyId: firestore.FieldValue.delete(),
    })

    return
  }

  const { state } = lobbyDoc.data()
  const engine = createLobbyEngine(state)
  engine.dispatch({ ...action, userId: player.userId })
  await lobbyDoc.ref.update({
    state: JSON.parse(JSON.stringify(engine.getState())),
  })
}
