import createStore from '@myrtille/mutate'
import { cards as cardData } from '@subterra/data'
import { players, roll } from './actions'
import * as cards from './cards'

describe('cards', () => {
  describe('init', () => {
    it('should set a new deck cards', () => {
      const store = createStore({ cards: {} })

      cards.init(store, {
        payload: {
          remaining: 3,
          deck: [cardData[2], cardData[3], cardData[0]],
        },
      })

      expect(store.getState()).toEqual({
        cards: {
          remaining: 3,
          deck: [cardData[2], cardData[3], cardData[0]],
          active: undefined,
        },
      })
    })
  })

  describe('pick', () => {
    it('should set a new board card and reduce the number of cards in the deck if this number is more than 0', () => {
      const store = createStore({
        cards: {
          remaining: 3,
          deck: [cardData[2], cardData[3], cardData[0]],
          active: undefined,
        },
        seeds: {
          cardsNext: 'se3Ed',
        },
      })

      cards.pick(store, {})

      expect(store.getState().cards).toEqual({
        remaining: 2,
        deck: [
          { ...cardData[2], remaining: cardData[2].remaining - 1 },
          cardData[3],
          cardData[0],
        ],
        active: cardData[2].card,
      })
    })

    it('should not pick a card if the deck is empty but it should dispatch it', () => {
      const store = createStore({
        cards: {
          remaining: 1,
          deck: [],
          active: undefined,
        },
        seeds: {
          cardsNext: 'se3Ed',
        },
      })
      store.dispatch = jest.fn()

      cards.pick(store, {})

      expect(store.getState().cards).toEqual({
        remaining: 0,
        deck: [],
        active: {
          id: 'hKyJQmhBBSgFdJkZStisD',
          type: 'end',
        },
      })
      expect(store.dispatch).toHaveBeenCalledTimes(1)
      expect(store.dispatch).toHaveBeenCalledWith({
        type: '@cards>end',
        payload: {
          card: {
            id: 'hKyJQmhBBSgFdJkZStisD',
            type: 'end',
          },
        },
      })
    })

    it('should calls @cards>shake if the next card is a shaking card', () => {
      const store = createStore({
        cards: {
          remaining: 2,
          deck: [{ card: { type: 'shake' }, remaining: 1 }],
          active: undefined,
        },
        seeds: {
          cardsNext: 'se3Ed',
        },
      })

      store.dispatch = jest.fn()

      cards.pick(store, {})

      expect(store.dispatch).toHaveBeenCalledTimes(1)
      expect(store.dispatch).toHaveBeenCalledWith({
        type: '@cards>shake',
        payload: {
          card: {
            type: 'shake',
          },
        },
      })
    })

    it('should roll a dice for the card landslide', () => {
      const store = createStore({
        cards: {
          remaining: 2,
          deck: [{ card: { type: 'landslide' }, remaining: 1 }],
          active: undefined,
        },
        seeds: {
          cardsNext: 'se3Ed',
        },
      })

      store.dispatch = jest.fn()

      cards.pick(store, {})

      expect(store.dispatch).toHaveBeenCalledTimes(1)
      expect(store.dispatch).toHaveBeenCalledWith(
        roll.then({ type: '@cards>landslide' }),
      )
    })

    it('should calls @cards>water if the next card is a water card', () => {
      const store = createStore({
        cards: {
          remaining: 2,
          deck: [{ card: { type: 'water' }, remaining: 1 }],
          active: undefined,
        },
        seeds: {
          cardsNext: 'se3Ed',
        },
      })

      store.dispatch = jest.fn()

      cards.pick(store, {})

      expect(store.dispatch).toHaveBeenCalledTimes(1)
      expect(store.dispatch).toHaveBeenCalledWith({
        type: '@cards>water',
        payload: { card: { type: 'water' } },
      })
    })

    it('should calls @cards>gaz if the next card is a gaz card', () => {
      const store = createStore({
        cards: {
          remaining: 2,
          deck: [{ card: { type: 'gaz' }, remaining: 1 }],
          active: undefined,
        },
        seeds: {
          cardsNext: 'se3Ed',
        },
      })

      store.dispatch = jest.fn()

      cards.pick(store, {})

      expect(store.dispatch).toHaveBeenCalledTimes(1)
      expect(store.dispatch).toHaveBeenCalledWith({
        type: '@cards>gaz',
        payload: {
          card: {
            type: 'gaz',
          },
        },
      })
    })

    it('should calls @cards>enemy if the next card is a enemy card', () => {
      const store = createStore({
        cards: {
          remaining: 2,
          deck: [{ card: { type: 'enemy' }, remaining: 1 }],
          active: undefined,
        },
        seeds: {
          cardsNext: 'se3Ed',
        },
      })

      store.dispatch = jest.fn()

      cards.pick(store, {})

      expect(store.dispatch).toHaveBeenCalledTimes(1)
      expect(store.dispatch).toHaveBeenCalledWith({
        type: '@cards>enemy',
        payload: {
          card: {
            type: 'enemy',
          },
        },
      })
    })
  })

  describe('shake', () => {
    it('should roll dices for each players', () => {
      const store = createStore({
        cards: { active: { type: 'shake', damage: 1 } },
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
      expect(store.dispatch).toHaveBeenCalledWith(
        roll.failThen(
          4,
          { name: 'Hatsu' },
          players.damage({ name: 'Hatsu' }, 1, {
            card: { type: 'shake', damage: 1 },
          }),
        ),
      )
      expect(store.dispatch).toHaveBeenCalledWith(
        roll.failThen(
          4,
          { name: 'SoE' },
          players.damage({ name: 'SoE' }, 1, {
            card: { type: 'shake', damage: 1 },
          }),
        ),
      )
    })

    describe('landslide', () => {
      it('should set the status landslide on tile that dont already have it', () => {
        const store = createStore({
          cards: {
            active: {},
          },
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

        cards.landslide(store, { payload: { rolled: 2 } })

        expect(store.getState()).toEqual({
          cards: {
            active: {},
          },
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
          cards: {
            active: {
              type: 'landslide',
              damage: 2,
            },
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

        cards.landslide(store, { payload: { rolled: 1 } })

        expect(store.getState()).toEqual({
          cards: {
            active: {
              type: 'landslide',
              damage: 2,
            },
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
        expect(store.dispatch).toHaveBeenCalledWith(
          players.damage({ name: 'Hatsu' }, 2, {
            card: { type: 'landslide', damage: 2 },
          }),
        )
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
      expect(store.dispatch).toHaveBeenCalledWith(
        players.damage({ name: 'Hatsu' }, 1, {
          card: { type: 'marker', damage: 1 },
        }),
      )
    })
  })

  describe('end', () => {
    it('should dispatch a roll and with a fail > damage for each player alive', () => {
      const store = createStore({
        players: [
          {
            name: 'Hatsu',
            health: 2,
          },
          {
            name: 'SoE',
            health: 0,
          },
          {
            name: 'Tripa',
            health: 1,
          },
        ],
      })
      store.dispatch = jest.fn()

      cards.end(store, { payload: { card: { type: 'end' } } })

      expect(store.getState()).toEqual({
        players: [
          {
            name: 'Hatsu',
            health: 2,
          },
          {
            name: 'SoE',
            health: 0,
          },
          {
            name: 'Tripa',
            health: 1,
          },
        ],
      })
      expect(store.dispatch).toHaveBeenCalledTimes(2)
      expect(store.dispatch).toHaveBeenCalledWith(
        roll.failThen(
          3,
          { name: 'Hatsu' },
          players.damage({ name: 'Hatsu' }, 1000, {
            from: {
              card: { type: 'end' },
            },
          }),
        ),
      )
      expect(store.dispatch).toHaveBeenCalledWith(
        roll.failThen(
          3,
          { name: 'Tripa' },
          players.damage({ name: 'Tripa' }, 1000, {
            from: {
              card: { type: 'end' },
            },
          }),
        ),
      )
    })
  })
})
