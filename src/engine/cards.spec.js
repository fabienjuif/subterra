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

    it('should calls @cards>shake if the next card is a shaking card', () => {
      const store = createStore({
        deckCards: [{ type: 'shake' }],
      })

      store.dispatch = jest.fn()

      cards.pick(store, {})

      expect(store.dispatch).toHaveBeenCalledTimes(1)
      expect(store.dispatch).toHaveBeenCalledWith('@cards>shake')
    })

    it('should roll a dice for the card landslide', () => {
      const store = createStore({
        deckCards: [{ type: 'landslide' }],
      })

      store.dispatch = jest.fn()

      cards.pick(store, {})

      expect(store.dispatch).toHaveBeenCalledTimes(1)
      expect(store.dispatch).toHaveBeenCalledWith({
        type: '@dices>roll',
        payload: {
          what: '@cards>landslide',
        },
      })
    })

    it('should calls @cards>water if the next card is a water card', () => {
      const store = createStore({
        deckCards: [{ type: 'water' }],
      })

      store.dispatch = jest.fn()

      cards.pick(store, {})

      expect(store.dispatch).toHaveBeenCalledTimes(1)
      expect(store.dispatch).toHaveBeenCalledWith('@cards>water')
    })

    it('should calls @cards>gaz if the next card is a gaz card', () => {
      const store = createStore({
        deckCards: [{ type: 'gaz' }],
      })

      store.dispatch = jest.fn()

      cards.pick(store, {})

      expect(store.dispatch).toHaveBeenCalledTimes(1)
      expect(store.dispatch).toHaveBeenCalledWith('@cards>gaz')
    })
  })

  describe('shake', () => {
    it('should roll dices for each players', () => {
      const store = createStore({
        activeCard: { type: 'shake', damage: 1 },
        players: [
          {
            name: 'Hatsu',
          },
          {
            name: 'SoE',
          },
        ],
      })

      store.dispatch = jest.fn()

      const stateBefore = store.getState()

      cards.shake(store, {})

      expect(stateBefore).toEqual(store.getState())
      expect(store.dispatch).toHaveBeenCalledTimes(2)
      expect(store.dispatch).toHaveBeenCalledWith({
        type: '@dices>roll',
        payload: {
          min: 4,
          playerName: 'Hatsu',
          actionOnFail: {
            type: '@players>damage',
            payload: {
              damage: 1,
              from: {
                card: { type: 'shake', damage: 1 },
              },
              playerName: 'Hatsu',
            },
          },
        },
      })
      expect(store.dispatch).toHaveBeenCalledWith({
        type: '@dices>roll',
        payload: {
          min: 4,
          playerName: 'SoE',
          actionOnFail: {
            type: '@players>damage',
            payload: {
              damage: 1,
              from: {
                card: { type: 'shake', damage: 1 },
              },
              playerName: 'SoE',
            },
          },
        },
      })
    })

    describe('landslide', () => {
      it('should set the status landslide on tile that dont already have it', () => {
        const store = createStore({
          players: [],
          grid: [
            {
              status: [],
              dices: [2, 3],
              type: 'water',
            },
            {
              status: ['landslide'],
              dices: [2, 3],
              type: 'landslide',
            },
            {
              status: ['enemy'],
              dices: [2, 3],
              type: 'landslide',
            },
            {
              dices: [3, 4],
              status: [],
              type: 'landslide',
            },
          ],
        })

        cards.landslide(store, { payload: { value: 2 } })

        expect(store.getState()).toEqual({
          players: [],
          grid: [
            {
              status: [],
              dices: [2, 3],
              type: 'water',
            },
            {
              status: ['landslide'],
              dices: [2, 3],
              type: 'landslide',
            },
            {
              status: ['enemy', 'landslide'], // new marker
              dices: [2, 3],
              type: 'landslide',
            },
            {
              dices: [3, 4],
              status: [],
              type: 'landslide',
            },
          ],
        })
      })

      it('should damage players on a new landslide tile', () => {
        const store = createStore({
          activeCard: {
            type: 'landslide',
            damage: 2,
          },
          players: [
            {
              name: 'Hatsu',
              x: 0,
              y: 2,
            },
            {
              name: 'SoE',
              x: 2,
              y: 3,
            },
          ],
          grid: [
            {
              type: 'landslide',
              dices: [1, 2],
              status: [],
              x: 0,
              y: 2,
            },
          ],
        })
        store.dispatch = jest.fn()

        cards.landslide(store, { payload: { value: 1 } })

        expect(store.getState()).toEqual({
          activeCard: {
            type: 'landslide',
            damage: 2,
          },
          players: [
            {
              name: 'Hatsu',
              x: 0,
              y: 2,
            },
            {
              name: 'SoE',
              x: 2,
              y: 3,
            },
          ],
          grid: [
            {
              type: 'landslide',
              dices: [1, 2],
              status: ['landslide'],
              x: 0,
              y: 2,
            },
          ],
        })
        expect(store.dispatch).toHaveBeenCalledTimes(1)
        expect(store.dispatch).toHaveBeenCalledWith({
          type: '@players>damage',
          payload: {
            damage: 2,
            from: {
              card: {
                type: 'landslide',
                damage: 2,
              },
            },
            playerName: 'Hatsu',
          },
        })
      })
    })
  })

  describe('processMarkerCard', () => {
    it('should set the status "marker" on tile that dont already have it', () => {
      const store = createStore({
        players: [],
        grid: [
          {
            status: [],
            dices: [2, 3],
            type: 'landslide',
          },
          {
            status: ['marker'],
            type: 'marker',
          },
          {
            status: ['enemy'],
            type: 'marker',
          },
          {
            status: [],
            type: 'marker',
          },
        ],
      })

      cards.processMarkerCard(store, {
        payload: { card: { type: 'marker', damage: 1 } },
      })

      expect(store.getState()).toEqual({
        players: [],
        grid: [
          {
            status: [],
            dices: [2, 3],
            type: 'landslide',
          },
          {
            status: ['marker'],
            type: 'marker',
          },
          {
            status: ['enemy', 'marker'],
            type: 'marker',
          },
          {
            status: ['marker'],
            type: 'marker',
          },
        ],
      })
    })

    it('should damage players on a new marker tile', () => {
      const store = createStore({
        players: [
          {
            name: 'Hatsu',
            x: 0,
            y: 2,
          },
          {
            name: 'SoE',
            x: 2,
            y: 3,
          },
        ],
        grid: [
          {
            type: 'marker',
            status: [],
            x: 0,
            y: 2,
          },
        ],
      })
      store.dispatch = jest.fn()

      cards.processMarkerCard(store, {
        payload: { card: { type: 'marker', damage: 1 } },
      })

      expect(store.getState()).toEqual({
        players: [
          {
            name: 'Hatsu',
            x: 0,
            y: 2,
          },
          {
            name: 'SoE',
            x: 2,
            y: 3,
          },
        ],
        grid: [
          {
            type: 'marker',
            status: ['marker'],
            x: 0,
            y: 2,
          },
        ],
      })
      expect(store.dispatch).toHaveBeenCalledTimes(1)
      expect(store.dispatch).toHaveBeenCalledWith({
        type: '@players>damage',
        payload: {
          damage: 1,
          damageFrom: {
            card: {
              type: 'marker',
              damage: 1,
            },
          },
          player: {
            name: 'Hatsu',
            x: 0,
            y: 2,
          },
        },
      })
    })
  })
})
