import createStore from '@myrtille/mutate'
import listeners from './listeners'
import tilesData from '../utils/tiles'

export const initState = () => ({
  gameOver: false,
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
  data: {
    actions: [],
  },
})

const saveAction = (store, action) => {
  const { actions } = store.getState().data || {}
  if (actions === null || actions === undefined) return

  store.mutate((state) => {
    state.data.actions.push(action)
  })
}

export default (state = initState()) => {
  // creating store
  let store = createStore(state)

  // adding all game listeners
  listeners.forEach((args) => store.addListener(...args))

  // adding an action listener to save them all
  store.addListener(saveAction)

  // adding utility
  store.reset = () => store.setState(state)

  return store
}
