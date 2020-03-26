export const players = {
  damage: (player, damage, from) => ({
    type: '@players>damage',
    payload: {
      damage,
      from,
      playerName: player.name,
    },
  }),
}

export const roll = {
  failThen: (min, player, actionOnFail) => ({
    type: '@dices>roll',
    payload: {
      min,
      playerName: player.name,
      actionOnFail,
    },
  }),
  then: (nextAction) => ({
    type: '@dices>roll',
    payload: {
      nextAction,
    },
  }),
}
