import createStore from '@myrtille/mutate'
import * as players from './players'

describe('players', () => {
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
        payload: { player: { name: 'Hatsu' }, damage: 2 },
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
  })

  describe('checkDeathFromDamage', () => {
    it('should send a @player>death action for each player with health <= 0', () => {
      const store = createStore({
        players: [
          { name: 'Hatsu', health: -1 },
          { name: 'Soe', health: 0 },
          { name: 'Sutat', health: 1 },
        ],
        events: [],
      })

      store.dispatch = jest.fn()

      store.getState().players.forEach((player) => {
        players.checkDeathFromDamage(store, { payload: { player: player } })
      })

      expect(store.dispatch).toHaveBeenCalledTimes(2)
      expect(store.dispatch).toHaveBeenCalledWith({
        type: '@player>death',
        payload: { player: { name: 'Hatsu', health: -1 } },
      })
      expect(store.dispatch).toHaveBeenCalledWith({
        type: '@player>death',
        payload: { player: { name: 'Soe', health: 0 } },
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
