import createStore from '@myrtille/mutate'
import listeners from './listeners'
import tilesData from '../utils/tiles'

export const initState = () => ({
  gameOver: undefined, // 'loose' | 'win'
  players: [],
  enemies: [],
  deckTiles: { length: 10 }, // should be an array in a futur iteration
  deckCards: [],
  dices: [],
  activeCard: {}, // should be an array in a futur iteration
  grid: [
    {
      ...tilesData[0],
      x: 0,
      y: 0,
      status: [
        /* gaz, water, landslide, etc */
      ],
    },
  ],
  playerActions: {
    tile: undefined,
    possibilities: [], // known possible actions for the current player
  },
  technical: {
    actions: [],
  },
})

const saveAction = (store, action) => {
  const { actions } = store.getState().technical || {}

  if (!actions) return

  store.mutate((state) => {
    state.technical.actions.push(action)
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
