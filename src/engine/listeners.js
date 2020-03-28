import * as cards from './cards'
import * as dices from './dices'
import * as enemies from './enemies'
import * as game from './game'
import * as players from './players'

export default [
  // initializations
  ['@players>init', players.init],
  ['@cards>init', cards.init],
  // game going on
  ['@players>pass', players.pass],
  ['@players>damage', players.damage],
  ['@turn>start', game.checkWin],
  ['@turn>start', (store) => store.dispatch('@cards>pick')],
  ['@turn>start', (store) => store.dispatch('@enemies>process')],
  ['@players>move', players.move],
  ['@cards>pick', cards.pick],
  ['@cards>shake', cards.shake],
  ['@cards>landslide', cards.landslide],
  ['@cards>water', cards.processMarkerCard],
  ['@cards>gaz', cards.processMarkerCard],
  ['@cards>enemy', cards.processMarkerCard],
  ['@cards>end', cards.end],
  ['@players>death', game.checkLoose],
  ['@enemies>kill', enemies.kill],
  ['@enemies>process', enemies.process],
  ['@enemies>move', enemies.move],
  // "random"
  ['@dices>init', dices.init],
  ['@dices>roll', dices.roll],
  ['@dices>rolled', dices.checkAndDispatch],
]
