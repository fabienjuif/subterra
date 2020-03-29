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
  let { value } = action.payload
  if (action.payload.min === undefined) {
    store.dispatch({
      ...action.payload.nextAction,
      payload: {
        ...action.payload.nextAction.payload,
        rolled: value,
      },
    })
    return
  }

  const prevState = store.getState()
  const player = prevState.players.find(({ name }) => action.payload.playerName)
  if (player && player.skills.some(({ type }) => type === 'experienced')) {
    value += 1
  }

  if (value < action.payload.min) {
    if (action.payload.actionOnFail) {
      store.dispatch(action.payload.actionOnFail)
    }
  } else {
    if (action.payload.actionOnSuccess) {
      store.dispatch(action.payload.actionOnSuccess)
    }
  }
}
