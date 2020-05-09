import createStore from '@myrtille/mutate'
import { tiles as data } from '@subterra/data'
import * as tiles from './tiles'

describe('tiles', () => {
  describe('init', () => {
    it('should set a new deck tiles', () => {
      const store = createStore({})

      tiles.init(store, {
        payload: {
          remaining: 3,
          deck: [data[0], data[2], data[1]],
        },
      })

      expect(store.getState()).toEqual({
        tiles: {
          remaining: 3,
          deck: [data[0], data[2], data[1]],
        },
      })
    })
  })
})
