import createEngine from './index'
import * as players from './players'
import * as logs from './logs'

jest.mock('./players')
jest.mock('./logs')

describe('engine', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('@players>damage', () => {
    it('should call player.damage', () => {
      const engine = createEngine({})

      engine.dispatch({
        type: '@players>damage',
        payload: {
          damageType: 'gaz',
          damage: 2,
          player: {
            name: 'Hatsu',
          },
        },
      })

      expect(players.damage).toHaveBeenCalledTimes(1)
      expect(logs.push).toHaveBeenCalledTimes(1)
      expect(logs.push.mock.calls[0][1]).toEqual({
        payload: {
          code: 'hit_gaz',
          player: {
            name: 'Hatsu',
          },
        },
      })
    })

    it('should call player.damage', () => {
      const engine = createEngine({})

      engine.dispatch({
        type: '@players>damage',
        payload: {
          damageType: 'gaz',
          damage: 2,
          player: {
            name: 'Hatsu',
          },
        },
      })

      expect(players.damage).toHaveBeenCalledTimes(1)
      expect(logs.push).toHaveBeenCalledTimes(1)
      expect(logs.push.mock.calls[0][1]).toEqual({
        payload: {
          code: 'hit_gaz',
          player: {
            name: 'Hatsu',
          },
        },
      })
    })
  })
})
