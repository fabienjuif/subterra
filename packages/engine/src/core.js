import createStore from '@myrtille/mutate'
import { StartTile } from '@subterra/data'
import listeners from './listeners'

export const initState = () => ({
  gameOver: undefined, // 'loose' | 'win'
  seeds: {
    public: false,
    master: undefined,
    dices: undefined,
    nextDicesSeed: undefined,
  },
  tiles: {
    remaining: 0,
    deck: [],
  },
  cards: {
    remaining: 0,
    deck: [],
    active: undefined, // should be an array in a futur iteration
  },
  players: [],
  enemies: [],
  grid: [
    {
      ...StartTile,
      x: 0,
      y: 0,
      status: [
        /* gaz, water, landslide, etc */
      ],
    },
  ],
  playerActions: {
    tile: undefined,
    excess: false, // true if we currently excessing
    exploring: false, // true if we are exploring (we have to "LOOK", then to "MOVE")
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
