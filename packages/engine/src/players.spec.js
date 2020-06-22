import createStore from '@myrtille/mutate'
import * as players from './players'
import { players as actions, roll } from './actions'

describe('players', () => {
  describe('pass', () => {
    it('should pass to the next player (and not pick a card)', () => {
      const store = createStore({
        players: [
          {
            id: 'SoE',
            first: true,
            current: true,
          },
          {
            id: 'Hatsu',
          },
        ],
      })
      store.dispatch = jest.fn()
      players.pass(store, {})
      expect(store.dispatch).toHaveBeenCalledTimes(0)
      expect(store.getState()).toEqual({
        players: [
          {
            id: 'SoE',
            first: true,
            current: false,
          },
          {
            id: 'Hatsu',
            current: true,
          },
        ],
      })
    })

    it('should give action point back, mark the first player and start a new turn', () => {
      // first case the last player is the last in the array
      let store = createStore({
        players: [
          {
            id: 'SoE',
            first: true,
            actionPoints: 0,
          },
          {
            id: 'Hatsu',
            actionPoints: 1,
          },
          {
            id: 'Tripa',
            current: true,
            actionPoints: 2,
          },
        ],
      })
      store.dispatch = jest.fn()
      players.pass(store, {})
      expect(store.getState()).toEqual({
        players: [
          {
            id: 'SoE',
            first: false,
            actionPoints: 2,
          },
          {
            id: 'Hatsu',
            first: true,
            current: true,
            actionPoints: 2,
          },
          {
            id: 'Tripa',
            current: false,
            actionPoints: 2,
          },
        ],
      })
      expect(store.dispatch).toHaveBeenCalledTimes(1)
      expect(store.dispatch).toHaveBeenCalledWith('@turn>start')

      // second case the last player is NOT the last in the array
      store = createStore({
        players: [
          {
            id: 'SoE',
            actionPoints: 0,
          },
          {
            id: 'Hatsu',
            current: true,
            actionPoints: 1,
          },
          {
            id: 'Tripa',
            first: true,
            actionPoints: 2,
          },
        ],
      })
      store.dispatch = jest.fn()
      players.pass(store, {})
      expect(store.getState()).toEqual({
        players: [
          {
            id: 'SoE',
            first: true,
            current: true,
            actionPoints: 2,
          },
          {
            id: 'Hatsu',
            current: false,
            actionPoints: 2,
          },
          {
            id: 'Tripa',
            first: false,
            actionPoints: 2,
          },
        ],
      })
      expect(store.dispatch).toHaveBeenCalledTimes(1)
      expect(store.dispatch).toHaveBeenCalledWith('@turn>start')
    })
  })

  describe('move', () => {
    it('should move player when the action is a known possibilities', () => {
      const action = actions.move({ id: 'Hatsu' }, { x: 1, y: -1 })
      const store = createStore({
        players: [
          { id: 'Hatsu', actionPoints: 1, x: 0, y: 0 },
          { id: 'SoE', actionPoints: 2, x: 0, y: 0 },
        ],
        playerActions: {
          possibilities: [action],
        },
      })

      players.move(store, action)

      expect(store.getState().players).toEqual([
        { id: 'Hatsu', actionPoints: 0, x: 1, y: -1 },
        { id: 'SoE', actionPoints: 2, x: 0, y: 0 },
      ])
    })

    it('should not move player when the action is not a known possibilities', () => {
      const action = {
        type: '@players>move',
        payload: { playerid: 'Hatsu', cost: 1, x: 1, y: -1 },
      }
      const store = createStore({
        players: [
          { id: 'Hatsu', actionPoints: 1, x: 0, y: 0 },
          { id: 'SoE', actionPoints: 2, x: 0, y: 0 },
        ],
        playerActions: { possibilities: [] },
      })

      players.move(store, action)

      expect(store.getState().players).toEqual([
        { id: 'Hatsu', actionPoints: 1, x: 0, y: 0 },
        { id: 'SoE', actionPoints: 2, x: 0, y: 0 },
      ])
    })
  })

  describe('look', () => {
    it('should set next tile at the expected coordinates as playerActions.tile', () => {
      const action = actions.look({ id: 'Hatsu' }, { x: 1, y: 0 })
      const store = createStore({
        players: [{ id: 'Hatsu', actionPoints: 1, x: 0, y: 0 }],
        tiles: {
          remaining: 3,
          deck: [
            { tile: { right: true, bottom: true, left: true }, remaining: 2 },
            { tile: { top: true }, remaining: 1 },
          ],
        },
        seeds: {
          tilesNext: 'nextSeed5',
        },
        grid: [{ x: 0, y: 0, right: true }],
        playerActions: {
          tile: undefined,
          possibilities: [action],
        },
      })

      players.look(store, action)

      expect(store.getState()).toEqual({
        players: [{ id: 'Hatsu', actionPoints: 0, x: 0, y: 0 }],
        tiles: {
          remaining: 2,
          deck: [
            { tile: { right: true, bottom: true, left: true }, remaining: 1 },
            { tile: { top: true }, remaining: 1 },
          ],
        },
        seeds: {
          tilesNext: 'nextSeed5@@0.1931634125608288',
        },
        grid: [{ x: 0, y: 0, right: true }],
        playerActions: {
          tile: {
            x: 1,
            y: 0,
            right: true,
            bottom: true,
            left: true,
            status: [],
            rotation: 0,
          },
          possibilities: [
            actions.rotate({ id: 'Hatsu' }, 90),
            actions.drop({ id: 'Hatsu' }),
          ],
        },
      })
    })

    it('should remove tile from deck when there is no more remaining', () => {
      const action = actions.look({ id: 'Hatsu' }, { x: 1, y: 0 })
      const store = createStore({
        players: [{ id: 'Hatsu', actionPoints: 1, x: 0, y: 0 }],
        tiles: {
          remaining: 2,
          deck: [
            { tile: { right: true, bottom: true, left: true }, remaining: 1 },
            { tile: { top: true }, remaining: 1 },
          ],
        },
        seeds: {
          tilesNext: 'nextSeed2',
        },
        grid: [{ x: 0, y: 0, right: true }],
        playerActions: {
          tile: undefined,
          possibilities: [action],
        },
      })

      players.look(store, action)

      expect(store.getState()).toEqual({
        players: [{ id: 'Hatsu', actionPoints: 0, x: 0, y: 0 }],
        tiles: {
          remaining: 1,
          deck: [
            { tile: { right: true, bottom: true, left: true }, remaining: 1 },
          ],
        },
        seeds: {
          tilesNext: 'nextSeed2@@0.9193660108935956',
        },
        grid: [{ x: 0, y: 0, right: true }],
        playerActions: {
          tile: {
            x: 1,
            y: 0,
            top: true,
            status: [],
            rotation: 0,
          },
          possibilities: [actions.rotate({ id: 'Hatsu' }, 90)],
        },
      })
    })

    it('should draw a final card when the deck is empty', () => {
      const action = actions.look({ id: 'Hatsu' }, { x: 1, y: 0 })
      const store = createStore({
        players: [{ id: 'Hatsu', actionPoints: 1, x: 0, y: 0 }],
        tiles: {
          remaining: 0,
          deck: [
            { tile: { right: true, bottom: true, left: true }, remaining: 1 },
            { tile: { top: true }, remaining: 1 },
          ],
        },
        seeds: {
          tilesNext: 'nextSeed',
        },
        grid: [{ x: 0, y: 0, right: true }],
        playerActions: {
          tile: undefined,
          possibilities: [action],
        },
      })

      players.look(store, action)

      expect(store.getState()).toEqual({
        players: [{ id: 'Hatsu', actionPoints: 0, x: 0, y: 0 }],
        tiles: {
          remaining: 0,
          deck: [
            { tile: { right: true, bottom: true, left: true }, remaining: 1 },
            { tile: { top: true }, remaining: 1 },
          ],
        },
        seeds: {
          tilesNext: 'nextSeed',
        },
        grid: [{ x: 0, y: 0, right: true }],
        playerActions: {
          tile: {
            id: 'XuLC14NjlAStWpwJCoSxf',
            name: 'final tile',
            top: true,
            type: 'end',
            x: 1,
            y: 0,
            status: [],
            rotation: 0,
          },
          possibilities: [actions.rotate({ id: 'Hatsu' }, 90)],
        },
      })
    })

    it('should not set a drop possibilities when we can move from the current tile to the looked tile', () => {
      const action = actions.look({ id: 'Hatsu' }, { x: 1, y: 0 })
      const store = createStore({
        players: [{ id: 'Hatsu', actionPoints: 1, x: 0, y: 0 }],
        tiles: {
          remaining: 2,
          deck: [
            { tile: { right: true, bottom: true, left: true }, remaining: 1 },
          ],
        },
        seeds: {
          tilesNext: 'nextSeed2',
        },
        grid: [{ x: 0, y: 0 }],
        playerActions: {
          tile: undefined,
          possibilities: [action],
        },
      })

      players.look(store, action)

      expect(store.getState()).toEqual({
        players: [{ id: 'Hatsu', actionPoints: 0, x: 0, y: 0 }],
        grid: [{ x: 0, y: 0 }],
        tiles: {
          remaining: 1,
          deck: [],
        },
        seeds: {
          tilesNext: 'nextSeed2@@0.9193660108935956',
        },
        playerActions: {
          tile: {
            x: 1,
            y: 0,
            right: true,
            bottom: true,
            left: true,
            status: [],
            rotation: 0,
          },
          possibilities: [actions.rotate({ id: 'Hatsu' }, 90)],
        },
      })
    })

    it('should not set any tile when the action is not a known possibilities', () => {
      const store = createStore({
        players: [{ id: 'Hatsu', actionPoints: 1, x: 0, y: 0 }],
        grid: [{ x: 0, y: 0 }],
        playerActions: {
          tile: undefined,
          possibilities: [],
        },
      })

      players.look(store, actions.look({ id: 'Hatsu' }, { x: 1, y: 0 }))

      expect(store.getState()).toEqual({
        players: [{ id: 'Hatsu', actionPoints: 1, x: 0, y: 0 }],
        grid: [{ x: 0, y: 0 }],
        playerActions: {
          tile: undefined,
          possibilities: [],
        },
      })
    })
  })

  describe('rotate', () => {
    it('should rotate the playerAction.tile to the expected rotation', () => {
      const action = actions.rotate({ id: 'Hatsu' }, 90)
      const store = createStore({
        players: [{ id: 'Hatsu', actionPoints: 1, x: 0, y: 0 }],
        grid: [{ x: 0, y: 0, right: true }],
        playerActions: {
          tile: { x: 1, y: 0, bottom: true, rotation: 0 },
          possibilities: [action],
        },
      })

      players.rotate(store, action)

      expect(store.getState()).toEqual({
        players: [{ id: 'Hatsu', actionPoints: 1, x: 0, y: 0 }],
        grid: [{ x: 0, y: 0, right: true }],
        playerActions: {
          tile: { x: 1, y: 0, bottom: true, rotation: 90 },
          possibilities: [
            actions.rotate({ id: 'Hatsu' }, 180),
            actions.drop({ id: 'Hatsu' }),
          ],
        },
      })
    })

    it('should not set a drop possibilities when we can move from the current tile to the rotated tile', () => {
      const action = actions.rotate({ id: 'Hatsu' }, 270)
      const store = createStore({
        players: [{ id: 'Hatsu', actionPoints: 1, x: 0, y: 0 }],
        grid: [{ x: 0, y: 0, right: true }],
        playerActions: {
          tile: { x: 1, y: 0, bottom: true, rotation: 0 },
          possibilities: [action],
        },
      })

      players.rotate(store, action)

      expect(store.getState()).toEqual({
        players: [{ id: 'Hatsu', actionPoints: 1, x: 0, y: 0 }],
        grid: [{ x: 0, y: 0, right: true }],
        playerActions: {
          tile: { x: 1, y: 0, bottom: true, rotation: 270 },
          possibilities: [actions.rotate({ id: 'Hatsu' }, 0)],
        },
      })
    })

    it('should not rotate the playerAction.tile when the action is not a known possibilities', () => {
      const store = createStore({
        players: [{ id: 'Hatsu', actionPoints: 1, x: 0, y: 0 }],
        grid: [{ x: 0, y: 0, right: true }],
        playerActions: {
          tile: { x: 1, y: 0, bottom: true, rotation: 0 },
          possibilities: [],
        },
      })

      players.rotate(store, actions.rotate({ id: 'Hatsu' }, 90))

      expect(store.getState()).toEqual({
        players: [{ id: 'Hatsu', actionPoints: 1, x: 0, y: 0 }],
        grid: [{ x: 0, y: 0, right: true }],
        playerActions: {
          tile: { x: 1, y: 0, bottom: true, rotation: 0 },
          possibilities: [],
        },
      })
    })
  })

  describe('drop', () => {
    it('should drop playerActions.tile in the grid', () => {
      const action = actions.drop({ id: 'Hatsu' })
      const store = createStore({
        players: [{ id: 'Hatsu', actionPoints: 1, x: 0, y: 0 }],
        grid: [{ x: 0, y: 0 }],
        playerActions: {
          tile: { x: 1, y: 0 },
          possibilities: [action],
        },
      })

      players.drop(store, action)

      expect(store.getState()).toEqual({
        players: [{ id: 'Hatsu', actionPoints: 1, x: 0, y: 0 }],
        grid: [
          { x: 0, y: 0 },
          { x: 1, y: 0 },
        ],
        playerActions: {
          tile: undefined,
          possibilities: [actions.drop({ id: 'Hatsu' })],
        },
      })
    })

    it('should not drop playerActions.tile when the action is not a known possibilities', () => {
      const store = createStore({
        players: [{ id: 'Hatsu', actionPoints: 1, x: 0, y: 0 }],
        grid: [{ x: 0, y: 0 }],
        playerActions: {
          tile: { x: 1, y: 0 },
          possibilities: [],
        },
      })

      players.drop(store, actions.drop({ id: 'Hatsu' }))

      expect(store.getState()).toEqual({
        players: [{ id: 'Hatsu', actionPoints: 1, x: 0, y: 0 }],
        grid: [{ x: 0, y: 0 }],
        playerActions: {
          tile: { x: 1, y: 0 },
          possibilities: [],
        },
      })
    })
  })

  describe('damage', () => {
    it('should damage player', () => {
      const store = createStore({
        players: [
          {
            id: 'SoE',
            health: 10,
            skills: [],
          },
          {
            id: 'Hatsu',
            health: 5,
            skills: [],
          },
        ],
      })

      store.dispatch = jest.fn()

      players.damage(store, actions.damage({ id: 'Hatsu' }, 2, {}))

      expect(store.getState()).toEqual({
        players: [
          {
            id: 'SoE',
            health: 10,
            skills: [],
          },
          {
            id: 'Hatsu',
            health: 3,
            skills: [],
          },
        ],
      })
      expect(store.dispatch).toHaveBeenCalledTimes(0)
    })

    it('should kill player if it has no health remaining', () => {
      const store = createStore({
        players: [
          {
            id: 'SoE',
            health: 1,
            skills: [],
          },
        ],
      })
      store.dispatch = jest.fn()

      players.damage(store, actions.damage({ id: 'SoE' }, 2, {}))

      expect(store.getState().players).toEqual([
        {
          id: 'SoE',
          health: 0,
          skills: [],
        },
      ])
      expect(store.dispatch).toHaveBeenCalledTimes(1)
      expect(store.dispatch).toHaveBeenCalledWith(actions.death({ id: 'SoE' }))
    })

    it('should not damage player if it has a protect player on same tile', () => {
      const store = createStore({
        players: [
          {
            id: 'Tripa',
            health: 2,
            skills: [],
            x: 1,
            y: 2,
          },
          {
            id: 'SoE',
            health: 3,
            skills: [{ type: 'protect' }],
            x: 1,
            y: 2,
          },
        ],
      })
      store.dispatch = jest.fn()

      players.damage(store, actions.damage({ id: 'Tripa' }, 1, {}))

      expect(store.getState()).toEqual({
        players: [
          {
            id: 'Tripa',
            health: 2,
            skills: [],
            x: 1,
            y: 2,
          },
          {
            id: 'SoE',
            health: 3,
            skills: [{ type: 'protect' }],
            x: 1,
            y: 2,
          },
        ],
      })
      expect(store.dispatch).toHaveBeenCalledWith({
        type: '@players>protected',
        payload: {
          playerId: 'Tripa',
          protectedBy: 'SoE',
        },
      })
    })

    it('should not prevent player from taking damage player because the protect player is dead', () => {
      const store = createStore({
        players: [
          {
            id: 'Tripa',
            health: 2,
            skills: [],
            x: 1,
            y: 2,
          },
          {
            id: 'SoE',
            health: 0,
            skills: [{ type: 'protect' }],
            x: 1,
            y: 2,
          },
        ],
      })
      store.dispatch = jest.fn()

      players.damage(store, actions.damage({ id: 'Tripa' }, 1, {}))

      expect(store.getState()).toEqual({
        players: [
          {
            id: 'Tripa',
            health: 1,
            skills: [],
            x: 1,
            y: 2,
          },
          {
            id: 'SoE',
            health: 0,
            skills: [{ type: 'protect' }],
            x: 1,
            y: 2,
          },
        ],
      })
      expect(store.dispatch).not.toHaveBeenCalledWith(
        expect.objectContaining({
          type: '@players>protected',
        }),
      )
    })

    it('should damage player even if he has protect skill', () => {
      const store = createStore({
        players: [
          {
            id: 'Tripa',
            health: 2,
            skills: [{ type: 'protect' }],
            x: 1,
            y: 2,
          },
          {
            id: 'SoE',
            health: 2,
            skills: [],
            x: 1,
            y: 2,
          },
        ],
      })
      store.dispatch = jest.fn()

      players.damage(store, actions.damage({ id: 'Tripa' }, 1, {}))

      expect(store.getState()).toEqual({
        players: [
          {
            id: 'Tripa',
            health: 1,
            skills: [{ type: 'protect' }],
            x: 1,
            y: 2,
          },
          {
            id: 'SoE',
            health: 2,
            skills: [],
            x: 1,
            y: 2,
          },
        ],
      })
      expect(store.dispatch).not.toHaveBeenCalledWith(
        expect.objectContaining({
          type: '@players>protected',
        }),
      )
    })
  })

  describe('init', () => {
    it('should init players', () => {
      const store = createStore({})

      players.init(store, {
        payload: [
          { type: 'explorer', name: 'Sutat' },
          { type: 'chef', name: 'Tripa' },
          { type: 'miner', name: 'SoE' },
        ],
      })

      expect(store.getState()).toEqual({
        players: [
          {
            x: 0,
            y: 0,
            id: 'explorer',
            type: 'explorer',
            name: 'Sutat',
            actionPoints: 2,
            current: true,
            first: true,
          },
          {
            x: 0,
            y: 0,
            id: 'chef',
            type: 'chef',
            name: 'Tripa',
            actionPoints: 2,
          },
          {
            x: 0,
            y: 0,
            id: 'miner',
            type: 'miner',
            name: 'SoE',
            actionPoints: 2,
          },
        ],
      })
    })
  })

  describe('findPossibilities', () => {
    it('should find a move possibilities when the path to the next tile is open', () => {
      const store = createStore({
        players: [
          {
            id: 'Hatsu',
            x: 0,
            y: 0,
            health: 1,
            actionPoints: 1,
            current: true,
            skills: [],
            archetype: {
              health: 1,
            },
          },
        ],
        grid: [
          { x: 0, y: 0, right: true },
          { x: 1, y: 0, left: true },
        ],
        playerActions: {
          possibilities: [],
        },
      })

      players.findPossibilities(store, {})

      expect(store.getState().playerActions.possibilities).toEqual([
        actions.move({ id: 'Hatsu' }, { x: 1, y: 0 }),
      ])
    })

    it('should not find any possibilities when the player has no action points nor excess', () => {
      const store = createStore({
        players: [
          {
            id: 'Hatsu',
            x: 0,
            y: 0,
            health: 1,
            actionPoints: -1,
            current: true,
            skills: [],
            archetype: {
              health: 1,
            },
          },
        ],
        grid: [
          { x: 0, y: 0, right: true },
          { x: 1, y: 0, left: true },
        ],
        playerActions: {
          possibilities: [{ previous: 'possibilities' }],
        },
      })

      players.findPossibilities(store, {})

      expect(store.getState().playerActions.possibilities).toEqual([])
    })

    it('should not find any possibilities when the player has no health', () => {
      const store = createStore({
        players: [
          {
            id: 'Hatsu',
            x: 0,
            y: 0,
            health: 0,
            actionPoints: 1,
            current: true,
            skills: [],
            archetype: {
              health: 1,
            },
          },
        ],
        grid: [
          { x: 0, y: 0, right: true },
          { x: 1, y: 0, left: true },
        ],
        playerActions: {
          possibilities: [],
        },
      })

      players.findPossibilities(store, {})

      expect(store.getState().playerActions.possibilities).toEqual([])
    })

    it('should not find a move possibilities when the path to the next tile is closed', () => {
      const store = createStore({
        players: [
          {
            id: 'Hatsu',
            x: 0,
            y: 0,
            health: 1,
            actionPoints: 1,
            current: true,
            skills: [],
            archetype: {
              health: 1,
            },
          },
        ],
        grid: [
          { x: 0, y: 0, right: true },
          { x: 1, y: 0 },
          { x: -1, y: 0, right: true },
        ],
        playerActions: {
          possibilities: [],
        },
      })

      players.findPossibilities(store, {})

      expect(store.getState().playerActions.possibilities).toEqual([])
    })

    it('should find a common heal possibilities', () => {
      const store = createStore({
        playerActions: {
          possibilities: [],
        },
        players: [
          // heal itself
          {
            id: 'SoE',
            current: true,
            x: 0,
            y: 0,
            skills: [],
            actionPoints: 2,
            health: 2,
            archetype: {
              health: 3,
            },
          },
          // heal an ally
          {
            id: 'Tripa',
            x: 0,
            y: 0,
            skills: [],
            health: 3,
            archetype: {
              health: 5,
            },
          },
          // do not heal a max health player
          {
            id: 'Hatsu',
            x: 0,
            y: 0,
            skills: [],
            health: 3,
            archetype: {
              health: 3,
            },
          },
          // do not heal a player that is not on same cell
          {
            id: 'Sutat',
            x: 1,
            y: 0,
            skills: [],
            health: 2,
            archetype: {
              health: 3,
            },
          },
        ],
        grid: [
          {
            x: 0,
            y: 0,
          },
        ],
      })

      players.findPossibilities(store, {})

      expect(store.getState().playerActions.possibilities).toEqual([
        actions.heal({ id: 'SoE' }),
        actions.heal({ id: 'Tripa' }),
      ])
    })

    it('should find skill "heal" possibilities', () => {
      const store = createStore({
        playerActions: {
          possibilities: [],
        },
        players: [
          // heal itself
          {
            id: 'SoE',
            actionPoints: 2,
            current: true,
            x: 0,
            y: 0,
            skills: [{ type: 'heal', cost: 1 }],
            health: 2,
            archetype: {
              health: 3,
            },
          },
          // heal an ally
          {
            id: 'Tripa',
            x: 0,
            y: 0,
            skills: [],
            health: 3,
            archetype: {
              health: 5,
            },
          },
          // do not heal a max health player
          {
            id: 'Hatsu',
            x: 0,
            y: 0,
            skills: [],
            health: 3,
            archetype: {
              health: 3,
            },
          },
          // do not heal a player that is not on same cell
          {
            id: 'Sutat',
            x: 1,
            y: 0,
            skills: [],
            health: 2,
            archetype: {
              health: 3,
            },
          },
        ],
        grid: [
          {
            x: 0,
            y: 0,
          },
        ],
      })

      players.findPossibilities(store, {})

      expect(store.getState().playerActions.possibilities).toEqual([
        actions.heal({ id: 'SoE' }), // can not use the skill "heal" on itself
        actions.heal({ id: 'Tripa' }, { cost: 1 }),
      ])
    })

    it('should excess on heal but not on move', () => {
      const store = createStore({
        playerActions: {
          possibilities: [],
        },
        players: [
          {
            id: 'SoE',
            actionPoints: 1,
            current: true,
            x: 0,
            y: 0,
            skills: [],
            health: 3,
            archetype: {
              health: 3,
            },
          },
          // heal an ally
          {
            id: 'Tripa',
            x: 0,
            y: 0,
            skills: [],
            health: 3,
            archetype: {
              health: 5,
            },
          },
        ],
        grid: [
          {
            x: 0,
            y: 0,
            right: true,
          },
          // move right
          {
            x: 1,
            y: 0,
            left: true,
          },
        ],
      })

      players.findPossibilities(store, {})

      expect(store.getState().playerActions.possibilities).toEqual([
        actions.excess(actions.heal({ id: 'Tripa' })),
        actions.move({ id: 'SoE' }, { x: 1, y: 0 }),
      ])
    })
  })

  describe('heal', () => {
    it('should not heal the player when the action is not a known possibilities', () => {
      const store = createStore({
        playerActions: {
          possibilities: [],
        },
        players: [
          {
            id: 'Hatsu',
            health: 2,
            actionPoints: 1,
            archetype: {
              health: 3,
            },
          },
          {
            id: 'SoE',
            health: 1,
            actionPoints: 1,
            archetype: {
              health: 3,
            },
          },
        ],
      })

      players.heal(store, actions.heal({ id: 'Hatsu' }, { cost: 1 }))

      expect(store.getState()).toEqual({
        playerActions: {
          possibilities: [],
        },
        players: [
          {
            id: 'Hatsu',
            health: 2,
            actionPoints: 1,
            archetype: {
              health: 3,
            },
          },
          {
            id: 'SoE',
            health: 1,
            actionPoints: 1,
            archetype: {
              health: 3,
            },
          },
        ],
      })
    })

    it('should heal the player', () => {
      const action = actions.heal({ id: 'Hatsu' }, { cost: 1 })
      const store = createStore({
        playerActions: {
          possibilities: [action],
        },
        players: [
          {
            id: 'Hatsu',
            health: 2,
            actionPoints: 1,
            archetype: {
              health: 3,
            },
          },
          {
            id: 'SoE',
            health: 1,
            actionPoints: 1,
            archetype: {
              health: 3,
            },
          },
        ],
      })

      players.heal(store, action)

      expect(store.getState()).toEqual({
        playerActions: {
          possibilities: [actions.heal({ id: 'Hatsu' }, { cost: 1 })],
        },
        players: [
          {
            id: 'Hatsu',
            health: 3,
            actionPoints: 0,
            archetype: {
              health: 3,
            },
          },
          {
            id: 'SoE',
            health: 1,
            actionPoints: 1,
            archetype: {
              health: 3,
            },
          },
        ],
      })
    })

    it('should not overheal a player', () => {
      const action = actions.heal({ id: 'Hatsu' }, { cost: 1 })
      const store = createStore({
        playerActions: {
          possibilities: [action],
        },
        players: [
          {
            id: 'Hatsu',
            health: 3,
            actionPoints: 1,
            archetype: {
              health: 3,
            },
          },
        ],
      })

      players.heal(store, action)

      expect(store.getState()).toEqual({
        playerActions: {
          possibilities: [actions.heal({ id: 'Hatsu' }, { cost: 1 })],
        },
        players: [
          {
            id: 'Hatsu',
            health: 3,
            actionPoints: 0,
            archetype: {
              health: 3,
            },
          },
        ],
      })
    })

    it('should not put actionPoints a negative level', () => {
      const action = actions.heal({ id: 'Hatsu' }, { cost: 2 })
      const store = createStore({
        playerActions: {
          possibilities: [action],
        },
        players: [
          {
            id: 'Hatsu',
            health: 2,
            actionPoints: 1,
            archetype: {
              health: 3,
            },
          },
        ],
      })

      players.heal(store, actions.heal({ id: 'Hatsu' }, { cost: 2 }))

      expect(store.getState()).toEqual({
        playerActions: {
          possibilities: [actions.heal({ id: 'Hatsu' }, { cost: 2 })],
        },
        players: [
          {
            id: 'Hatsu',
            health: 3,
            actionPoints: 0,
            archetype: {
              health: 3,
            },
          },
        ],
      })
    })
  })

  describe('excess', () => {
    it('should roll a dice then damage or do the action', () => {
      const store = createStore({})
      store.dispatch = jest.fn()

      const actionToExcess = {
        type: '@mock_possibility',
        payload: {
          type: '@next_action',
          playerId: 'uid1',
        },
      }
      const action = actions.excess(actionToExcess)
      players.excess(store, action)

      expect(store.getState()).toEqual({})
      expect(store.dispatch).toHaveBeenCalledTimes(1)
      expect(store.dispatch).toHaveBeenCalledWith(
        roll.branch(
          4,
          { id: 'uid1' },
          actions.damage({ id: 'uid1' }, 1, action),
          actionToExcess,
        ),
      )
    })
  })
})
