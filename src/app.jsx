import React, { useState, useEffect, useCallback } from "react";
import cn from "classnames";
import TilesDeck from "./components/tilesDeck";
import Grid from "./components/grid";
import Player from "./components/ui/player";
import tilesData, {
  canMoveFromTo,
  getWrappingCells,
  findActionsOnCell,
  isCellEqual
} from "./utils/tiles";
import { roll, roll6, getRandomInArray } from "./utils/dices";
import classes from "./app.module.scss";

const rotate = old => howMany => {
  const value = old + howMany;
  if (value >= 360) return 0;
  return value;
};

function App() {
  const [tilesDeckSize, setTilesDeckSize] = useState(10);
  const [tiles, setTiles] = useState([]);
  const [cells, setCells] = useState([]);
  const [waitingTile, setWaitingTile] = useState();
  const [players, setPlayers] = useState([]);
  const [playerIndex, setPlayerIndex] = useState();
  const [actionPoints, setActionPoints] = useState(2);
  const [turn, setTurn] = useState(0);
  const [waitingAction, setWaitingAction] = useState(false);
  const [action, setAction] = useState();

  const getPlayer = useCallback(index => players[index], [players]);
  const updatePlayer = useCallback(
    player =>
      setPlayers(old =>
        old.map(currPlayer =>
          currPlayer.id === player.id ? player : currPlayer
        )
      ),
    []
  );

  useEffect(() => {
    const players = [
      { id: 0, x: 0, y: 0, health: 3, name: "Sutat", archetype: "explorer" },
      { id: 1, x: 0, y: 0, health: 3, name: "Tripa", archetype: "chef" },
      { id: 2, x: 0, y: 0, health: 5, name: "SoE", archetype: "miner" }
    ];

    setPlayers(players);
    setPlayerIndex(0);

    setTiles([{ ...tilesData[0], x: 0, y: 0 }]);
  }, []);

  useEffect(() => {
    if (playerIndex === undefined) return;

    let cells = getWrappingCells(tiles);

    const playerCell = cells.find(isCellEqual(getPlayer(playerIndex)));
    const findActionsFromPlayer = findActionsOnCell(playerCell);

    cells = cells.map(cell => ({
      ...cell,
      actions: findActionsFromPlayer(cell)
    }));

    setCells(cells);
  }, [tiles, playerIndex, getPlayer]);

  const nextTurn = useCallback(() => setTurn(old => old + 1), []);

  const toNextPlayer = useCallback(() => {
    // find next player
    let currPlayerIndex = playerIndex;
    if (playerIndex === players.length - 1) {
      currPlayerIndex = -1;
      nextTurn();
    }

    setPlayerIndex(currPlayerIndex + 1);
    setActionPoints(2);
  }, [players, nextTurn, playerIndex]);

  const onTilesDeckClick = useCallback(() => {
    if (tilesDeckSize < 0) return;
    if (!waitingTile) return;

    setWaitingTile(old => ({
      ...old,
      rotation: rotate(old.rotation)(90)
    }));
  }, [waitingTile, tilesDeckSize]);

  const onDone = useCallback(() => {
    // control we didn't block path after we put tile
    const player = getPlayer(playerIndex);
    const playerCell = cells.find(isCellEqual(player));
    if (!canMoveFromTo(playerCell.tile, waitingTile)) {
      return;
    }

    // update states
    setTiles(old => [...old, waitingTile]);
    setWaitingTile(undefined);
    if (action.code === "explore") {
      updatePlayer({ ...player, x: action.cell.x, y: action.cell.y });
    }
    setAction(undefined);
  }, [playerIndex, getPlayer, updatePlayer, cells, waitingTile, action]);

  const onAction = useCallback(
    action => {
      let player = getPlayer(playerIndex);
      if (action.code === "move") {
        player = { ...player, x: action.cell.x, y: action.cell.y };
      } else {
        let nextTile = getRandomInArray(Object.values(tilesData).slice(2));
        if (tilesDeckSize <= 6 && tilesDeckSize === roll(tilesDeckSize)) {
          nextTile = tilesData[1];
        }
        setWaitingTile({
          ...nextTile,
          rotation: 0,
          x: action.cell.x,
          y: action.cell.y
        });
        setTilesDeckSize(old => old - 1);
        setAction(action);
      }

      if (actionPoints === 0) {
        if (roll6() < 4) {
          player = { ...player, health: player.health - 1 };
        }
        toNextPlayer();
      } else {
        setActionPoints(actionPoints - 1);
      }
      updatePlayer(player);
    },
    [
      tilesDeckSize,
      toNextPlayer,
      actionPoints,
      playerIndex,
      getPlayer,
      updatePlayer
    ]
  );

  if (playerIndex === undefined) return null;

  return (
    <div className="App">
      turn: {turn}
      <Player {...getPlayer(playerIndex)} actionPoints={actionPoints} />
      {tilesDeckSize > -1 && (
        <TilesDeck
          tile={waitingTile}
          onClick={onTilesDeckClick}
          size={tilesDeckSize}
        />
      )}
      {waitingAction && (
        <div>
          <button
            onClick={() => {
              setWaitingAction(false);
              setAction("look");
            }}
          >
            look
          </button>
          <button
            onClick={() => {
              setWaitingAction(false);
              setAction("explore");
            }}
          >
            explore
          </button>
          <button
            onClick={() => {
              setWaitingAction(false);
              setAction(undefined);
            }}
          >
            cancel
          </button>
        </div>
      )}
      {waitingTile && <button onClick={onDone}>done</button>}
      <button onClick={toNextPlayer}>Next player</button>
      <div className={cn("ui-grid", classes.uiGrid)}>
        <Grid onAction={onAction} cells={cells} players={players} />
      </div>
      {/* <CardsDeck /> */}
    </div>
  );
}

export default App;
