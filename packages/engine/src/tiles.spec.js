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
          deck: [
            {
              tile: { ...data[0] },
              remaining: 2,
            },
            {
              tile: { ...data[2] },
              remaining: 3,
            },
            {
              tile: { ...data[1] },
              remaining: 1,
            },
          ],
        },
      })

      expect(store.getState()).toEqual({
        tiles: {
          remaining: 3,
          deck: [
            {
              tile: { ...data[0] },
              remaining: 2,
            },
            {
              tile: { ...data[2] },
              remaining: 3,
            },
            {
              tile: { ...data[1] },
              remaining: 1,
            },
          ],
        },
      })
    })
  })
})
