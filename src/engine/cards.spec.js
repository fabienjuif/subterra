import createStore from '@myrtille/mutate'
import * as cards from './cards'
import cardData from '../utils/cards'

describe('cards', () => {
  describe('init', () => {
    it('should set a new deck cards', () => {
      const store = createStore({ deckCards: [cardData[1], cardData[0]] })

      cards.init(store, { payload: [cardData[2], cardData[3], cardData[0]] })

      expect(store.getState()).toEqual({
        deckCards: [cardData[2], cardData[3], cardData[0]],
      })
    })
  })

  describe('pick', () => {
    it('should set a new board card and reduce the number of cards in the deck if this number is more than 0', () => {
      const store = createStore({
        activeCard: {},
        deckCards: [cardData[2], cardData[3], cardData[0]],
      })

      cards.pick(store, {})

      expect(store.getState().activeCard).toBeDefined()
      expect(store.getState().activeCard.type).not.toBe('end')
      expect(store.getState().deckCards).toEqual([cardData[3], cardData[0]])
    })

    it('should not pick a card if the deck is empty', () => {
      const store = createStore({
        activeCard: cardData[0],
        deckCards: [],
      })

      cards.pick(store, {})

      expect(store.getState().activeCard).toBeDefined()
      expect(store.getState().activeCard.type).toBe('end')
      expect(store.getState().deckCards).toEqual([])
    })
  })
})
