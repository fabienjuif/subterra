import { roll, roll6, getRandomInArray } from "./utils/dices";
import cardsData from "./utils/cards";
import tilesData, { canMoveFromTo, isCellEqual } from "./utils/tiles";

const rotate = old => howMany => {
  const value = old + howMany;
  if (value >= 360) return 0;
  return value;
};

export const initState = () => ({
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
  action: {},
  board: {
    card: undefined,
    tile: undefined,
    tiles: [{ ...tilesData[0], x: 0, y: 0 }]
  }
});

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
};

export const game = (state, action = {}) => {
  const { type, payload } = action;

  let playerIndex = state.players.findIndex(({ current }) => current);
  const player = state.players[playerIndex];

  if (type === "ON_ACTION") {
    state.action = payload;

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
    }

    if (player.actionPoints === 0) {
      if (roll6() < 4) {
        player.health -= 1;
      }
      player.current = false;

      if (playerIndex + 1 >= state.players.length) {
        newTurn(state);
      } else {
        state.players[playerIndex + 1].current = true;
      }
    } else {
      player.actionPoints -= 1;
    }

    if (state.action.code !== "move") {
      state.decks.tiles.length -= 1;
    } else {
      movePlayer(state, player);
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
  }
};
