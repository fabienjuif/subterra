import createStore from '@myrtille/mutate'
import * as players from './players'

describe('players', () => {
  describe('damage', () => {
    it('should damge player', () => {
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

      players.damage(store, { payload: { name: 'Hatsu', damage: 2 } })
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
      store.addListener(
        () => true,
        (str, act) => {
          str.mutate((state) => {
            state.events.push(act)
          })
        },
      )

      players.checkDamageFromCard(store, {})

      expect(store.getState().events).toEqual([
        {
          type: '@player>damage',
          payload: { player: { name: 'Hatsu', damageType: 'gaz', damage: 2 } },
        },
      ])
    })
  })
})
