import { original } from 'immer'
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
  } else if (cardType === 'landslide') {
    // roll a dice then do the action
    store.dispatch({
      type: '@dices>roll',
      payload: {
        what: '@cards>landslide',
      },
    })
  }
}

export const shake = (store, action) => {
  const previousState = store.getState()

  previousState.players.forEach((player) => {
    store.dispatch({
      type: '@dices>roll',
      payload: {
        min: 4,
        playerName: player.name,
        actionOnFail: {
          type: '@players>damage',
          payload: {
            damage: previousState.activeCard.damage,
            from: {
              card: previousState.activeCard,
            },
            playerName: player.name,
          },
        },
      },
    })
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
      if (!dices.includes(action.payload.value)) return

      tile.status.push('landslide')

      state.players.forEach((player) => {
        if (!isCellEqual(player)(tile)) return

        store.dispatch({
          type: '@players>damage',
          payload: {
            damage: activeCard.damage,
            from: {
              card: activeCard,
            },
            playerName: player.name,
          },
        })
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

        store.dispatch({
          type: '@players>damage',
          payload: {
            damage: card.damage,
            from: {
              card,
            },
            playerName: player.name,
          },
        })
      })
    })
  })
}
