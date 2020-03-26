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

  if (turnEnd) store.dispatch('@cards>pick')
}

export const move = (store, action) => {
  const player = store
    .getState()
    .players.find(({ name }) => name === action.payload.playerName)

  checkExcess(store, player, action.payload.cost)

  store.mutate((state) => {
    player.actionPoints = Math.max(0, player.actionPoints - action.payload.cost)
    player.x = action.payload.x
    player.y = action.payload.y
  })
}

const checkExcess = (store, player, actionCost) => {
  if (player.actionPoints < actionCost) {
    store.dispatch({
      type: '@dices>roll',
      payload: {
        min: 4,
        actionOnFail: {
          type: '@players>damage',
          payload: { damage: 1, from: 'excess', playerName: player.name },
        },
      },
    })
  }
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
    state.players = [
      {
        id: 0,
        x: 0,
        y: 0,
        health: 3,
        name: 'Sutat',
        archetype: 'explorer',
        actionPoints: 2,
        current: true,
        first: true,
      },
      {
        id: 1,
        x: 0,
        y: 0,
        health: 3,
        name: 'Tripa',
        archetype: 'chef',
        actionPoints: 2,
      },
      {
        id: 2,
        x: 0,
        y: 0,
        health: 5,
        name: 'SoE',
        archetype: 'miner',
        actionPoints: 2,
      },
    ]
  })
}
