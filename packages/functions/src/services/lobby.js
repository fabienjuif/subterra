import { nanoid } from 'nanoid'

export const create = (firestore) => async (playerDoc) => {
  // create a new lobby
  const lobbyId = nanoid()
  await firestore
    .collection('lobby')
    .doc(lobbyId)
    .set({
      lobbyId,
      createdAt: new Date(Date.now()),
    })

  await playerDoc.ref.set(
    {
      lobbyId,
    },
    { merge: true },
  )

  return lobbyId
}
