export const init = (store, action) => {
  store.mutate((state) => {
    state.tiles = action.payload
  })
}
