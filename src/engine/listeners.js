import * as cards from './cards'
import * as dices from './dices'
import * as players from './players'

export default [
  // initializations
  ['@players>init', players.init],
  ['@cards>init', cards.init],
  // game going on
  ['@players>damage', players.damage],
  ['@players>damage', players.checkDeathFromDamage],
  ['@cards>pick', cards.pick],
  ['@cards>shake', cards.shake],
  // "random"
  ['@dices>init', dices.init],
  ['@dices>roll', dices.roll],
  ['@dices>rolled', dices.checkAndDispatch],
]
