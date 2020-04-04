import { archetypes } from '@subterra/data'

export const addPlayer = (store, action) => {
  store.mutate((state) => {
    state.players.push(action.payload)
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
