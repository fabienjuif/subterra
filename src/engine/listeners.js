import * as cards from './cards'
import * as dices from './dices'
import * as players from './players'

export default [
  // initializations
  ['@players>init', players.init],
  ['@cards>init', cards.init],
  // game going on
  ['@players>pass', players.pass],
  ['@players>damage', players.damage],
  ['@cards>pick', cards.pick],
  ['@cards>shake', cards.shake],
  ['@cards>water', cards.processMarkerCard],
  ['@cards>gaz', cards.processMarkerCard],
  [
    ({ type, payload = {} }) =>
      type === '@dices>rolled' && payload.what === '@cards>landslide',
    cards.landslide,
  ],
  // "random"
  ['@dices>init', dices.init],
  ['@dices>roll', dices.roll],
  [
    ({ type, payload = {} }) =>
      type === '@dices>rolled' && payload.min !== undefined,
    dices.checkAndDispatch,
  ],
]
