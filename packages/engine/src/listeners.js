import * as cards from './cards'
import * as tiles from './tiles'
import * as dices from './dices'
import * as enemies from './enemies'
import * as game from './game'
import * as players from './players'
import * as seeds from './seeds'

const checkAndForcePass = (store) => {
  if (!store.getState().playerActions.excess) return

  store.dispatch('@players>pass')
}

export default [
  // initializations
  ['@players>init', players.init],
  ['@players>init', players.findPossibilities],
  ['@cards>init', cards.init],
  ['@tiles>init', tiles.init],
  // game going on
  ['@players>pass', players.pass],
  ['@players>pass', players.findPossibilities],
  ['@players>look', players.look],
  ['@players>rotate', players.rotate],
  ['@players>drop', players.drop],
  ['@players>drop', players.findPossibilities],
  ['@players>damage', players.damage],
  ['@turn>start', game.checkWin],
  ['@turn>start', (store) => store.dispatch('@cards>pick')],
  ['@turn>start', (store) => store.dispatch('@enemies>process')],
  ['@players>move', players.move],
  ['@players>move', players.findPossibilities],
  ['@players>heal', players.heal],
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
  ['@players>excess', players.excess],
  ['@players>run', players.move],
  ['@players>run', players.findPossibilities],
  // "random"
  ['@seeds>init', seeds.init],
  ['@dices>roll', dices.roll],
  ['@dices>rolled', dices.checkAndDispatch],
  // actions that can trigger a pass
  // these actions are last in this list so we make sure we letting them finish first
  ['@players>damage', checkAndForcePass],
  ['@players>move', checkAndForcePass],
  ['@players>drop', checkAndForcePass],
  ['@players>heal', checkAndForcePass],
  ['@players>run', checkAndForcePass],
]
