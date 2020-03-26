import createEngine, * as core from './core'
import * as players from './players'
import * as cards from './cards'
import * as dices from './dices'

jest.mock('./players')
jest.mock('./cards')
jest.mock('./dices')
core.saveAction = jest.fn()

describe('listeners', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('@players>init', () => {
    it('should call player.init', () => {
      const engine = createEngine({})
      engine.dispatch('@players>init')
      expect(players.init).toHaveBeenCalledTimes(1)
    })
  })

  describe('@players>damage', () => {
    it('should call player.damage and players.checkDeathFromDamage', () => {
      const engine = createEngine({})

      engine.dispatch({
        type: '@players>damage',
        payload: {
          damageType: 'gaz',
          player: {
            name: 'Hatsu',
          },
        },
      })

      expect(players.damage).toHaveBeenCalledTimes(1)
      expect(players.checkDeathFromDamage).toHaveBeenCalledTimes(1)
    })
  })

  describe('@players>pass', () => {
    it('should call player.pass', () => {
      const engine = createEngine({})

      engine.dispatch('@players>pass')

      expect(players.pass).toHaveBeenCalledTimes(1)
    })
  })

  describe('@cards>init', () => {
    it('should call cards.init', () => {
      const engine = createEngine({})
      engine.dispatch('@cards>init')
      expect(cards.init).toHaveBeenCalledTimes(1)
    })
  })

  describe('@cards>pick', () => {
    it('should call cards.pick', () => {
      const engine = createEngine({})

      engine.dispatch('@cards>pick')

      expect(cards.pick).toHaveBeenCalledTimes(1)
    })
  })

  describe('@cards>shake', () => {
    it('should call cards.shake', () => {
      const engine = createEngine({})

      engine.dispatch('@cards>shake')

      expect(cards.shake).toHaveBeenCalledTimes(1)
    })
  })

  describe('@cards>water', () => {
    it('should call cards.processMarkerCard', () => {
      const engine = createEngine({})

      engine.dispatch('@cards>water')

      expect(cards.processMarkerCard).toHaveBeenCalledTimes(1)
    })
  })

  describe('@cards>gaz', () => {
    it('should call cards.processMarkerCard', () => {
      const engine = createEngine({})

      engine.dispatch('@cards>gaz')

      expect(cards.processMarkerCard).toHaveBeenCalledTimes(1)
    })
  })

  describe('@dices>init', () => {
    it('should call dices.init', () => {
      const engine = createEngine({})

      engine.dispatch('@dices>init')

      expect(dices.init).toHaveBeenCalledTimes(1)
    })
  })

  describe('@dices>roll', () => {
    it('should call dices.roll', () => {
      const engine = createEngine({})

      engine.dispatch('@dices>roll')

      expect(dices.roll).toHaveBeenCalledTimes(1)
    })
  })

  describe('@dices>rolled', () => {
    it('should call dices.checkAndDispatch', () => {
      const engine = createEngine({})

      engine.dispatch({ type: '@dices>rolled', payload: { min: 2 } })

      expect(dices.checkAndDispatch).toHaveBeenCalledTimes(1)
    })

    it('should NOT call dices.checkAndDispatch', () => {
      const engine = createEngine({})

      engine.dispatch({
        type: '@dices>rolled',
        payload: { something: 'but not min' },
      })

      expect(dices.checkAndDispatch).toHaveBeenCalledTimes(0)
    })

    it('should call cards.landslide', () => {
      const engine = createEngine({})

      engine.dispatch({
        type: '@dices>roll',
        payload: {
          what: '@cards>landslide',
        },
      })

      expect(cards.landslide).toHaveBeenCalledTimes(0)
    })
  })
})
