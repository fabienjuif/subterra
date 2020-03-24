import * as players from './players'
import * as cards from './cards'

export default [
  ['@players>init', players.init],
  ['@players>damage', players.damage],
  ['@players>damage', players.checkDeathFromDamage],
  ['@cards>pick', cards.pick],
  ['@cards>pick', players.checkDamageFromCard],
]
