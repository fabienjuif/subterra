import createEngine, * as core from './core'
import * as players from './players'
import * as cards from './cards'

jest.mock('./players')
jest.mock('./cards')
core.saveAction = jest.fn()

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
})
