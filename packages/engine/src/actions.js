export const players = {
  damage: (player, damage, from) => ({
    type: '@players>damage',
    payload: {
      damage,
      from,
      playerName: player.name,
    },
  }),
  move: (player, tile) => ({
    type: '@players>move',
    payload: {
      playerName: player.name,
      x: tile.x,
      y: tile.y,
      cost: 1, // TODO: Get this from the tile and block any action with a cost > pa
    },
  }),
  heal: (player, skill) => ({
    type: '@players>heal',
    payload: {
      playerName: player.name,
      cost: skill ? skill.cost : 2,
      amount: 1,
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

export const isActionEquals = (obj1) => (obj2) => {
  return JSON.stringify(obj1) === JSON.stringify(obj2)
}
