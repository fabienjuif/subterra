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

  describe('checkDamageFromCard', () => {
    it('should send a @player>damage action for each player on a tile with the same type as the card', () => {
      const store = createStore({
        board: {
          card: { type: 'gaz', damage: 2 },
          tiles: [
            { type: 'start', x: 0, y: 0 },
            { type: 'gaz', x: 1, y: 1 },
          ],
        },
        players: [
          { name: 'Sutat', x: 0, y: 0 },
          { name: 'Hatsu', x: 1, y: 1 },
        ],
        events: [],
      })

      store.dispatch = jest.fn()

      players.checkDamageFromCard(store, {})

      expect(store.dispatch).toHaveBeenCalledTimes(1)
      expect(store.dispatch).toHaveBeenCalledWith({
        type: '@player>damage',
        payload: {
          player: { name: 'Hatsu', x: 1, y: 1 },
          damageType: 'gaz',
          damage: 2,
        }
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
        payload: { player: { name: 'Hatsu', health: -1 } }
      })
      expect(store.dispatch).toHaveBeenCalledWith({
        type: '@player>death',
        payload: { player: { name: 'Soe', health: 0 } }
      })
    })
  })

})
