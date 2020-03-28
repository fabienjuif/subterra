import createEngine, * as core from './core'
import * as cards from './cards'
import * as dices from './dices'
import * as enemies from './enemies'
import * as players from './players'

jest.mock('./cards')
jest.mock('./dices')
jest.mock('./enemies')
jest.mock('./players')
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
    it('should call player.damage', () => {
      const engine = createEngine({})

      engine.dispatch('@players>damage')

      expect(players.damage).toHaveBeenCalledTimes(1)
    })
  })

  describe('@players>pass', () => {
    it('should call players.pass', () => {
      const engine = createEngine({})

      engine.dispatch('@players>pass')

      expect(players.pass).toHaveBeenCalledTimes(1)
    })
  })

  describe('@players>move', () => {
    it('should call players.move', () => {
      const engine = createEngine({})

      engine.dispatch('@players>move')

      expect(players.move).toHaveBeenCalledTimes(1)
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

  describe('@cards>enemy', () => {
    it('should call cards.processMarkerCard', () => {
      const engine = createEngine({})

      engine.dispatch('@cards>enemy')

      expect(cards.processMarkerCard).toHaveBeenCalledTimes(1)
    })
  })

  describe('@cards>end', () => {
    it('should call cards.end', () => {
      const engine = createEngine({})

      engine.dispatch('@cards>end')

      expect(cards.end).toHaveBeenCalledTimes(1)
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

      engine.dispatch('@dices>rolled')

      expect(dices.checkAndDispatch).toHaveBeenCalledTimes(1)
    })
  })

  describe('@cards>landslide', () => {
    it('should call cards.landslide', () => {
      const engine = createEngine({})

      engine.dispatch('@cards>landslide')

      expect(cards.landslide).toHaveBeenCalledTimes(1)
    })
  })

  describe('@turn>start', () => {
    it('should dispatch @cards>pick', () => {
      const engine = createEngine({})
      engine.dispatch = jest.fn(engine.dispatch)

      engine.dispatch('@turn>start')

      expect(engine.dispatch).toHaveBeenCalledWith('@cards>pick')
    })

    it('should dispatch @enemies>process', () => {
      const engine = createEngine({})
      engine.dispatch = jest.fn(engine.dispatch)

      engine.dispatch('@turn>start')

      expect(engine.dispatch).toHaveBeenCalledWith('@enemies>process')
    })
  })

  describe('@enemies>process', () => {
    it('should call enemies.process', () => {
      const engine = createEngine({})

      engine.dispatch('@enemies>process')

      expect(enemies.process).toHaveBeenCalledTimes(1)
    })
  })

  describe('@enemies>move', () => {
    it('should call enemies.move', () => {
      const engine = createEngine({})

      engine.dispatch('@enemies>move')

      expect(enemies.move).toHaveBeenCalledTimes(1)
    })
  })
})
