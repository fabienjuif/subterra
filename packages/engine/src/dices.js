import { players as playerSelectors } from './selectors'
import { roll6 } from './utils/dices'

export const roll = (store, action) => {
  let value
  store.mutate((state) => {
    const roll = roll6(state.seeds.dicesNext)
    state.seeds.dicesNext = roll.nextSeed
    value = roll.value
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
  const player = playerSelectors.findById(prevState, action)
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
