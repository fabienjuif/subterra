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
      state: createEngine().getState(),
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
