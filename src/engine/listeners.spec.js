import createEngine from './core'
import * as players from './players'
import * as logs from './logs'
import * as cards from './cards'
import * as core from './core'

jest.mock('./players')
jest.mock('./logs')
jest.mock('./cards')

describe('listeners', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('@players>damage', () => {
    it('should call player.damage and logs.push', () => {
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
      expect(logs.push).toHaveBeenCalledTimes(1)
      expect(logs.push.mock.calls[0][1]).toEqual({
        payload: { code: 'hit_gaz', player: { name: 'Hatsu' } },
      })
    })
  })

  describe('@core>reset', () => {
    it('should call core.reset', () => {
      const engine = createEngine({})

      engine.dispatch('@core>reset')

      expect(core.reset).toHaveBeenCalledTimes(1)
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
