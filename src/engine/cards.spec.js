import createStore from '@myrtille/mutate'
import * as cards from './cards'

describe('cards', () => {
  describe('pick', () => {
    it('should set a new board card and reduce the number of cards in the deck if this number is more than 0', () => {
      const store = createStore({
        activeCard: {},
        deckCards: { length: 10 },
      })

      cards.pick(store, {})

      expect(store.getState().activeCard).toBeDefined()
      expect(store.getState().activeCard.type).not.toBe('end')
      expect(store.getState().deckCards.length).toBe(9)
    })
    it('should set a end board card without change the the number of cards in the deck if this number is 0', () => {
      const store = createStore({
        activeCard: {},
        deckCards: { length: 0 },
      })

      cards.pick(store, {})

      expect(store.getState().activeCard).toBeDefined()
      expect(store.getState().activeCard.type).toBe('end')
      expect(store.getState().deckCards.length).toBe(0)
    })
  })
})
