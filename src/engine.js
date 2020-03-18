import { roll, roll6, getRandomInArray } from "./utils/dices";
import { v4 as uuid } from "uuid";
import cardsData from "./utils/cards";
import tilesData, {
  canMoveFromTo,
  isCellEqual,
  findActionsOnCell,
  getWrappingCells
} from "./utils/tiles";

const rotate = old => howMany => {
  const value = old + howMany;
  if (value >= 360) return 0;
  return value;
};

/**
 * This is needed because of immer.
 * If we don't do this it will log proxy information.
 *
 * @param {State} state state or part of the state
 */
// eslint-disable-next-line
const debug = state => console.log(JSON.parse(JSON.stringify(state)));

export const initState = () => ({
  gameOver: false,
  logs: [],
  decks: {
    tiles: {
      length: 10
    },
    cards: {
      length: 10
    }
  },
  turn: 0,
  players: [],
  action: {}, // action the player is currently doing
  actions: [], // known possible actions for the current player
  board: {
    card: undefined,
    tile: undefined,
    tiles: [{ ...tilesData[0], x: 0, y: 0 }]
  }
});

/**
 * Create a log entry and set the timestamp to it.
 *
 * @param {State} state
 */
const createLog = state => infos => {
  state.logs.push({ ...infos, id: uuid(), timestamp: new Date() });
};

/**
 * If the current card is gaz: check if player is in gaz, and in which case remove them 2 HP.
 *
 * @param {State} state
 * @param {Player} player the player to check
 */
const checkGaz = state => player => {
  if (!state.board.card || state.board.card.type !== "gaz") return;
  if (
    state.board.tiles.some(
      tile => isCellEqual(tile)(player) && tile.type === "gaz"
    )
  ) {
    createLog(state)({
      code: "hit_gaz",
      player: player
    });
    player.health = Math.max(0, player.health - 2);
  }

  if (player.health <= 0) {
    createLog(state)({
      code: "dead",
      player: player
    });
    selectNextPlayer(state);
  }
};

/**
 * new turn.
 *
 * New player is drawn, everybody get their action points and a new card is drawn.
 */
export const newTurn = state => {
  state.players[0].current = true;
  state.players.forEach(player => (player.actionPoints = 2));
  if (state.decks.cards.length > 0) {
    state.board.card = getRandomInArray(Object.values(cardsData).slice(1));
    state.decks.cards.length -= 1;
  } else {
    state.board.card = cardsData[0];
  }

  state.turn += 1;
  state.players.forEach(checkGaz(state));
  if (state.players[0].health <= 0) selectNextPlayer(state);
};

/**
 * Move player to the action cell.
 *
 * @param {State} state the state to mutate
 * @param {Player} player the player to move
 */
const movePlayer = (state, player) => {
  player.x = state.action.cell.x;
  player.y = state.action.cell.y;

  checkGaz(state)(player);
};

/**
 * Get the current player and its index in state.players.
 *
 * @param {State} state
 */
const getCurrentPlayer = state => {
  const playerIndex = state.players.findIndex(({ current }) => current);
  const player = state.players[playerIndex];

  return [player, playerIndex];
};

/**
 * Selected the next player to play.
 * If this is the last player to play, this is a new turn!
 *
 * @param {State} state
 */
const selectNextPlayer = state => {
  let [player, playerIndex] = getCurrentPlayer(state);

  // if all players are dead this is game over
  if (state.players.filter(({ health }) => health > 0).length === 0) {
    state.gameOver = true;
    return;
  }

  // current player is not anymore and we find a new one
  player.current = false;
  if (playerIndex + 1 >= state.players.length) {
    newTurn(state);
  } else {
    player = state.players[playerIndex + 1];
    player.current = true;
    if (player.health <= 0) selectNextPlayer(state);
  }
  createLog(state)({ code: "new_player", player });
};

/**
 * Decrement action point.
 *
 * If the current player has 0 action point
 * 1. a dice is rolled and it can loose some hp.
 * 2. the next player is selected
 *
 * @param {State} state
 */
const decrementActionPoint = state => {
  const [player] = getCurrentPlayer(state);

  if (player.actionPoints === 0) {
    if (roll6() < 4) {
      player.health -= 1;
      createLog(state)({ code: "surpass_fail", player });
    } else {
      createLog(state)({ code: "surpass_ok", player });
    }
    selectNextPlayer(state);
  } else {
    player.actionPoints -= 1;
  }
};

/**
 * Set actions the current player can perform.
 *
 * @param {State} state
 */
const findAndSetActions = state => {
  state.actions = [];

  const [player] = getCurrentPlayer(state);
  if (player.health <= 0) return;

  const playerTile = state.board.tiles.find(isCellEqual(player));
  const cells = getWrappingCells(state.board.tiles);
  const findActionsFromPlayer = findActionsOnCell({
    ...player,
    tile: playerTile
  });

  state.actions = cells.flatMap(findActionsFromPlayer);
};

export const game = (state, action = {}) => {
  const { type, payload } = action;

  let playerIndex = state.players.findIndex(({ current }) => current);
  const player = state.players[playerIndex];

  if (type === "ON_ACTION") {
    state.action = payload;

    createLog(state)({
      ...state.action,
      player,
    });

    if (state.action.code !== "move") {
      let nextTile = getRandomInArray(Object.values(tilesData).slice(2));
      if (
        state.decks.tiles.length <= 6 &&
        state.decks.tiles.length === roll(state.decks.tiles.length)
      ) {
        nextTile = tilesData[1];
      }
      state.board.tile = {
        ...nextTile,
        rotation: 0,
        x: state.action.cell.x,
        y: state.action.cell.y
      };
      state.decks.tiles.length -= 1;
      state.actions = [];
    } else {
      movePlayer(state, player);
      decrementActionPoint(state);
      findAndSetActions(state);
    }
  } else if (type === "ON_ROTATE_TILE") {
    if (state.decks.tiles.length < 0) return;
    if (!state.board.tile) return;

    state.board.tile.rotation = rotate(state.board.tile.rotation)(90);
  } else if (type === "ON_DONE") {
    const playerTile = state.board.tiles.find(isCellEqual(player));
    if (!canMoveFromTo(playerTile, state.board.tile)) {
      return;
    }

    state.board.tiles.push(state.board.tile);
    state.board.tile = undefined;

    if (state.action.code === "explore") {
      movePlayer(state, player);
    }

    decrementActionPoint(state);
    findAndSetActions(state);
  } else if (type === "ON_INIT_PLAYER") {
    state.players = [
      {
        id: 0,
        x: 0,
        y: 0,
        health: 3,
        name: "Sutat",
        archetype: "explorer",
        actionPoints: 2,
        current: true
      },
      {
        id: 1,
        x: 0,
        y: 0,
        health: 3,
        name: "Tripa",
        archetype: "chef",
        actionPoints: 2
      },
      {
        id: 2,
        x: 0,
        y: 0,
        health: 5,
        name: "SoE",
        archetype: "miner",
        actionPoints: 2
      }
    ];

    findAndSetActions(state);
  }
};
