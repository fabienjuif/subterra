import { isCellEqual } from '../utils/tiles'

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
