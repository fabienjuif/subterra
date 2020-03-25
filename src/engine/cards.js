import { roll6 } from '../utils/dices'

export const init = (store, action) => {
  store.mutate((state) => {
    state.deckCards = action.payload

    // FIXME: this is a tryout to run 5000 dices to see time it takes
    // console.time('roll!!!')
    // state.dices = Array.from({ length: 5000 }).map(roll6)
    // console.timeEnd('roll!!!')
    // it took 4ms on my computer :)
  })
}

export const pick = (store, action) => {
  store.mutate((state) => {
    if (state.deckCards.length > 0) {
      state.activeCard = state.deckCards.shift()
    }
  })

  const nextState = store.getState()
  if (nextState.activeCard.type === 'shake') {
    store.dispatch('@cards>shake')
  }
}

export const shake = (store, action) => {
  const previousState = store.getState()

  previousState.players.forEach((player) => {
    store.dispatch({
      type: '@dices>roll',
      payload: {
        min: 4,
        player: player.name,
        actionOnFail: {
          type: '@players>damage',
          payload: {
            damage: 1,
            damageFrom: {
              card: previousState.activeCard,
            },
            player, // TODO: only send player name
          },
        },
      },
    })
  })
}
