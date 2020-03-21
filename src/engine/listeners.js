import * as players from './players'
import * as logs from './logs'

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
]
