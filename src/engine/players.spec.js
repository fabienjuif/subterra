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

    it('should give action point back, mark the first player and pick a card', () => {
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
      expect(store.dispatch).toHaveBeenCalledWith('@cards>pick')

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
      expect(store.dispatch).toHaveBeenCalledWith('@cards>pick')
    })
  })

  describe('move', () => {
    it('should move player', () => {
      const store = createStore({
        players: [
          { name: 'Hatsu', actionPoints: 1, x: 0, y: 0 },
          { name: 'SoE', actionPoints: 2, x: 0, y: 0 },
        ],
      })

      store.dispatch = jest.fn()

      players.move(store, {
        payload: { playerName: 'Hatsu', cost: 1, x: 1, y: -1 },
      })

      expect(store.getState()).toEqual({
        players: [
          { name: 'Hatsu', actionPoints: 0, x: 1, y: -1 },
          { name: 'SoE', actionPoints: 2, x: 0, y: 0 },
        ],
      })
      expect(store.dispatch).toHaveBeenCalledTimes(0)
    })

    it('should dispatch @dices>roll with @players>damage on fail when the player has not enough action points', () => {
      const store = createStore({
        players: [{ name: 'Hatsu', actionPoints: 1, x: 0, y: 0 }],
      })

      store.dispatch = jest.fn()

      players.move(store, {
        payload: { playerName: 'Hatsu', cost: 2, x: 1, y: -1 },
      })

      expect(store.getState()).toEqual({
        players: [{ name: 'Hatsu', actionPoints: 0, x: 1, y: -1 }],
      })
      expect(store.dispatch).toHaveBeenCalledTimes(1)
      expect(store.dispatch).toHaveBeenCalledWith({
        type: '@dices>roll',
        payload: {
          min: 4,
          actionOnFail: {
            type: '@players>damage',
            payload: { damage: 1, from: 'excess', playerName: 'Hatsu' },
          },
        },
      })
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

      store.dispatch = jest.fn()

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
      expect(store.dispatch).toHaveBeenCalledTimes(0)
    })

    it('should dispatch @players>death when the damaged player has no more health', () => {
      const store = createStore({
        players: [{ name: 'Hatsu', health: 1 }],
      })

      store.dispatch = jest.fn()

      players.damage(store, { payload: { playerName: 'Hatsu', damage: 2 } })

      expect(store.getState()).toEqual({
        players: [{ name: 'Hatsu', health: 0 }],
      })
      expect(store.dispatch).toHaveBeenCalledTimes(1)
      expect(store.dispatch).toHaveBeenCalledWith({
        type: '@player>death',
        payload: { playerName: 'Hatsu' },
      })
    })
  })

  describe('init', () => {
    it('should init players', () => {
      const store = createStore({
        players: [],
      })

      players.init(store, {})

      expect(store.getState()).toEqual({
        players: [
          {
            id: 0,
            x: 0,
            y: 0,
            health: 3,
            name: 'Sutat',
            archetype: 'explorer',
            actionPoints: 2,
            current: true,
            first: true,
          },
          {
            id: 1,
            x: 0,
            y: 0,
            health: 3,
            name: 'Tripa',
            archetype: 'chef',
            actionPoints: 2,
          },
          {
            id: 2,
            x: 0,
            y: 0,
            health: 5,
            name: 'SoE',
            archetype: 'miner',
            actionPoints: 2,
          },
        ],
      })
    })
  })
})
