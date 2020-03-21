import createStore from '@myrtille/mutate'
import { push } from './logs'

describe('logs', () => {
  describe('pushLog', () => {
    it('should add a log', () => {
      const store = createStore({
        logs: [],
      })

      push(store, { payload: { message: 'oupsy' } })

      const state = store.getState()
      expect(state).toEqual({
        logs: [
          expect.objectContaining({
            message: 'oupsy',
          }),
        ],
      })
      expect(state.logs[0].id).toBeDefined()
      expect(state.logs[0].timestamp).toBeDefined()
    })
  })
})
