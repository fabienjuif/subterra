import createStore from '@myrtille/mutate'
import listeners from './listeners'
import tilesData from '../utils/tiles'

const initState = () => ({
  gameOver: false,
  logs: [],
  decks: {
    tiles: { length: 10 },
    cards: { length: 10 },
  },
  turn: 0,
  players: [],
  action: {}, // action the player is currently doing
  actions: [], // known possible actions for the current player
  board: {
    card: undefined, // current active card
    tile: undefined,
    tiles: [{ ...tilesData[0], x: 0, y: 0 }],
  },
})

export default (state = initState()) => {
  const store = createStore(state)
  listeners.forEach((args) => store.addListener(...args))
  return store
}

export const reset = (store, action) => {
  store.setState(initState())
}
