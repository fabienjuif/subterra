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
    nextState.players.forEach((player) => {
      // FIXME: how to make this action replayable?
      //    maybe by rolling something very high in advance ?
      //    like ((players * cards + players * tiles) * 10) dices? ((6 * 20) + (6 * 64)) * 10 === 5040 dices!!!)
      const roll = roll6()

      // only for tracing purpose
      store.dispatch({
        type: '@players>roll',
        payload: {
          roll,
          player: player.name,
        },
      })

      if (roll > 3) return

      store.dispatch({
        type: '@players>damage',
        payload: {
          damage: 1,
          damageFrom: {
            card: nextState.activeCard,
          },
          player, // TODO: only send player name
        },
      })
    })
  }
}
