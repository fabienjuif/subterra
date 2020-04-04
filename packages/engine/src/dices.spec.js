import createStore from '@myrtille/mutate'
import * as dices from './dices'
import * as actions from './actions'

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

  describe('roll', () => {
    it('should roll dices and pass value and the given payload to a new @dices>rolled action', () => {
      const store = createStore({
        dices: [1, 2],
      })
      store.dispatch = jest.fn()

      dices.roll(store, { payload: { some: 'informations' } })

      // one of the dices has been used
      expect(store.getState()).toEqual({
        dices: [2],
      })

      // new action
      expect(store.dispatch).toHaveBeenCalledTimes(1)
      expect(store.dispatch).toHaveBeenCalledWith({
        type: '@dices>rolled',
        payload: {
          // the dice that has been used
          value: 1,
          // the rest of the payload
          some: 'informations',
        },
      })
    })
  })

  describe('checkAndDispatch', () => {
    it('should check a roll match a min value and call the success action that is given', () => {
      const store = createStore({ players: [] })
      store.dispatch = jest.fn()

      dices.checkAndDispatch(store, {
        payload: {
          min: 2,
          value: 3,
          actionOnSuccess: {
            type: 'sucess',
            payload: { some: 'informations' },
          },
          actionOnFail: {
            type: 'fail',
            payload: { some: 'informations (fail)' },
          },
        },
      })

      expect(store.dispatch).toHaveBeenCalledTimes(1)
      expect(store.dispatch).toHaveBeenCalledWith({
        type: 'sucess',
        payload: { some: 'informations' },
      })
    })

    it('should check a roll match a min value and call the fail action that is given', () => {
      const store = createStore({ players: [] })
      store.dispatch = jest.fn()

      dices.checkAndDispatch(store, {
        payload: {
          min: 2,
          value: 1,
          actionOnSuccess: {
            type: 'sucess',
            payload: { some: 'informations' },
          },
          actionOnFail: {
            type: 'fail',
            payload: { some: 'informations (fail)' },
          },
        },
      })

      expect(store.dispatch).toHaveBeenCalledTimes(1)
      expect(store.dispatch).toHaveBeenCalledWith({
        type: 'fail',
        payload: { some: 'informations (fail)' },
      })
    })

    it('should check a roll and do not dispatch anything (success branch)', () => {
      const store = createStore({ players: [] })
      store.dispatch = jest.fn()

      dices.checkAndDispatch(store, {
        payload: {
          min: 2,
          value: 3,
        },
      })

      expect(store.dispatch).toHaveBeenCalledTimes(0)
    })

    it('should check a roll and do not dispatch anything (fail branch)', () => {
      const store = createStore({ players: [] })
      store.dispatch = jest.fn()

      dices.checkAndDispatch(store, {
        payload: {
          min: 2,
          value: 1,
        },
      })

      expect(store.dispatch).toHaveBeenCalledTimes(0)
    })

    it('should roll success because the player has the "experienced" skill', () => {
      const store = createStore({
        players: [
          {
            id: 'SoE',
            skills: [
              {
                type: 'experienced',
              },
            ],
          },
        ],
      })

      store.dispatch = jest.fn()

      dices.checkAndDispatch(store, {
        payload: {
          min: 2,
          // it should fail since the value < min but "experienced" give +1 to the value
          value: 1,
          playerId: 'SoE',
          actionOnSuccess: {
            type: 'sucess',
            payload: { some: 'informations' },
          },
          actionOnFail: {
            type: 'fail',
            payload: { some: 'informations (fail)' },
          },
        },
      })

      expect(store.dispatch).toHaveBeenCalledTimes(1)
      expect(store.dispatch).toHaveBeenCalledWith({
        type: 'sucess',
        payload: { some: 'informations' },
      })
    })
  })
})
