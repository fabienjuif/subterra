import createEngine, { initState } from './core'

describe('core', () => {
  describe('reset', () => {
    it('should initialize the state with the given data', () => {
      const engine = createEngine({})

      expect(engine.getState()).toEqual({})
      engine.setState({ new: 'state' })
      expect(engine.getState()).toEqual({ new: 'state' })

      engine.reset()

      expect(engine.getState()).toEqual({})
    })

    it('should initialize the state with default engine data', () => {
      const engine = createEngine()

      expect(engine.getState()).toEqual(initState())
      engine.setState({ new: 'state' })
      expect(engine.getState()).toEqual({ new: 'state' })

      engine.reset()

      expect(engine.getState()).toEqual(initState())
    })
  })
})
