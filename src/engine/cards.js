import { players, roll } from './actions'
import { isCellEqual } from '../utils/tiles'

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
  } else if (nextState.activeCard.type === 'landslide') {
    store.dispatch(roll.then({ type: '@cards>landslide' }))
  }
}

export const shake = (store, action) => {
  const previousState = store.getState()

  previousState.players.forEach((player) => {
    store.dispatch(
      roll.failThen(
        4,
        player,
        players.damage(player, previousState.activeCard.damage, {
          card: previousState.activeCard,
        }),
      ),
    )
  })
}

export const landslide = (store, action) => {
  const { activeCard } = store.getState()

  // find all tiles that are landslide and match the dice result
  // tile should not be already in the landslide status
  // add the status 'landslide' to these tiles
  // and for each of these tiles, check a player is in it and damage it in this case
  store.mutate((state) => {
    state.grid.forEach((tile) => {
      const { type, status, dices } = tile

      if (type !== 'landslide') return
      if (status.includes('landslide')) return
      if (!dices.includes(action.payload.rolled)) return

      tile.status.push('landslide')

      state.players.forEach((player) => {
        if (!isCellEqual(player)(tile)) return

        store.dispatch(
          players.damage(player, activeCard.damage, {
            card: activeCard,
          }),
        )
      })
    })
  })
}
