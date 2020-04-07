import createStore from '@myrtille/mutate'
import { addMessage } from './messages'

describe('lobby/message', () => {
  describe('addMessage', () => {
    it('should add message', () => {
      const store = createStore({ messages: [] })

      addMessage(store, { payload: { this: 'is a message' } })

      expect(store.getState()).toEqual({
        messages: [{ this: 'is a message' }],
      })
    })
  })
})
