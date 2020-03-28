import createStore from '@myrtille/mutate'
import * as players from './players'

describe('players', () => {
  describe('pass', () => {
    it('should pass to the next player (and not pick a card)', () => {
      const store = createStore({
        players: [
          {
            name: 'SoE',
            first: true,
            current: true,
          },
          {
            name: 'Hatsu',
          },
        ],
      })
      store.dispatch = jest.fn()
      players.pass(store, {})
      expect(store.dispatch).toHaveBeenCalledTimes(0)
      expect(store.getState()).toEqual({
        players: [
          {
            name: 'SoE',
            first: true,
            current: false,
          },
          {
            name: 'Hatsu',
            current: true,
          },
        ],
      })
    })

    it('should give action point back, mark the first player and mark the turn as ended', () => {
      // first case the last player is the last in the array
      let store = createStore({
        players: [
          {
            name: 'SoE',
            first: true,
            actionPoints: 0,
          },
          {
            name: 'Hatsu',
            actionPoints: 1,
          },
          {
            name: 'Tripa',
            current: true,
            actionPoints: 2,
          },
        ],
      })
      store.dispatch = jest.fn()
      players.pass(store, {})
      expect(store.getState()).toEqual({
        players: [
          {
            name: 'SoE',
            first: false,
            actionPoints: 2,
          },
          {
            name: 'Hatsu',
            first: true,
            current: true,
            actionPoints: 2,
          },
          {
            name: 'Tripa',
            current: false,
            actionPoints: 2,
          },
        ],
      })
      expect(store.dispatch).toHaveBeenCalledTimes(1)
      expect(store.dispatch).toHaveBeenCalledWith('@turn>start')

      // second case the last player is NOT the last in the array
      store = createStore({
        players: [
          {
            name: 'SoE',
            actionPoints: 0,
          },
          {
            name: 'Hatsu',
            current: true,
            actionPoints: 1,
          },
          {
            name: 'Tripa',
            first: true,
            actionPoints: 2,
          },
        ],
      })
      store.dispatch = jest.fn()
      players.pass(store, {})
      expect(store.getState()).toEqual({
        players: [
          {
            name: 'SoE',
            first: true,
            current: true,
            actionPoints: 2,
          },
          {
            name: 'Hatsu',
            current: false,
            actionPoints: 2,
          },
          {
            name: 'Tripa',
            first: false,
            actionPoints: 2,
          },
        ],
      })
      expect(store.dispatch).toHaveBeenCalledTimes(1)
      expect(store.dispatch).toHaveBeenCalledWith('@turn>start')
    })
  })

  describe('damage', () => {
    it('should damage player', () => {
      const store = createStore({
        players: [
          {
            name: 'SoE',
            health: 10,
          },
          {
            name: 'Hatsu',
            health: 5,
          },
        ],
      })

      players.damage(store, {
        payload: { playerName: 'Hatsu', damage: 2 },
      })
      expect(store.getState()).toEqual({
        players: [
          {
            name: 'SoE',
            health: 10,
          },
          {
            name: 'Hatsu',
            health: 3,
          },
        ],
      })
    })

    it('should kill player if it has no health remaining', () => {
      const store = createStore({
        players: [
          {
            name: 'SoE',
            health: 1,
          },
        ],
      })
      store.dispatch = jest.fn()

      players.damage(store, {
        payload: { playerName: 'SoE', damage: 2 },
      })

      expect(store.dispatch).toHaveBeenCalledTimes(1)
      expect(store.dispatch).toHaveBeenCalledWith({
        type: '@players>death',
        payload: {
          playerName: 'SoE',
        },
      })
    })
  })

  describe('init', () => {
    it('should init players', () => {
      const store = createStore({})

      players.init(store, {
        payload: [
          { type: 'explorer', name: 'Sutat' },
          { type: 'chef', name: 'Tripa' },
          { type: 'miner', name: 'SoE' },
        ],
      })

      expect(store.getState()).toEqual({
        players: [
          {
            x: 0,
            y: 0,
            name: 'Sutat',
            type: 'explorer',
            actionPoints: 2,
            current: true,
            first: true,
          },
          {
            x: 0,
            y: 0,
            name: 'Tripa',
            type: 'chef',
            actionPoints: 2,
          },
          {
            x: 0,
            y: 0,
            name: 'SoE',
            type: 'miner',
            actionPoints: 2,
          },
        ],
      })
    })
  })
})
