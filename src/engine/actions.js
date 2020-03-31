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
  look: (player, tile) => ({
    type: '@players>look',
    payload: {
      playerName: player.name,
      x: tile.x,
      y: tile.y,
      cost: 1,
    },
  }),
  rotate: (player, rotation) => ({
    type: '@players>rotate',
    payload: {
      playerName: player.name,
      rotation,
      cost: 0,
    },
  }),
  drop: (player) => ({
    type: '@players>drop',
    payload: {
      playerName: player.name,
      cost: 0,
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
