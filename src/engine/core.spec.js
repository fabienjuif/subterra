import createEngine, { initState, saveAction } from './core'

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

  describe('saveAction', () => {
    it('should save an action without payload', () => {
      const engine = createEngine({
        technical: { actions: [] },
      })

      engine.dispatch('action')
      expect(engine.getState().technical.actions).toEqual([{ type: 'action' }])
    })

    it('should save an action with its payload', () => {
      const engine = createEngine({
        technical: { actions: [] },
      })

      engine.dispatch({ type: 'action', payload: { core: 'test' } })
      expect(engine.getState().technical.actions).toEqual([
        { type: 'action', payload: { core: 'test' } },
      ])
    })

    it('should not save actions if the state does not have an array to store them', () => {
      const engine = createEngine({})

      engine.dispatch('action')

      expect(engine.getState()).toEqual({})
    })
  })
})
