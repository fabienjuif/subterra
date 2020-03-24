export const init = (store, action) => {
  store.mutate((state) => {
    state.deckCards = action.payload
  })
}

export const pick = (store, action) => {
  store.mutate((state) => {
    if (state.deckCards.length > 0) {
      state.activeCard = state.deckCards.shift()
    }
  })
}
