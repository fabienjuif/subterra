import createStore from '@myrtille/mutate'
import { init } from './seeds'

describe('seeds', () => {
  describe('init', () => {
    it('should throw an error if there is no seed set', () => {
      expect(() => init(undefined, { payload: {} })).toThrowError(
        'Master seed must be given',
      )
    })

    it('should set seeds from master and mark them private', () => {
      const store = createStore({})
      init(store, {
        payload: {
          master: 's3eED',
        },
      })

      expect(store.getState()).toEqual({
        seeds: {
          master: 's3eED',
          dices: '9AoHJila2H',
          dicesNext: '9AoHJila2H',
          private: true,
        },
      })
    })

    it('should set seeds from master and mark them public', () => {
      const store = createStore({})
      init(store, {
        payload: {
          master: 's3eED',
          private: false,
        },
      })

      expect(store.getState()).toEqual({
        seeds: {
          master: 's3eED',
          dices: '9AoHJila2H',
          dicesNext: '9AoHJila2H',
          private: false,
        },
      })
    })

    it('should set seeds from given overloads', () => {
      const store = createStore({})
      init(store, {
        payload: {
          master: 's3eED',
          dices: 'DiC3s',
          private: false,
        },
      })

      expect(store.getState()).toEqual({
        seeds: {
          master: 's3eED',
          dices: 'DiC3s',
          dicesNext: 'DiC3s',
          private: false,
        },
      })
    })
  })
})
