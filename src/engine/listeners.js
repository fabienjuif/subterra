import * as players from './players'
import * as logs from './logs'
import * as core from './core'
import * as cards from './cards'

export default [
  ['@players>damage', players.damage],
  [
    '@players>damage',
    (store, action) =>
      logs.push(store, {
        payload: {
          code: 'hit_' + action.payload.damageType,
          player: action.payload.player,
        },
      }),
  ],
  ['@core>reset', core.reset],
  ['@cards>pick', cards.pick],
  ['@cards>pick', players.checkDamageFromCard],
]
