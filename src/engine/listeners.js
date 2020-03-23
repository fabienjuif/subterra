import * as players from './players'
import * as logs from './logs'
import * as cards from './cards'
import * as core from './core'

export default [
  ['@players>damage', players.damage],
  ['@players>damage', players.checkDeathFromDamage],
  ['@cards>pick', cards.pick],
  ['@cards>pick', players.checkDamageFromCard],
  //[core.saveAction]
]
