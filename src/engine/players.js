import { isCellEqual } from '../utils/tiles'

export const damage = (store, action) => {
  store.mutate((state) => {
    const player = state.players.find(
      ({ name }) => name === action.payload.player.name,
    )
    player.health -= action.payload.damage
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
