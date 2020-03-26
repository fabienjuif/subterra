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
  const { type: cardType } = nextState.activeCard
  if (['shake', 'water', 'gaz', 'enemy'].includes(cardType)) {
    store.dispatch(`@cards>${cardType}`)
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

export const processMarkerCard = (store, action) => {
  const { card } = action.payload

  // find all tiles that have water type and put a status on it
  // if it do not already exists
  // if a player is in this tile then it take damage
  store.mutate((state) => {
    state.grid.forEach((tile) => {
      const { type, status } = tile

      if (type !== card.type) return
      if (status.includes(card.type)) return

      tile.status.push(card.type)

      state.players.forEach((player) => {
        if (!isCellEqual(player)(tile)) return

        store.dispatch(
          players.damage(player, card.damage, {
            card,
          }),
        )
      })
    })
  })
}
