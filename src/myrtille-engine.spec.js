import { store, resetStore } from './myrtille-engine'

describe('game myrtille-engine', () => {
  describe("action 'reset'", () => {
    it('should reset the state', () => {
      expect(store.getState().logs.length).toBe(0)

      store.dispatch('pushLog')
      expect(store.getState().logs.length).toBe(1)

      store.dispatch('reset')
      expect(store.getState().logs.length).toBe(0)
    })
  })

  describe("action 'pushLog'", () => {
    it('should create a new log with all given information, an id and a timestamp', () => {
      const infos = { message: 'test' }

      store.dispatch('reset')
      store.dispatch({ type: 'pushLog', payload: infos })

      expect(store.getState().logs).toEqual([expect.objectContaining(infos)])
      expect(store.getState().logs[0].id).toBeDefined()
      expect(store.getState().logs[0].timestamp).toBeDefined()
    })
  })

  describe("action 'newCard'", () => {
    it('should set a new board card and reduce the number of cards in the deck if this number is more than 0', () => {
      store.dispatch('reset')
      expect(store.getState().board.card).toBeUndefined()
      expect(store.getState().decks.cards.length).toBe(10)

      store.dispatch('newCard')
      expect(store.getState().board.card).toBeDefined()
      expect(store.getState().board.card.type).not.toBe('end')
      expect(store.getState().decks.cards.length).toBe(9)
    })
    it('should set a end board card without change the the number of cards in the deck if this number is 0', () => {
      store.dispatch('reset')
      store.mutate((state) => (state.decks.cards.length = 0))
      expect(store.getState().board.card).toBeUndefined()
      expect(store.getState().decks.cards.length).toBe(0)

      store.dispatch('newCard')
      expect(store.getState().board.card).toBeDefined()
      expect(store.getState().board.card.type).toBe('end')
      expect(store.getState().decks.cards.length).toBe(0)
    })
  })

  describe("action 'damagePlayer'", () => {
    it("should find the good player, reduce it's health and push a log", () => {
      store.dispatch('reset')
      store.mutate((state) => {
        state.players.push({ name: 'toto', health: 3 })
        state.players.push({ name: 'test', health: 3 })
      })
      expect(store.getState().players.length).toBe(2)

      store.dispatch({
        type: 'damagePlayer',
        payload: { player: { name: 'test' }, damageType: 'gaz', damage: 2 },
      })
      expect(store.getState().players).toEqual([
        { name: 'toto', health: 3 },
        { name: 'test', health: 1 },
      ])
    })
  })
})
