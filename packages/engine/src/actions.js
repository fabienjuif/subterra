export const players = {
  damage: (player, damage, from) => ({
    type: '@players>damage',
    payload: {
      damage,
      from,
      playerId: player.id,
    },
  }),
  death: (player) => ({
    type: '@players>death',
    payload: {
      playerId: player.id,
    },
  }),
  move: (player, tile) => ({
    type: '@players>move',
    payload: {
      playerId: player.id,
      x: tile.x,
      y: tile.y,
      cost: 1, // TODO: Get this from the tile and block any action with a cost > pa
    },
  }),
  look: (player, tile) => ({
    type: '@players>look',
    payload: {
      playerId: player.id,
      x: tile.x,
      y: tile.y,
      cost: 1,
    },
  }),
  rotate: (player, rotation) => ({
    type: '@players>rotate',
    payload: {
      playerId: player.id,
      rotation,
      cost: 0,
    },
  }),
  drop: (player) => ({
    type: '@players>drop',
    payload: {
      playerId: player.id,
      cost: 0,
    },
  }),
  heal: (player, skill) => ({
    type: '@players>heal',
    payload: {
      playerId: player.id,
      cost: skill ? skill.cost : 2,
      amount: 1,
    },
  }),
  excess: (actionOnSuccess) => ({
    type: '@players>excess',
    payload: {
      playerId: actionOnSuccess.payload.playerId,
      actionOnSuccess,
    },
  }),
}

export const enemies = {
  move: (enemy, path, player) => ({
    type: '@enemies>move',
    payload: {
      enemy: {
        x: enemy.x,
        y: enemy.y,
      },
      path,
      playerId: player.id,
    },
  }),
  kill: (enemy) => ({
    type: '@enemies>kill',
    payload: {
      x: enemy.x,
      y: enemy.y,
    },
  }),
}

export const roll = {
  failThen: (min, player, actionOnFail) => ({
    type: '@dices>roll',
    payload: {
      min,
      playerId: player.id,
      actionOnFail,
    },
  }),
  then: (nextAction) => ({
    type: '@dices>roll',
    payload: {
      nextAction,
    },
  }),
  branch: (min, player, actionOnFail, actionOnSuccess) => ({
    type: '@dices>roll',
    payload: {
      min,
      playerId: player.id,
      actionOnFail,
      actionOnSuccess,
    },
  }),
}

// we remove userId and domain to make sure actions are equals without technicals specificities
const withoutTechnicalFields = ({ userId, domain, ...action }) => action

export const isActionEquals = (action1) => (action2) =>
  JSON.stringify(withoutTechnicalFields(action1)) ===
  JSON.stringify(withoutTechnicalFields(action2))
