export const addMessage = (store, action) => {
  store.mutate((state) => {
    state.messages.push(action.payload)
  })
}
