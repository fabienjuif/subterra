import createStore from '@myrtille/mutate'
import * as enemies from './enemies'

describe('enemies', () => {
  describe('move', () => {
    it('should move enemy from a cell to an other', () => {
      const store = createStore({
        grid: [
          {
            type: 'start',
            x: 0,
            y: 0,
            status: [],
          },
          { type: 'water', x: 0, y: -1, status: ['enemy'] },
          {
            type: 'gaz',
            x: 1,
            y: 0,
            status: [],
          },
        ],
      })

      enemies.move(store, {
        payload: {
          enemy: { x: 0, y: -1 },
          path: [
            { x: 0, y: -1 },
            { x: 1, y: 0 },
          ],
        },
      })

      expect(store.getState()).toEqual({
        grid: [
          {
            type: 'start',
            x: 0,
            y: 0,
            status: [],
          },
          { type: 'water', x: 0, y: -1, status: [] },
          {
            type: 'gaz',
            x: 1,
            y: 0,
            status: ['enemy'],
          },
        ],
      })
    })

    it('should move enemy without moving an other', () => {
      const store = createStore({
        grid: [
          {
            type: 'start',
            x: 0,
            y: 0,
            status: [],
          },
          { type: 'water', x: 0, y: -1, status: ['enemy', 'enemy'] },
          {
            type: 'gaz',
            x: 1,
            y: 0,
            status: ['landslide'],
          },
        ],
      })

      enemies.move(store, {
        payload: {
          enemy: { x: 0, y: -1 },
          path: [
            { x: 0, y: -1 },
            { x: 1, y: 0 },
          ],
        },
      })

      expect(store.getState()).toEqual({
        grid: [
          {
            type: 'start',
            x: 0,
            y: 0,
            status: [],
          },
          { type: 'water', x: 0, y: -1, status: ['enemy'] },
          {
            type: 'gaz',
            x: 1,
            y: 0,
            status: ['landslide', 'enemy'],
          },
        ],
      })
    })
  })
})
