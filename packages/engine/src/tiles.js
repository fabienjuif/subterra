export const init = (store, action) => {
  store.mutate((state) => {
    state.deckTiles = action.payload
  })
}
