import React, { useState, useEffect, useCallback } from "react";
import cn from "classnames";
import TilesDeck from "./components/tilesDeck";
import Grid from "./components/grid";
import tilesData, { isOpen } from "./utils/tiles";
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

  useEffect(() => {
    setTiles([{ ...tilesData[0], x: 0, y: 0 }]);
  }, []);

  const onCellClick = useCallback(
    ({ x, y }) => {
      if (!waitingTile) return;

      // control the cell is empty
      // - it means no other tiles exists here
      if (tiles.some(tile => tile.x === x && tile.y === y)) return;

      // retrieve the player tile
      const playerTile = tiles.find(
        tile => tile.x === player.x && tile.y === player.y
      );

      // control the player is next to the tile
      if (Math.abs(playerTile.y - y) > 1 || Math.abs(playerTile.x - x) > 1) {
        return;
      }

      // control than we can move
      if (playerTile.y !== y && playerTile.x !== x) return;
      if (playerTile.y === y) {
        // left & right
        if (playerTile.x < x) {
          if (!isOpen("right")(playerTile) || !isOpen("left")(waitingTile)) {
            return;
          }
        } else if (
          !isOpen("left")(playerTile) ||
          !isOpen("right")(waitingTile)
        ) {
          return;
        }
      } else {
        // top & bottom
        if (playerTile.y < y) {
          if (!isOpen("bottom")(playerTile) || !isOpen("top")(waitingTile)) {
            return;
          }
        } else if (
          !isOpen("top")(playerTile) ||
          !isOpen("bottom")(waitingTile)
        ) {
          return;
        }
      }

      // TODO: control than we can move here
      setTiles(old => [...old, { ...waitingTile, x, y }]);
      setWaitingTile(undefined);
      setPlayer(old => ({ ...old, x, y }));
      setActionPoints(old => old - 1);
    },
    [waitingTile, player, tiles]
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

    if (!waitingTile) {
      let nextTile = getRandomInArray(Object.values(tilesData).slice(2))
      if (tilesDeckSize <= 6 && tilesDeckSize === roll(tilesDeckSize)) {
        nextTile = tilesData[1]
      }
      setWaitingTile({ ...nextTile, rotation: 0 });
      setTilesDeckSize(old => old - 1)
    } else {
      setWaitingTile(old => ({
        ...old,
        rotation: rotate(old.rotation)(90)
      }));
    }
  }, [waitingTile, tilesDeckSize]);

  const nextTurn = useCallback(() => setTurn(old => old + 1), []);

  return (
    <div className="App">
      {turn} {actionPoints}
      <div>
        <h4>Player</h4>
        {player.health}
      </div>
      {tilesDeckSize > -1 && (
        <TilesDeck
          tile={waitingTile}
          onClick={onTilesDeckClick}
          size={tilesDeckSize}
        />
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
