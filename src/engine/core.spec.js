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
        data: { actions: [] },
      })

      saveAction(engine, 'action')
      expect(engine.getState().data.actions).toEqual(['action'])
    })
    it('should save an action with his payload', () => {
      const engine = createEngine({
        data: { actions: [] },
      })

      saveAction(engine, { type: 'action', payload: { core: 'test' } })
      expect(engine.getState().data.actions).toEqual([
        { type: 'action', payload: { core: 'test' } },
      ])
    })
  })
})
