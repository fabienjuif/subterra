import * as players from './players'
import * as cards from './cards'

export default [
  // initializations
  ['@players>init', players.init],
  ['@cards>init', cards.init],
  // game going on
  ['@players>damage', players.damage],
  ['@players>damage', players.checkDeathFromDamage],
  ['@cards>pick', cards.pick],
  ['@cards>pick', players.checkDamageFromCard],
]
