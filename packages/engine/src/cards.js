import { EndCard } from '@subterra/data'
import { players, roll } from './actions'
import { tiles, random } from './utils'

export const init = (store, action) => {
  store.mutate((state) => {
    state.cards = action.payload
  })
}

export const pick = (store, action) => {
  store.mutate((state) => {
    // draw a new card
    // - if there is 1 remaining card we draw a "end" card
    // - in other case take a card from remaining one
    //    and remove cards from deck when there is no more remaining
    let nextCard
    state.cards.remaining = Math.max(0, state.cards.remaining - 1)
    if (state.cards.remaining <= 0) {
      nextCard = { ...EndCard }
    } else {
      const { value, nextSeed } = random.roll(
        state.cards.deck.length,
        state.seeds.cardsNext,
      )
      state.seeds.cardsNext = nextSeed

      const cardInDeck = state.cards.deck[value - 1]
      cardInDeck.remaining -= 1
      if (cardInDeck.remaining <= 0) {
        state.cards.deck.splice(value - 1, 1)
      }

      nextCard = { ...cardInDeck.card }
    }
    state.cards.active = nextCard
  })

  const nextState = store.getState()
  const { type: cardType } = nextState.cards.active
  if (['shake', 'water', 'gaz', 'enemy', 'end'].includes(cardType)) {
    store.dispatch({
      type: `@cards>${cardType}`,
      payload: { card: nextState.cards.active },
    })
  } else if (cardType === 'landslide') {
    store.dispatch(roll.then({ type: '@cards>landslide' }))
  }
}

export const end = (store, action) => {
  store.getState().players.forEach((player) => {
    if (player.health <= 0) return

    store.dispatch(
      roll.failThen(
        3,
        player,
        players.damage(player, 1000, {
          from: { card: action.payload.card },
        }),
      ),
    )
  })
}

export const shake = (store, action) => {
  const previousState = store.getState()

  previousState.players.forEach((player) => {
    store.dispatch(
      roll.failThen(
        4,
        player,
        players.damage(player, previousState.cards.active.damage, {
          card: previousState.cards.active,
        }),
      ),
    )
  })
}

export const landslide = (store, action) => {
  const {
    cards: { active },
  } = store.getState()

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
        if (!tiles.isCellEqual(player)(tile)) return

        store.dispatch(
          players.damage(player, active.damage, {
            card: active,
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
        if (!tiles.isCellEqual(player)(tile)) return

        store.dispatch(
          players.damage(player, card.damage, {
            card,
          }),
        )
      })
    })
  })
}
