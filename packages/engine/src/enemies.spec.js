import createStore from '@myrtille/mutate'
import * as enemies from './enemies'
import { enemies as actions } from './actions'

const createCell = (x, y) => ({
  x,
  y,
  status: [],
  top: true,
  right: true,
  bottom: true,
  left: true,
})

describe('enemies', () => {
  describe('move', () => {
    it('should move enemy from a cell to an other', () => {
      const store = createStore({
        grid: [
          createCell(0, 0),
          {
            x: 0,
            y: -1,
            status: ['enemy'],
            top: true,
            right: true,
            bottom: true,
            left: true,
          },
          createCell(1, 0),
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
          expect.objectContaining(createCell(0, 0)),
          expect.objectContaining(createCell(0, -1)),
          {
            x: 1,
            y: 0,
            status: ['enemy'],
            top: true,
            right: true,
            bottom: true,
            left: true,
          },
        ],
      })
    })

    it('should move enemy without moving an other', () => {
      const store = createStore({
        grid: [
          createCell(0, 0),
          {
            x: 0,
            y: -1,
            status: ['enemy', 'enemy'],
            top: true,
            right: true,
            bottom: true,
            left: true,
          },
          {
            x: 1,
            y: 0,
            status: ['landslide'],
            top: true,
            right: true,
            bottom: true,
            left: true,
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
          createCell(0, 0),
          {
            x: 0,
            y: -1,
            status: ['enemy'],
            top: true,
            right: true,
            bottom: true,
            left: true,
          },
          {
            x: 1,
            y: 0,
            status: ['landslide', 'enemy'],
            top: true,
            right: true,
            bottom: true,
            left: true,
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
        grid: [createCell(0, 0), createCell(0, -1), createCell(1, 0)],
      })
      store.dispatch = jest.fn()

      enemies.process(store, {})

      expect(store.dispatch).toHaveBeenCalledTimes(0)
    })

    it('should move the enemy towards the player', () => {
      const store = createStore({
        players: [
          {
            id: 'Tripa',
            x: 0,
            y: 0,
            strengh: 2,
          },
        ],
        grid: [
          createCell(0, 0),
          createCell(1, 0),
          {
            type: 'gaz',
            x: 2,
            y: 0,
            status: ['enemy'],
            top: true,
            right: true,
            bottom: true,
            left: true,
          },
        ],
      })
      store.dispatch = jest.fn()

      enemies.process(store, {})

      expect(store.dispatch).toHaveBeenCalledTimes(1)
      expect(store.dispatch).toHaveBeenCalledWith(
        actions.move(
          // enemy, path, player
          { x: 2, y: 0 },
          [
            expect.objectContaining({ x: 2, y: 0 }),
            expect.objectContaining({ x: 1, y: 0 }),
            expect.objectContaining({ x: 0, y: 0 }),
          ], //
          { id: 'Tripa' },
        ),
      )
    })

    it('should move the enemy towards the closest player', () => {
      const store = createStore({
        players: [
          {
            id: 'Tripa',
            x: 0,
            y: 0,
            strength: 2,
          },
          {
            id: 'SoE',
            x: 2,
            y: 1,
            strength: 2,
          },
        ],
        grid: [
          createCell(0, 0),
          createCell(1, 0),
          {
            type: 'gaz',
            x: 2,
            y: 0,
            status: ['enemy'],
            top: true,
            right: true,
            bottom: true,
            left: true,
          },
          createCell(2, 1),
        ],
      })
      store.dispatch = jest.fn()

      enemies.process(store, {})

      expect(store.dispatch).toHaveBeenCalledTimes(1)
      expect(store.dispatch).toHaveBeenCalledWith(
        actions.move(
          { x: 2, y: 0 },
          [
            expect.objectContaining({ x: 2, y: 0 }),
            expect.objectContaining({ x: 2, y: 1 }),
          ],
          { id: 'SoE' },
        ),
      )
    })

    it('should move the enemy towards the weakest player', () => {
      const getDispatchWithTripaStrength = (strength) => {
        const store = createStore({
          players: [
            {
              id: 'Tripa',
              x: 1,
              y: 0,
              strength,
            },
            {
              id: 'SoE',
              x: 2,
              y: 1,
              strength: 2,
            },
          ],
          grid: [
            createCell(0, 0),
            createCell(1, 0),
            {
              type: 'gaz',
              x: 2,
              y: 0,
              status: ['enemy'],
              top: true,
              right: true,
              bottom: true,
              left: true,
            },
            createCell(2, 1),
          ],
        })
        store.dispatch = jest.fn()

        enemies.process(store, {})

        return store.dispatch
      }

      let dispatch = getDispatchWithTripaStrength(1)
      expect(dispatch).toHaveBeenCalledTimes(1)
      expect(dispatch).toHaveBeenCalledWith(
        actions.move(
          { x: 2, y: 0 },
          [
            expect.objectContaining({ x: 2, y: 0 }),
            expect.objectContaining({ x: 1, y: 0 }),
          ],
          { id: 'Tripa' },
        ),
      )

      dispatch = getDispatchWithTripaStrength(3)
      expect(dispatch).toHaveBeenCalledTimes(1)
      expect(dispatch).toHaveBeenCalledWith(
        actions.move(
          { x: 2, y: 0 },
          [
            expect.objectContaining({ x: 2, y: 0 }),
            expect.objectContaining({ x: 2, y: 1 }),
          ],
          { id: 'SoE' },
        ),
      )
    })

    it('should move all enemies', () => {
      const store = createStore({
        players: [
          {
            id: 'Tripa',
            x: 0,
            y: 0,
            strengh: 2,
          },
        ],
        grid: [
          createCell(0, 0),
          {
            x: 1,
            y: 0,
            status: ['enemy'],
            top: true,
            right: true,
            bottom: true,
            left: true,
          },
          {
            x: 2,
            y: 0,
            status: ['enemy', 'enemy'],
            top: true,
            right: true,
            bottom: true,
            left: true,
          },
        ],
      })
      store.dispatch = jest.fn()

      enemies.process(store, {})

      expect(store.dispatch.mock.calls.map((args) => args[0])).toEqual([
        actions.move(
          { x: 1, y: 0 },
          [
            expect.objectContaining({ x: 1, y: 0 }),
            expect.objectContaining({ x: 0, y: 0 }),
          ],
          { id: 'Tripa' },
        ),
        actions.move(
          { x: 2, y: 0 },
          [
            expect.objectContaining({ x: 2, y: 0 }),
            expect.objectContaining({ x: 1, y: 0 }),
            expect.objectContaining({ x: 0, y: 0 }),
          ],
          { id: 'Tripa' },
        ),
        actions.move(
          { x: 2, y: 0 },
          [
            expect.objectContaining({ x: 2, y: 0 }),
            expect.objectContaining({ x: 1, y: 0 }),
            expect.objectContaining({ x: 0, y: 0 }),
          ],
          { id: 'Tripa' },
        ),
      ])
    })

    it('should kill an enemy if it is too far away (> 6 tiles)', () => {
      const store = createStore({
        players: [
          {
            id: 'Tripa',
            x: 0,
            y: 0,
            top: true,
            right: true,
            bottom: true,
            left: true,
            strengh: 2,
          },
        ],
        grid: [
          createCell(0, 0),
          createCell(1, 0),
          createCell(2, 0),
          createCell(3, 0),
          createCell(4, 0),
          createCell(5, 0),
          createCell(6, 0),
          {
            x: 7,
            y: 0,
            top: true,
            right: true,
            bottom: true,
            left: true,
            status: ['enemy'],
          },
        ],
      })
      store.dispatch = jest.fn()

      enemies.process(store, {})

      expect(store.dispatch).toHaveBeenCalledTimes(1)
      expect(store.dispatch).toHaveBeenCalledWith(actions.kill({ x: 7, y: 0 }))
    })

    it('should not move the enemy through a wall', () => {
      const store = createStore({
        players: [
          {
            id: 'Tripa',
            x: 0,
            y: 0,
            strengh: 2,
          },
        ],
        grid: [
          createCell(0, 0),
          createCell(1, 0),
          {
            x: 2,
            y: 0,
            status: ['enemy'],
            bottom: true,
            right: true,
          },
          createCell(2, 1),
          createCell(1, 1),
        ],
      })
      store.dispatch = jest.fn()

      enemies.process(store, {})

      expect(store.dispatch).toHaveBeenCalledTimes(1)
      expect(store.dispatch).toHaveBeenCalledWith(
        actions.move(
          { x: 2, y: 0 },
          [
            expect.objectContaining({ x: 2, y: 0 }),
            expect.objectContaining({ x: 2, y: 1 }),
            expect.objectContaining({ x: 1, y: 1 }),
            expect.objectContaining({ x: 1, y: 0 }),
            expect.objectContaining({ x: 0, y: 0 }),
          ],
          { id: 'Tripa' },
        ),
      )
    })
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

      enemies.kill(store, actions.kill({ x: 1, y: 0 }))

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

      enemies.kill(store, actions.kill({ x: 1, y: 0 }))

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
