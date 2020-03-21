import createStore from '@myrtille/mutate'
import * as cards from './cards'

describe('cards', () => {
  describe('pick', () => {
    it('should set a new board card and reduce the number of cards in the deck if this number is more than 0', () => {
      const store = createStore({
        board: {},
        decks: { cards: { length: 10 } },
      })

      cards.pick(store, {})

      expect(store.getState().board.card).toBeDefined()
      expect(store.getState().board.card.type).not.toBe('end')
      expect(store.getState().decks.cards.length).toBe(9)
    })
    it('should set a end board card without change the the number of cards in the deck if this number is 0', () => {
      const store = createStore({
        board: {},
        decks: { cards: { length: 0 } },
      })

      cards.pick(store, {})

      expect(store.getState().board.card).toBeDefined()
      expect(store.getState().board.card.type).toBe('end')
      expect(store.getState().decks.cards.length).toBe(0)
    })
  })
})
