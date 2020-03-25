export const init = (store, action) => {
  store.mutate((state) => {
    state.dices = action.payload
  })
}

export const roll = (store, action) => {
  let value
  store.mutate((state) => {
    value = state.dices.shift()
  })

  store.dispatch({
    type: '@dices>rolled',
    payload: {
      ...action.payload,
      value,
    },
  })
}

export const checkAndDispatch = (store, action) => {
  if (action.payload.value < action.payload.min) {
    if (action.payload.actionOnFail) {
      store.dispatch(action.payload.actionOnFail)
    }
  } else {
    if (action.payload.actionOnSuccess) {
      store.dispatch(action.payload.actionOnSuccess)
    }
  }
}
