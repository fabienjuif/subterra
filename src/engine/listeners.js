import * as players from './players'
import * as logs from './logs'
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
  ['@players>damage', players.checkDeathFromDamage],
  ['@cards>pick', cards.pick],
  ['@cards>pick', players.checkDamageFromCard],
]
