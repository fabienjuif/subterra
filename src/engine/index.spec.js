import { createPatch } from 'diff'
import { createEngine } from './index'
import cards, {
  EndCard,
  GazCard,
  WaterCard,
  ShakeCard,
  HorrorCard,
} from '../utils/cards'

expect.addSnapshotSerializer({
  test: () => true,
  print: (str) => str,
})

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

  it('should connect behaviours to actions', () => {
    const engine = createEngine()

    const dispatchAndSnap = (action) => {
      const previousState = engine.getState()
      engine.dispatch(action)
      const afterState = engine.getState()

      expect(
        createPatch(
          typeof action === 'object' ? action.type : action,
          JSON.stringify(previousState, null, 2),
          JSON.stringify(afterState, null, 2),
        ),
      ).toMatchSnapshot()
    }

    dispatchAndSnap({
      type: '@cards>init',
      payload: [ShakeCard, GazCard, WaterCard, HorrorCard, EndCard],
    })
    dispatchAndSnap('@players>init')
    dispatchAndSnap({ type: '@dices>init', payload: [2, 3, 4, 5] })
    dispatchAndSnap('@cards>pick')

    // TODO: complete this after we can discover and move (or explore)
  })
})
