import createStore from '@myrtille/mutate'
import * as game from './game'

describe('game', () => {
  describe('checkLoose', () => {
    it('should mark the game as lose because all are dead', () => {
      const store = createStore({
        players: [
          {
            name: 'Tripa',
            health: 0,
          },
        ],
      })

      game.checkLoose(store, {})

      expect(store.getState()).toEqual({
        gameOver: 'loose',
        players: [
          {
            name: 'Tripa',
            health: 0,
          },
        ],
      })
    })

    it('should not mark the game as lose', () => {
      const store = createStore({
        players: [
          {
            name: 'Tripa',
            health: 0,
          },
          {
            name: 'Hatsu',
            health: 2,
          },
        ],
      })

      game.checkLoose(store, {})

      expect(store.getState()).toEqual({
        players: [
          {
            name: 'Tripa',
            health: 0,
          },
          {
            name: 'Hatsu',
            health: 2,
          },
        ],
      })
    })
  })

  describe('checkWin', () => {
    it('should win the game because all players are out', () => {
      const store = createStore({
        players: [
          {
            name: 'Tripa',
            health: 2,
            x: 0,
            y: 0,
          },
        ],
        grid: [
          {
            x: 0,
            y: 0,
            type: 'end',
          },
        ],
      })

      game.checkWin(store, {})

      expect(store.getState()).toEqual({
        gameOver: 'win',
        players: [
          {
            name: 'Tripa',
            health: 2,
            x: 0,
            y: 0,
          },
        ],
        grid: [
          {
            x: 0,
            y: 0,
            type: 'end',
          },
        ],
      })
    })

    it('should win the game because less than 1/3 of players are dead', () => {
      const store = createStore({
        players: [
          {
            name: 'Tripa',
            health: 2,
            x: 0,
            y: 0,
          },
          {
            name: 'Hatsu',
            health: 3,
            x: 0,
            y: 0,
          },
          {
            name: 'SoE',
            health: 1,
            x: 0,
            y: 0,
          },
          {
            name: 'Sutat',
            health: 0,
            x: 1,
            y: 0,
          },
        ],
        grid: [
          {
            x: 0,
            y: 0,
            type: 'end',
          },
        ],
      })

      game.checkWin(store, {})

      expect(store.getState()).toEqual({
        gameOver: 'win',
        players: [
          {
            name: 'Tripa',
            health: 2,
            x: 0,
            y: 0,
          },
          {
            name: 'Hatsu',
            health: 3,
            x: 0,
            y: 0,
          },
          {
            name: 'SoE',
            health: 1,
            x: 0,
            y: 0,
          },
          {
            name: 'Sutat',
            health: 0,
            x: 1,
            y: 0,
          },
        ],
        grid: [
          {
            x: 0,
            y: 0,
            type: 'end',
          },
        ],
      })
    })

    it('should loose the game because more than 1/3 of players are dead', () => {
      const store = createStore({
        players: [
          {
            name: 'Tripa',
            health: 2,
            x: 0,
            y: 0,
          },
          {
            name: 'Hatsu',
            health: 3,
            x: 0,
            y: 0,
          },
          {
            name: 'SoE',
            health: 0,
            x: 1,
            y: 0,
          },
          {
            name: 'Sutat',
            health: 0,
            x: 1,
            y: 0,
          },
        ],
        grid: [
          {
            x: 0,
            y: 0,
            type: 'end',
          },
        ],
      })

      game.checkWin(store, {})

      expect(store.getState()).toEqual({
        gameOver: 'loose',
        players: [
          {
            name: 'Tripa',
            health: 2,
            x: 0,
            y: 0,
          },
          {
            name: 'Hatsu',
            health: 3,
            x: 0,
            y: 0,
          },
          {
            name: 'SoE',
            health: 0,
            x: 1,
            y: 0,
          },
          {
            name: 'Sutat',
            health: 0,
            x: 1,
            y: 0,
          },
        ],
        grid: [
          {
            x: 0,
            y: 0,
            type: 'end',
          },
        ],
      })
    })

    it('should loose the game because than 1/3 of players are dead', () => {
      const store = createStore({
        players: [
          {
            name: 'Tripa',
            health: 2,
            x: 0,
            y: 0,
          },
          {
            name: 'Hatsu',
            health: 3,
            x: 0,
            y: 0,
          },
          {
            name: 'SoE',
            health: 0,
            x: 1,
            y: 0,
          },
        ],
        grid: [
          {
            x: 0,
            y: 0,
            type: 'end',
          },
        ],
      })

      game.checkWin(store, {})

      expect(store.getState()).toEqual({
        gameOver: 'loose',
        players: [
          {
            name: 'Tripa',
            health: 2,
            x: 0,
            y: 0,
          },
          {
            name: 'Hatsu',
            health: 3,
            x: 0,
            y: 0,
          },
          {
            name: 'SoE',
            health: 0,
            x: 1,
            y: 0,
          },
        ],
        grid: [
          {
            x: 0,
            y: 0,
            type: 'end',
          },
        ],
      })
    })

    it('should not end the game because all players are not dead or out', () => {
      const store = createStore({
        players: [
          {
            name: 'Tripa',
            health: 2,
            x: 0,
            y: 0,
          },
          {
            name: 'SoE',
            health: 0,
            x: 1,
            y: 0,
          },
          {
            name: 'Hatsu',
            health: 1,
            x: 1,
            y: 0,
          },
        ],
        grid: [
          {
            x: 0,
            y: 0,
            type: 'end',
          },
        ],
      })

      game.checkWin(store, {})

      expect(store.getState()).toEqual({
        players: [
          {
            name: 'Tripa',
            health: 2,
            x: 0,
            y: 0,
          },
          {
            name: 'SoE',
            health: 0,
            x: 1,
            y: 0,
          },
          {
            name: 'Hatsu',
            health: 1,
            x: 1,
            y: 0,
          },
        ],
        grid: [
          {
            x: 0,
            y: 0,
            type: 'end',
          },
        ],
      })
    })

    it('should not end the game because the ending cell is not found yet', () => {
      const store = createStore({
        players: [
          {
            name: 'Tripa',
            health: 2,
            x: 0,
            y: 0,
          },
          {
            name: 'SoE',
            health: 1,
            x: 0,
            y: 0,
          },
          {
            name: 'Hatsu',
            health: 1,
            x: 0,
            y: 0,
          },
        ],
        grid: [
          {
            x: 0,
            y: 0,
          },
        ],
      })

      game.checkWin(store, {})

      expect(store.getState()).toEqual({
        players: [
          {
            name: 'Tripa',
            health: 2,
            x: 0,
            y: 0,
          },
          {
            name: 'SoE',
            health: 1,
            x: 0,
            y: 0,
          },
          {
            name: 'Hatsu',
            health: 1,
            x: 0,
            y: 0,
          },
        ],
        grid: [
          {
            x: 0,
            y: 0,
          },
        ],
      })
    })
  })
})
