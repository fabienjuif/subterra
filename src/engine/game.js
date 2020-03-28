import { isCellEqual } from '../utils/tiles'

export const checkLoose = (store, action) => {
  const prevState = store.getState()

  if (!prevState.players.some(({ health }) => health > 0)) {
    store.mutate((state) => {
      state.gameOver = 'loose'
    })
  }
}

export const checkWin = (store, action) => {
  const prevState = store.getState()

  const outCell = prevState.grid.find(({ type }) => type === 'end')
  if (!outCell) return

  const playersOut = prevState.players.filters(isCellEqual(outCell))
  const deadPlayers = prevState.players.filters(({ health }) => health <= 0)

  if (deadPlayers.length + playersOut.length !== prevState.players.length) {
    return
  }

  store.mutate((state) => {
    state.gameOver =
      deadPlayers.length < prevState.players.length / 3 ? 'win' : 'loose'
  })
}
