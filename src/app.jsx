import React, { useState, useEffect, useCallback } from "react";
import cn from "classnames";
import TilesDeck from "./components/tilesDeck";
import Grid from "./components/grid";
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
  const [player, setPlayer] = useState({ x: 0, y: 0, health: 3 });
  const [actionPoints, setActionPoints] = useState(2);
  const [turn, setTurn] = useState(0);
  const [waitingAction, setWaitingAction] = useState(false);
  const [action, setAction] = useState();
  const [currentAction, setCurrentAction] = useState();

  useEffect(() => {
    setTiles([{ ...tilesData[0], x: 0, y: 0 }]);
  }, []);

  useEffect(() => {
    let cells = getWrappingCells(tiles);

    const playerCell = cells.find(isCellEqual(player));
    const findActionsFromPlayer = findActionsOnCell(playerCell);

    cells = cells.map(cell => ({
      ...cell,
      actions: findActionsFromPlayer(cell)
    }));

    setCells(cells);
  }, [tiles, player]);

  useEffect(() => {
    if (!action) return;

    if (action.code === "move") {
      setPlayer(old => ({ ...old, x: action.cell.x, y: action.cell.y }));
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
      setCurrentAction(action);
    }

    setAction(undefined);
    setActionPoints(old => old - action.cost);
  }, [action, tilesDeckSize]);
  
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

  const onDone = useCallback(() => {
    // control we didn't block path after we put tile
    const playerCell = cells.find(isCellEqual(player));
    if (!canMoveFromTo(playerCell.tile, waitingTile)) {
      return;
    }

    // update states
    setTiles(old => [...old, waitingTile]);
    setWaitingTile(undefined);
    if (currentAction.code === "explore") {
      setPlayer(old => ({
        ...old,
        x: currentAction.cell.x,
        y: currentAction.cell.y
      }));
    }
    setCurrentAction(undefined);
  }, [currentAction, player, cells, waitingTile]);

  return (
    <div className="App">
      turn: {turn}
      <div>
        <h4>Player</h4>
        <table>
          <tbody>
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
          </tbody>
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
      {waitingTile && <button onClick={onDone}>done</button>}
      <button onClick={nextTurn}>Next turn</button>
      <div className={cn("ui-grid", classes.uiGrid)}>
        <Grid onAction={setAction} cells={cells} player={player} />
      </div>
      {/* <CardsDeck /> */}
    </div>
  );
}

export default App;
