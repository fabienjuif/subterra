import createStore from '@myrtille/mutate'
import { addPlayer, removePlayer, setArchetype } from './players'

jest.mock('@subterra/data', () => ({
  archetypes: [
    { type: 'medic', health: 3 },
    { type: 'bodyguard', health: 5 },
  ],
}))

describe('lobby/players', () => {
  describe('addPlayer', () => {
    it('should add a player', () => {
      const store = createStore({ players: [] })

      addPlayer(store, { payload: { id: 2 } })

      expect(store.getState()).toEqual({ players: [{ id: 2 }] })
    })

    it('should not add player because it already exists', () => {
      const store = createStore({ players: [{ id: 2, old: true }] })

      addPlayer(store, { payload: { id: 2, old: false } })

      expect(store.getState()).toEqual({ players: [{ id: 2, old: true }] })
    })
  })

  describe('removePlayer', () => {
    it('should remove player', () => {
      const store = createStore({ players: [{ id: 2, old: true }] })

      removePlayer(store, { payload: { id: 2 } })

      expect(store.getState()).toEqual({ players: [] })
    })

    it('should set back archetype', () => {
      const store = createStore({
        players: [{ id: 2, type: 'medic' }],
        archetypes: [{ type: 'bodyguard', health: 5 }],
      })

      removePlayer(store, { payload: { id: 2 } })

      expect(store.getState()).toEqual({
        players: [],
        archetypes: [
          { type: 'bodyguard', health: 5 },
          { type: 'medic', health: 3 },
        ],
      })
    })

    it('should not remove player because it did not exists', () => {
      const store = createStore({
        players: [{ id: 3 }],
      })

      removePlayer(store, { payload: { id: 2 } })

      expect(store.getState()).toEqual({
        players: [{ id: 3 }],
      })
    })
  })

  describe('setArchetype', () => {
    it('should set archetype to player and remove it to available list', () => {
      const store = createStore({
        players: [{ id: 2 }],
        archetypes: [
          { type: 'medic', health: 3 },
          { type: 'bodyguard', health: 5 },
        ],
      })

      setArchetype(store, { userId: 2, payload: { archetypeType: 'medic' } })

      expect(store.getState()).toEqual({
        players: [
          {
            id: 2,
            type: 'medic',
            health: 3,
            archetype: { type: 'medic', health: 3 },
          },
        ],
        archetypes: [{ type: 'bodyguard', health: 5 }],
      })
    })

    it('should free up older archetype', () => {
      const store = createStore({
        players: [{ id: 2, type: 'medic' }],
        archetypes: [{ type: 'bodyguard', health: 5 }],
      })

      setArchetype(store, {
        userId: 2,
        payload: { archetypeType: 'bodyguard' },
      })

      expect(store.getState()).toEqual({
        players: [
          {
            id: 2,
            type: 'bodyguard',
            health: 5,
            archetype: { type: 'bodyguard', health: 5 },
          },
        ],
        archetypes: [{ type: 'medic', health: 3 }],
      })
    })

    it('should do nothing since archetype is not available', () => {
      const store = createStore({
        players: [{ id: 2 }],
        archetypes: [{ type: 'bodyguard', health: 5 }],
      })

      setArchetype(store, {
        userId: 2,
        payload: { archetypeType: 'medic' },
      })

      expect(store.getState()).toEqual({
        players: [{ id: 2 }],
        archetypes: [{ type: 'bodyguard', health: 5 }],
      })
    })

    it('should do nothing since player is not found', () => {
      const store = createStore({
        players: [{ id: 2 }],
        archetypes: [{ type: 'bodyguard', health: 5 }],
      })

      setArchetype(store, {
        userId: 3,
        payload: { archetypeType: 'bodyguard' },
      })

      expect(store.getState()).toEqual({
        players: [{ id: 2 }],
        archetypes: [{ type: 'bodyguard', health: 5 }],
      })
    })
  })
})
