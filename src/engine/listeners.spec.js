import createEngine, { saveAction } from './core'
import * as players from './players'
import * as cards from './cards'

jest.mock('./players')
jest.mock('./cards')
jest.fn(saveAction)

describe('listeners', () => {
  beforeEach(() => {
    jest.clearAllMocks()
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

  describe('@cards>pick', () => {
    it('should call cards.pick and players.checkDamageFromCard', () => {
      const engine = createEngine({})

      engine.dispatch('@cards>pick')

      expect(cards.pick).toHaveBeenCalledTimes(1)
      expect(players.checkDamageFromCard).toHaveBeenCalledTimes(1)
    })
  })

  describe('all actions', () => {
    it('should call core.saveAction', () => {
      const engine = createEngine({})

      engine.dispatch('@players>damage')
      engine.dispatch('@cards>pick')

      expect(saveAction).toHaveBeenCalledTimes(2)
    })
  })
})
