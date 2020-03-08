import React, { useState, useEffect, useCallback } from "react";
import cn from "classnames";
import TilesDeck from "./components/tilesDeck";
import Grid from "./components/grid";
import tilesData, { isTilesTouched, canMoveFromTo } from "./utils/tiles";
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
  const [waitingTile, setWaitingTile] = useState();
  const [player, setPlayer] = useState({ x: 0, y: 0, health: 3 });
  const [actionPoints, setActionPoints] = useState(2);
  const [turn, setTurn] = useState(0);
  const [waitingAction, setWaitingAction] = useState(false);
  const [action, setAction] = useState();
  const [targetedCell, setTargetedCell] = useState();

  useEffect(() => {
    setTiles([{ ...tilesData[0], x: 0, y: 0 }]);
  }, []);

  useEffect(() => {
    if (!action) return;

    let nextTile = getRandomInArray(Object.values(tilesData).slice(2));
    if (tilesDeckSize <= 6 && tilesDeckSize === roll(tilesDeckSize)) {
      nextTile = tilesData[1];
    }
    setWaitingTile({ ...nextTile, rotation: 0 });
    setTilesDeckSize(old => old - 1);
  }, [action]); // TODO:

  const onCellClick = useCallback(
    ({ x, y }) => {
      // retrieve the player tile
      const playerTile = tiles.find(
        tile => tile.x === player.x && tile.y === player.y
      );

      // targeted tile (if it exists)
      let targetedTile = undefined;
      if (targetedCell) {
        targetedTile = tiles.find(
          tile => tile.x === targetedCell.x && tile.y === targetedCell.y
        );
      } else {
        targetedTile = tiles.find(tile => tile.x === x && tile.y === y);
      }

      // control the player is next to the tile
      if (!isTilesTouched(playerTile, { x, y })) return;

      if (!waitingTile) {
        if (!targetedTile) {
          setWaitingAction(true);
          setTargetedCell({ x, y });
          return;
        }

        // ---- MOVE ----
        // control the player can move to the tile
        if (!canMoveFromTo(playerTile, targetedTile)) return;

        // move the player
        setPlayer(old => ({ ...old, x, y }));
        setActionPoints(old => old - 1);
        return;
      }
    },
    [waitingTile, player, tiles, targetedCell]
  );

  useEffect(() => {
    setActionPoints(2);
  }, [turn]);

  useEffect(() => {
    if (actionPoints === -1) {
      if (roll6() < 4) {
        setPlayer(old => ({ ...old, health: old.health - 1 }));
      }
      setTurn(old => old + 1);
    }
  }, [actionPoints]);

  const onTilesDeckClick = useCallback(() => {
    if (tilesDeckSize < 0) return;
    if (!waitingTile) return;

    setWaitingTile(old => ({
      ...old,
      rotation: rotate(old.rotation)(90)
    }));
  }, [waitingTile, tilesDeckSize]);

  const nextTurn = useCallback(() => setTurn(old => old + 1), []);

  return (
    <div className="App">
      turn: {turn}
      <div>
        <h4>Player</h4>
        <table>
          <tr>
            <td>name</td>
            <td>Sutat</td>
          </tr>
          <tr>
            <td>archetype</td>
            <td>Explorer</td>
          </tr>
          <tr>
            <td>action points</td>
            <td>{actionPoints}</td>
          </tr>
          <tr>
            <td>health</td>
            <td>{player.health}</td>
          </tr>
        </table>
      </div>
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
      {waitingTile && (
        <button
          onClick={() => {
            if (!targetedCell) return;

            const targetedTile = tiles.find(
              tile => tile.x === targetedCell.x && tile.y === targetedCell.y
            );

            // control the cell is not empty
            if (targetedTile) return;

            // control we didn't block path after we put tile
            const playerTile = tiles.find(
              tile => tile.x === player.x && tile.y === player.y
            );
            if (
              !canMoveFromTo(playerTile, { ...waitingTile, ...targetedCell })
            ) {
              return;
            }

            // update states
            setTiles(old => [...old, { ...waitingTile, ...targetedCell }]);
            setActionPoints(old => old - 1);
            setWaitingTile(undefined);
            setTargetedCell(undefined);
            setAction(undefined);
            if (action === "explore") {
              setPlayer(old => ({ ...old, ...targetedCell }));
            }
          }}
        >
          done
        </button>
      )}
      <button onClick={nextTurn}>Next turn</button>
      <div className={cn("ui-grid", classes.uiGrid)}>
        <Grid onCellClick={onCellClick} tiles={tiles} player={player} />
      </div>
      {/* <CardsDeck /> */}
    </div>
  );
}

export default App;
