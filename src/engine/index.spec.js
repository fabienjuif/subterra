import { createEngine } from './index'
import cards from '../utils/cards'

describe('engine without mock', () => {
  it('should be replayable', () => {
    const play = () => {
      const engine = createEngine()

      engine.dispatch({
        type: '@cards>init',
        payload: [cards[2], cards[3], cards[1], cards[0]],
      })
      engine.dispatch('@players>init')
      engine.dispatch('@cards>pick')
      // TODO: here play a fake game

      return engine
    }

    // 3 times should be enough
    const firstState = play().getState()
    expect(play().getState()).toEqual(firstState)
    expect(play().getState()).toEqual(firstState)
  })
})
