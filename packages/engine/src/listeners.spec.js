import createEngine, * as core from './core'
import * as cards from './cards'
import * as tiles from './tiles'
import * as dices from './dices'
import * as enemies from './enemies'
import * as game from './game'
import * as players from './players'
import * as seeds from './seeds'

jest.mock('./cards')
jest.mock('./tiles')
jest.mock('./enemies')
jest.mock('./dices')
jest.mock('./enemies')
jest.mock('./game')
jest.mock('./players')
jest.mock('./seeds')
core.saveAction = jest.fn()

describe('listeners', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('@players>init', () => {
    it('should call players.init and players.findPossibilities', () => {
      const engine = createEngine({})
      engine.dispatch('@players>init')
      expect(players.init).toHaveBeenCalledTimes(1)
      expect(players.findPossibilities).toHaveBeenCalledTimes(1)
    })
  })

  describe('@players>damage', () => {
    it('should call player.damage', () => {
      const engine = createEngine({
        playerActions: {
          excess: false,
        },
      })

      engine.dispatch('@players>damage')

      expect(players.damage).toHaveBeenCalledTimes(1)
      expect(players.pass).toHaveBeenCalledTimes(0)
    })

    it('should call player.pass on excess', () => {
      const engine = createEngine({
        playerActions: {
          excess: true,
        },
      })

      engine.dispatch('@players>damage')

      expect(players.damage).toHaveBeenCalledTimes(1)
      expect(players.pass).toHaveBeenCalledTimes(1)
    })
  })

  describe('@players>pass', () => {
    it('should call players.pass and players.findPossibilities', () => {
      const engine = createEngine({})

      engine.dispatch('@players>pass')

      expect(players.pass).toHaveBeenCalledTimes(1)
      expect(players.findPossibilities).toHaveBeenCalledTimes(1)
    })
  })

  describe('@players>move', () => {
    it('should call players.move and players.findPossibilities', () => {
      const engine = createEngine({
        playerActions: {
          excess: false,
        },
      })

      engine.dispatch('@players>move')

      expect(players.move).toHaveBeenCalledTimes(1)
      expect(players.findPossibilities).toHaveBeenCalledTimes(1)
      expect(players.pass).toHaveBeenCalledTimes(0)
    })

    it('should call player.pass on excess', () => {
      const engine = createEngine({
        playerActions: {
          excess: true,
        },
      })

      engine.dispatch('@players>move')

      expect(players.move).toHaveBeenCalledTimes(1)
      expect(players.pass).toHaveBeenCalledTimes(1)
      // once after move
      // once after pass
      expect(players.findPossibilities).toHaveBeenCalledTimes(2)
    })
  })

  describe('@players>explore', () => {
    it('should call players.explore', () => {
      const engine = createEngine({})

      engine.dispatch('@players>explore')

      expect(players.explore).toHaveBeenCalledTimes(1)
    })
  })

  describe('@players>run', () => {
    it('should call players.move and players.findPossibilities', () => {
      const engine = createEngine({
        playerActions: {
          excess: false,
        },
      })

      engine.dispatch('@players>run')

      expect(players.move).toHaveBeenCalledTimes(1)
      expect(players.findPossibilities).toHaveBeenCalledTimes(1)
      expect(players.pass).toHaveBeenCalledTimes(0)
    })

    it('should call player.pass on excess', () => {
      const engine = createEngine({
        playerActions: {
          excess: true,
        },
      })

      engine.dispatch('@players>run')

      expect(players.move).toHaveBeenCalledTimes(1)
      expect(players.pass).toHaveBeenCalledTimes(1)
      // once after move
      // once after pass
      expect(players.findPossibilities).toHaveBeenCalledTimes(2)
    })
  })

  describe('@players>look', () => {
    it('should call players.look', () => {
      const engine = createEngine({})

      engine.dispatch('@players>look')

      expect(players.look).toHaveBeenCalledTimes(1)
    })
  })

  describe('@players>rotate', () => {
    it('should call players.rotate', () => {
      const engine = createEngine({})

      engine.dispatch('@players>rotate')

      expect(players.rotate).toHaveBeenCalledTimes(1)
    })
  })

  describe('@players>drop', () => {
    it('should call players.drop and players.findPossibilities', () => {
      const engine = createEngine({
        playerActions: {
          excess: false,
        },
      })

      engine.dispatch('@players>drop')

      expect(players.drop).toHaveBeenCalledTimes(1)
      expect(players.findPossibilities).toHaveBeenCalledTimes(1)
      expect(players.pass).toHaveBeenCalledTimes(0)
    })

    it('should call player.pass on excess', () => {
      const engine = createEngine({
        playerActions: {
          excess: true,
        },
      })
      engine.dispatch('@players>drop')

      expect(players.drop).toHaveBeenCalledTimes(1)
      expect(players.pass).toHaveBeenCalledTimes(1)
      // once for drop, once for pas
      expect(players.findPossibilities).toHaveBeenCalledTimes(2)
    })
  })

  describe('@tiles>init', () => {
    it('should call tiles.init', () => {
      const engine = createEngine({})
      engine.dispatch('@tiles>init')
      expect(tiles.init).toHaveBeenCalledTimes(1)
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

  describe('@players>death', () => {
    it('should call game.checkLoose', () => {
      const engine = createEngine({})

      engine.dispatch('@players>death')

      expect(game.checkLoose).toHaveBeenCalledTimes(1)
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

    it('should call game.checkWin', () => {
      const engine = createEngine({})

      engine.dispatch('@turn>start')

      expect(game.checkWin).toHaveBeenCalledTimes(1)
    })
  })

  describe('@enemies>kill', () => {
    it('should call enemies.kill', () => {
      const engine = createEngine({})

      engine.dispatch('@enemies>kill')

      expect(enemies.kill).toHaveBeenCalledTimes(1)
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

  describe('@players>heal', () => {
    it('should call players.heal', () => {
      const engine = createEngine({
        playerActions: {
          excess: false,
        },
      })

      engine.dispatch('@players>heal')

      expect(players.heal).toHaveBeenCalledTimes(1)
      expect(players.pass).toHaveBeenCalledTimes(0)
    })

    it('should call players.pass on excess', () => {
      const engine = createEngine({
        playerActions: {
          excess: true,
        },
      })

      engine.dispatch('@players>heal')

      expect(players.heal).toHaveBeenCalledTimes(1)
      expect(players.pass).toHaveBeenCalledTimes(1)
    })
  })

  describe('@seeds>init', () => {
    it('should call seeds.init', () => {
      const engine = createEngine({})

      engine.dispatch('@seeds>init')

      expect(seeds.init).toHaveBeenCalledTimes(1)
    })
  })

  describe('@players>excess', () => {
    it('should call players.excess', () => {
      const engine = createEngine({})

      engine.dispatch('@players>excess')

      expect(players.excess).toHaveBeenCalledTimes(1)
    })
  })
})
