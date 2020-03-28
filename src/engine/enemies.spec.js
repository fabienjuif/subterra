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
          {
            type: 'water',
            x: 0,
            y: -1,
            status: ['enemy'],
          },
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
          {
            type: 'water',
            x: 0,
            y: -1,
            status: [],
          },
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
          {
            type: 'water',
            x: 0,
            y: -1,
            status: ['enemy', 'enemy'],
          },
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
          {
            type: 'water',
            x: 0,
            y: -1,
            status: ['enemy'],
          },
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

  describe('process', () => {
    it('should not move enemy if there are none', () => {
      const store = createStore({
        players: [
          {
            name: 'Tripa',
            x: 0,
            y: 0,
          },
        ],
        grid: [
          {
            type: 'start',
            x: 0,
            y: 0,
            status: [],
          },
          {
            type: 'water',
            x: 0,
            y: -1,
            status: [],
          },
          {
            type: 'gaz',
            x: 1,
            y: 0,
            status: [],
          },
        ],
      })
      store.dispatch = jest.fn()

      enemies.process(store, {})

      expect(store.dispatch).toHaveBeenCalledTimes(0)
    })

    it('should move the enemy towards the player', () => {
      const store = createStore({
        players: [
          {
            name: 'Tripa',
            x: 0,
            y: 0,
            strengh: 2,
          },
        ],
        grid: [
          {
            type: 'start',
            x: 0,
            y: 0,
            status: [],
          },
          {
            type: 'water',
            x: 1,
            y: 0,
            status: [],
          },
          {
            type: 'gaz',
            x: 2,
            y: 0,
            status: ['enemy'],
          },
        ],
      })
      store.dispatch = jest.fn()

      enemies.process(store, {})

      expect(store.dispatch).toHaveBeenCalledTimes(1)
      expect(store.dispatch).toHaveBeenCalledWith({
        type: '@enemies>move',
        payload: {
          enemy: {
            x: 2,
            y: 0,
          },
          path: [
            { x: 2, y: 0 },
            { x: 1, y: 0 },
            { x: 0, y: 0 },
          ],
          playerName: 'Tripa',
        },
      })
    })

    it.todo('should move the enemy towards the closest player')
    it.todo('should move the enemy towards the weakest player')
    it.todo('should move not move the enemy through a wall')
    it.todo('should kill an enemy if it is too far away (> 6 tiles)')
    it.todo('should move all enemies')
  })
})
