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

    it('should move the enemy towards the closest player', () => {
      const store = createStore({
        players: [
          {
            name: 'Tripa',
            x: 0,
            y: 0,
            strength: 2,
          },
          {
            name: 'SoE',
            x: 2,
            y: 1,
            strength: 2,
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
          {
            x: 2,
            y: 1,
            status: [],
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
            { x: 2, y: 1 },
          ],
          playerName: 'SoE',
        },
      })
    })

    it('should move the enemy towards the weakest player', () => {
      const getDispatchWithTripaStrength = (strength) => {
        const store = createStore({
          players: [
            {
              name: 'Tripa',
              x: 1,
              y: 0,
              strength,
            },
            {
              name: 'SoE',
              x: 2,
              y: 1,
              strength: 2,
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
            {
              x: 2,
              y: 1,
              status: [],
            },
          ],
        })
        store.dispatch = jest.fn()

        enemies.process(store, {})

        return store.dispatch
      }

      let dispatch = getDispatchWithTripaStrength(1)
      expect(dispatch).toHaveBeenCalledTimes(1)
      expect(dispatch).toHaveBeenCalledWith({
        type: '@enemies>move',
        payload: {
          enemy: {
            x: 2,
            y: 0,
          },
          path: [
            { x: 2, y: 0 },
            { x: 1, y: 0 },
          ],
          playerName: 'Tripa',
        },
      })

      dispatch = getDispatchWithTripaStrength(3)
      expect(dispatch).toHaveBeenCalledTimes(1)
      expect(dispatch).toHaveBeenCalledWith({
        type: '@enemies>move',
        payload: {
          enemy: {
            x: 2,
            y: 0,
          },
          path: [
            { x: 2, y: 0 },
            { x: 2, y: 1 },
          ],
          playerName: 'SoE',
        },
      })
    })

    it('should move all enemies', () => {
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
            status: ['enemy'],
          },
          {
            type: 'gaz',
            x: 2,
            y: 0,
            status: ['enemy', 'enemy'],
          },
        ],
      })
      store.dispatch = jest.fn()

      enemies.process(store, {})

      // expect(store.dispatch).toHaveBeenCalledTimes(3)
      expect(store.dispatch.mock.calls.map((args) => args[0])).toEqual([
        {
          type: '@enemies>move',
          payload: {
            enemy: {
              x: 1,
              y: 0,
            },
            path: [
              { x: 1, y: 0 },
              { x: 0, y: 0 },
            ],
            playerName: 'Tripa',
          },
        },
        {
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
        },
        {
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
        },
      ])
    })

    it('should kill an enemy if it is too far away (> 6 tiles)', () => {
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
            x: 1,
            y: 0,
            status: [],
          },
          {
            x: 2,
            y: 0,
            status: [],
          },
          {
            x: 3,
            y: 0,
            status: [],
          },
          {
            x: 4,
            y: 0,
            status: [],
          },
          {
            x: 5,
            y: 0,
            status: [],
          },
          {
            x: 6,
            y: 0,
            status: [],
          },
          {
            x: 7,
            y: 0,
            status: ['enemy'],
          },
        ],
      })
      store.dispatch = jest.fn()

      enemies.process(store, {})

      expect(store.dispatch).toHaveBeenCalledTimes(1)
      expect(store.dispatch).toHaveBeenCalledWith({
        type: '@enemies>kill',
        payload: {
          x: 7,
          y: 0,
        },
      })
    })

    it.todo('should move not move the enemy through a wall')
  })

  describe('kill', () => {
    it('should kill the enemy', () => {
      const store = createStore({
        grid: [
          {
            x: 0,
            y: 0,
          },
          {
            x: 1,
            y: 0,
            status: ['enemy'],
          },
        ],
      })

      enemies.kill(store, { payload: { x: 1, y: 0 } })

      expect(store.getState()).toEqual({
        grid: [
          {
            x: 0,
            y: 0,
          },
          {
            x: 1,
            y: 0,
            status: [],
          },
        ],
      })
    })

    it('should kill on of the enemy', () => {
      const store = createStore({
        grid: [
          {
            x: 0,
            y: 0,
          },
          {
            x: 1,
            y: 0,
            status: ['enemy', 'enemy'],
          },
        ],
      })

      enemies.kill(store, { payload: { x: 1, y: 0 } })

      expect(store.getState()).toEqual({
        grid: [
          {
            x: 0,
            y: 0,
          },
          {
            x: 1,
            y: 0,
            status: ['enemy'],
          },
        ],
      })
    })
  })
})
