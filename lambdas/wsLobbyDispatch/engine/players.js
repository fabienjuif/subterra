const { archetypes } = require('@subterra/data')

exports.addPlayer = (store, action) => {
  const prevState = store.getState()
  if (prevState.players.some(({ id }) => id === action.payload.id)) return

  store.mutate((state) => {
    state.players.push(action.payload)
  })
}

exports.removePlayer = (store, action) => {
  const prevState = store.getState()
  const playerIndex = prevState.players.findIndex(
    ({ id }) => id === action.payload.id,
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

exports.setArchetype = (store, action) => {
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
