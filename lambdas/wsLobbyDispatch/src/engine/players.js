import { pick } from 'lodash'
import { archetypes } from '@subterra/data'

export const addPlayer = (store, action) => {
  const prevState = store.getState()
  if (prevState.players.some(({ id }) => id === action.userId)) return

  store.mutate((state) => {
    state.players.push({
      ...pick(action.payload, ['name']),
      id: action.userId,
    })
  })
}

export const removePlayer = (store, action) => {
  const prevState = store.getState()
  const playerIndex = prevState.players.findIndex(
    ({ id }) => id === action.userId,
  )

  if (playerIndex < 0) return

  store.mutate((state) => {
    const player = state.players[playerIndex]
    if (player.type) {
      state.archetypes.push(archetypes.find(({ type }) => type === player.type))
    }
    state.players.splice(playerIndex, 1)
  })
}

export const setArchetype = (store, action) => {
  const prevState = store.getState()

  const archetypeIndex = prevState.archetypes.findIndex(
    ({ type }) => type === action.payload.archetypeType,
  )
  if (archetypeIndex < 0) return
  const archetype = prevState.archetypes[archetypeIndex]

  store.mutate((state) => {
    const player = state.players.find(({ id }) => id === action.userId)
    if (!player) return

    // free up the older archetype
    if (player.type) {
      state.archetypes.push(archetypes.find(({ type }) => type === player.type))
    }

    Object.assign(player, archetype, { archetype })

    state.archetypes.splice(archetypeIndex, 1)
  })
}
