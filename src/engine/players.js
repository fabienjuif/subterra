import { isCellEqual } from '../utils/tiles'

export const pass = (store, action) => {
  const previousState = store.getState()
  const firstPlayerIndex = previousState.players.findIndex(({ first }) => first)
  const currentPlayerIndex = previousState.players.findIndex(
    ({ current }) => current,
  )

  const getNextIndex = (current) => {
    const next = current + 1
    if (next >= previousState.players.length) {
      return 0
    }
    return next
  }

  const nextCurrentPlayerIndex = getNextIndex(currentPlayerIndex)

  const turnEnd = firstPlayerIndex === nextCurrentPlayerIndex

  store.mutate((state) => {
    state.players[currentPlayerIndex].current = false

    if (turnEnd) {
      state.players.forEach((player, index) => {
        player.actionPoints = 2
      })

      const nextFirstPlayerIndex = getNextIndex(firstPlayerIndex)
      state.players[nextFirstPlayerIndex].current = true
      state.players[nextFirstPlayerIndex].first = true
      state.players[firstPlayerIndex].first = false
    } else {
      state.players[nextCurrentPlayerIndex].current = true
    }
  })

  if (turnEnd) store.dispatch('@cards>pick')
}

export const damage = (store, action) => {
  store.mutate((state) => {
    const player = state.players.find(
      ({ name }) => name === action.payload.player.name,
    )
    player.health = Math.max(0, player.health - action.payload.damage)
  })
}

export const checkDamageFromCard = (store, _) => {
  const state = store.getState()
  const card = state.activeCard

  state.players.forEach((player) => {
    if (state.grid.find(isCellEqual(player)).type === card.type) {
      store.dispatch({
        type: '@player>damage',
        payload: { player: player, damageType: card.type, damage: card.damage },
      })
    }
  })
}

export const checkDeathFromDamage = (store, action) => {
  const player = store
    .getState()
    .players.find((p) => p.name === action.payload.player.name)

  if (player.health <= 0) {
    store.dispatch({ type: '@player>death', payload: { player: player } })
  }
}

export const init = (store, action) => {
  store.mutate((state) => {
    state.players = [
      {
        id: 0,
        x: 0,
        y: 0,
        health: 3,
        name: 'Sutat',
        archetype: 'explorer',
        actionPoints: 2,
        current: true,
        first: true,
      },
      {
        id: 1,
        x: 0,
        y: 0,
        health: 3,
        name: 'Tripa',
        archetype: 'chef',
        actionPoints: 2,
      },
      {
        id: 2,
        x: 0,
        y: 0,
        health: 5,
        name: 'SoE',
        archetype: 'miner',
        actionPoints: 2,
      },
    ]
  })
}
