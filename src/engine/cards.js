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
