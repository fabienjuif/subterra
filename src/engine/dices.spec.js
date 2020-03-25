import createStore from '@myrtille/mutate'
import * as dices from './dices'

describe('dices', () => {
  describe('init', () => {
    it('should set new dices', () => {
      const store = createStore({ dices: [] })

      dices.init(store, { payload: [3, 4, 2, 1] })

      expect(store.getState()).toEqual({
        dices: [3, 4, 2, 1],
      })
    })
  })
})
