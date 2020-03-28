import { isActionEquals } from './actions'

export const pass = (store, action) => {
  const previousState = store.getState()
  const firstPlayerIndex = previousState.players.findIndex(({ first }) => first)
  const currentPlayerIndex = previousState.players.findIndex(
    ({ current }) => current,
  )

  const getNextIndex = (current) => {
    const next = current + 1
    if (next >= previousState.players.length) {
      return 0
    }
    return next
  }

  const nextCurrentPlayerIndex = getNextIndex(currentPlayerIndex)

  const turnEnd = firstPlayerIndex === nextCurrentPlayerIndex

  store.mutate((state) => {
    state.players[currentPlayerIndex].current = false

    if (turnEnd) {
      state.players.forEach((player, index) => {
        player.actionPoints = 2
      })

      const nextFirstPlayerIndex = getNextIndex(firstPlayerIndex)
      state.players[nextFirstPlayerIndex].current = true
      state.players[nextFirstPlayerIndex].first = true
      state.players[firstPlayerIndex].first = false
    } else {
      state.players[nextCurrentPlayerIndex].current = true
    }
  })

  if (turnEnd) store.dispatch('@turn>start')
}

export const move = (store, action) => {
  store.mutate((state) => {
    if (!state.playerActions.possibilities.some(isActionEquals(action))) return

    const player = state.players.find(
      ({ name }) => name === action.payload.playerName,
    )

    player.actionPoints = Math.max(0, player.actionPoints - action.payload.cost)
    player.x = action.payload.x
    player.y = action.payload.y
  })
}

export const damage = (store, action) => {
  store.mutate((state) => {
    const player = state.players.find(
      ({ name }) => name === action.payload.playerName,
    )
    player.health = Math.max(0, player.health - action.payload.damage)

    if (player.health <= 0) {
      store.dispatch({
        type: '@players>death',
        payload: { playerName: action.payload.playerName },
      })
    }
  })
}

export const init = (store, action) => {
  store.mutate((state) => {
    state.players = action.payload.map((player) => ({
      ...player,
      x: 0,
      y: 0,
      actionPoints: 2,
    }))
    state.players[0].current = true
    state.players[0].first = true
  })
}
