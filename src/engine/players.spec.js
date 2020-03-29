import createStore from '@myrtille/mutate'
import * as players from './players'
import { players as actions } from './actions'

describe('players', () => {
  describe('pass', () => {
    it('should pass to the next player (and not pick a card)', () => {
      const store = createStore({
        players: [
          {
            name: 'SoE',
            first: true,
            current: true,
          },
          {
            name: 'Hatsu',
          },
        ],
      })
      store.dispatch = jest.fn()
      players.pass(store, {})
      expect(store.dispatch).toHaveBeenCalledTimes(0)
      expect(store.getState()).toEqual({
        players: [
          {
            name: 'SoE',
            first: true,
            current: false,
          },
          {
            name: 'Hatsu',
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
            name: 'SoE',
            first: true,
            actionPoints: 0,
          },
          {
            name: 'Hatsu',
            actionPoints: 1,
          },
          {
            name: 'Tripa',
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
            name: 'SoE',
            first: false,
            actionPoints: 2,
          },
          {
            name: 'Hatsu',
            first: true,
            current: true,
            actionPoints: 2,
          },
          {
            name: 'Tripa',
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
            name: 'SoE',
            actionPoints: 0,
          },
          {
            name: 'Hatsu',
            current: true,
            actionPoints: 1,
          },
          {
            name: 'Tripa',
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
            name: 'SoE',
            first: true,
            current: true,
            actionPoints: 2,
          },
          {
            name: 'Hatsu',
            current: false,
            actionPoints: 2,
          },
          {
            name: 'Tripa',
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
      const store = createStore({
        players: [
          { name: 'Hatsu', actionPoints: 1, x: 0, y: 0 },
          { name: 'SoE', actionPoints: 2, x: 0, y: 0 },
        ],
        playerActions: {
          possibilities: [
            {
              type: '@players>move',
              payload: { playerName: 'Hatsu', cost: 1, x: 1, y: -1 },
            },
          ],
        },
      })

      players.move(store, {
        type: '@players>move',
        payload: { playerName: 'Hatsu', cost: 1, x: 1, y: -1 },
      })

      expect(store.getState().players).toEqual([
        { name: 'Hatsu', actionPoints: 0, x: 1, y: -1 },
        { name: 'SoE', actionPoints: 2, x: 0, y: 0 },
      ])
    })

    it('should not move player when the action is not a known possibilities', () => {
      const action = {
        type: '@players>move',
        payload: { playerName: 'Hatsu', cost: 1, x: 1, y: -1 },
      }
      const store = createStore({
        players: [
          { name: 'Hatsu', actionPoints: 1, x: 0, y: 0 },
          { name: 'SoE', actionPoints: 2, x: 0, y: 0 },
        ],
        playerActions: { possibilities: [] },
      })

      players.move(store, action)

      expect(store.getState().players).toEqual([
        { name: 'Hatsu', actionPoints: 1, x: 0, y: 0 },
        { name: 'SoE', actionPoints: 2, x: 0, y: 0 },
      ])
    })
  })

  describe('damage', () => {
    it('should damage player', () => {
      const store = createStore({
        players: [
          {
            name: 'SoE',
            health: 10,
          },
          {
            name: 'Hatsu',
            health: 5,
          },
        ],
      })

      store.dispatch = jest.fn()

      players.damage(store, {
        payload: { playerName: 'Hatsu', damage: 2 },
      })

      expect(store.getState()).toEqual({
        players: [
          {
            name: 'SoE',
            health: 10,
          },
          {
            name: 'Hatsu',
            health: 3,
          },
        ],
      })
      expect(store.dispatch).toHaveBeenCalledTimes(0)
    })

    it('should kill player if it has no health remaining', () => {
      const store = createStore({
        players: [
          {
            name: 'SoE',
            health: 1,
          },
        ],
      })
      store.dispatch = jest.fn()

      players.damage(store, {
        payload: { playerName: 'SoE', damage: 2 },
      })

      expect(store.getState().players).toEqual([{ name: 'SoE', health: 0 }])
      expect(store.dispatch).toHaveBeenCalledTimes(1)
      expect(store.dispatch).toHaveBeenCalledWith({
        type: '@players>death',
        payload: {
          playerName: 'SoE',
        },
      })
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
            name: 'Sutat',
            type: 'explorer',
            actionPoints: 2,
            current: true,
            first: true,
          },
          {
            x: 0,
            y: 0,
            name: 'Tripa',
            type: 'chef',
            actionPoints: 2,
          },
          {
            x: 0,
            y: 0,
            name: 'SoE',
            type: 'miner',
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
            name: 'Hatsu',
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
        actions.move({ name: 'Hatsu' }, { x: 1, y: 0 }),
      ])
    })

    it('should not find any possibilities when the player has no action points', () => {
      const store = createStore({
        players: [
          {
            name: 'Hatsu',
            x: 0,
            y: 0,
            health: 1,
            actionPoints: 0,
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
            name: 'Hatsu',
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
            name: 'Hatsu',
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
            name: 'SoE',
            current: true,
            x: 0,
            y: 0,
            skills: [],
            health: 2,
            archetype: {
              health: 3,
            },
          },
          // heal an ally
          {
            name: 'Tripa',
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
            name: 'Hatsu',
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
            name: 'Sutat',
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
        {
          type: '@players>heal',
          payload: {
            amount: 1,
            cost: 2,
            playerName: 'SoE',
          },
        },
        {
          type: '@players>heal',
          payload: {
            amount: 1,
            cost: 2,
            playerName: 'Tripa',
          },
        },
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
            name: 'SoE',
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
            name: 'Tripa',
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
            name: 'Hatsu',
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
            name: 'Sutat',
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
        {
          type: '@players>heal',
          payload: {
            amount: 1,
            cost: 2, // can not use the skill "heal" on itself
            playerName: 'SoE',
          },
        },
        {
          type: '@players>heal',
          payload: {
            amount: 1,
            cost: 1,
            playerName: 'Tripa',
          },
        },
      ])
    })
  })
})
