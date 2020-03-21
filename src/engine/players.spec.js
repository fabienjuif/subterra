import createStore from '@myrtille/mutate'
import { damage } from './players'

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

      damage(store, { payload: { name: 'Hatsu', damage: 2 } })
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
})
