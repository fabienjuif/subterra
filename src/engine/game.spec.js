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
    it.todo('should win the game because all players are out')
    it.todo('should win the game because less than 1/3 of players are dead')
    it.todo('should loose the game because more than 1/3 of players are dead')
    it.todo('should loose the game because than 1/3 of players are dead')
    it.todo('should not end the game because all players are not dead or out')
    it.todo('should not end the game because the ending cell is not found yet')
  })
})
