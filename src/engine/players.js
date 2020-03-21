export const damage = (store, action) => {
  store.mutate((state) => {
    const player = state.players.find(
      ({ name }) => name === action.payload.name,
    )
    player.health -= action.payload.damage
  })
}
