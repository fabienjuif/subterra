import * as core from './core'
import createStore from '@myrtille/mutate'
import tilesData from '../utils/tiles'

describe('core', () => {
  describe('reset', () => {
    it('should initialise the state', () => {
      const store = createStore({})

      core.reset(store, {})
      expect(store.getState()).toEqual({
        gameOver: false,
        logs: [],
        decks: {
          tiles: { length: 10 },
          cards: { length: 10 },
        },
        turn: 0,
        players: [],
        action: {},
        actions: [],
        board: {
          card: undefined,
          tile: undefined,
          tiles: [{ ...tilesData[0], x: 0, y: 0 }],
        },
      })
    })
  })
})
