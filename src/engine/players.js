import { isCellEqual } from '../utils/tiles'

export const damage = (store, action) => {
  store.mutate((state) => {
    const player = state.players.find(
      ({ name }) => name === action.payload.name,
    )
    player.health -= action.payload.damage
  })
}

export const checkDamageFromCard = (store, _) => {
  const state = store.getState()
  const card = state.board.card

  state.players.forEach((player) => {
    if (state.board.tiles.find(isCellEqual(player)).type === card.type) {
      store.dispatch({
        type: '@player>damage',
        payload: { player: player, damageType: card.type, damage: card.damage },
      })
    }
  })
}
