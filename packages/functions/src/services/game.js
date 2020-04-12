import { nanoid } from 'nanoid'
import { createEngine } from '@subterra/engine'

export const create = (firestore) => async (playerDoc) => {
  // create a new game
  const gameId = nanoid()
  await firestore
    .collection('games')
    .doc(gameId)
    .set({
      id: gameId,
      createdAt: new Date(Date.now()),
      state: JSON.parse(JSON.stringify(createEngine().getState())),
    })

  await playerDoc.ref.set(
    {
      gameId,
    },
    { merge: true },
  )

  // TODO: for all players unset lobby

  return gameId
}

// TODO: should be exceptions
export const dispatch = (firestore) => async (playerDoc, action) => {
  const player = playerDoc.data()
  if (!player.gameId) {
    console.warn('Game does not exist on player', player.uid)
    return
  }

  const gameDoc = await firestore.collection('games').doc(player.gameId).get()
  if (!gameDoc.exists) {
    console.warn('Game does not exist on id', player.gameId)
    console.warn('\tremoving its reference on player', player.uid)
    await playerDoc.ref.update({
      gameId: firestore.FieldValue.delete(),
    })

    return
  }

  const { state } = gameDoc.data()
  const engine = createEngine(state)
  engine.dispatch(action)
  await gameDoc.ref.update({
    state: JSON.parse(JSON.stringify(engine.getState())),
  })
}
