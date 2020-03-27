import * as cards from './cards'
import * as dices from './dices'
import * as players from './players'
import * as mock from './mock'

export default [
  // initializations
  ['@players>init', players.init],
  ['@mock>init', mock.init],
  ['@cards>init', cards.init],
  // game going on
  ['@players>pass', players.pass],
  ['@players>damage', players.damage],
  ['@players>move', players.move],
  ['@cards>pick', cards.pick],
  ['@cards>shake', cards.shake],
  ['@cards>landslide', cards.landslide],
  // "random"
  ['@dices>init', dices.init],
  ['@dices>roll', dices.roll],
  ['@dices>rolled', dices.checkAndDispatch],
]
