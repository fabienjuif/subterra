import React, { useState, useEffect, useCallback } from "react";
import cn from "classnames";
import TilesDeck from "./components/tilesDeck";
import CardsDeck from "./components/cardsDeck";
import Grid from "./components/grid";
import tilesData from "./utils/tiles";
import { roll6 } from './utils/dices'
import classes from "./app.module.scss";

const rotate = old => howMany => {
  const value = old + howMany;
  if (value >= 360) return 0;
  return value;
};

function App() {
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
      // TODO: control than we can move here
      setTiles(old => [...old, { ...waitingTile, x, y }]);
      setWaitingTile(undefined);
      setPlayer(old => ({ ...old, x, y }));
      setActionPoints(old => old - 1)
    },
    [waitingTile]
  );

  useEffect(() => {
    setActionPoints(2);
  }, [turn]);

  useEffect(() => {
    if (actionPoints === -1) {
      if (roll6() < 4) {
        setPlayer(old => ({ ...old, health: old.health - 1 }))
      }
      setTurn(old => old + 1)
    }
  }, [actionPoints])

  const onClick = useCallback(() => {
    if (!waitingTile) {
      setWaitingTile({ ...tilesData[2], rotation: 0 });
    } else {
      setWaitingTile(old => ({
        ...old,
        rotation: rotate(old.rotation)(90)
      }));
    }
  }, [waitingTile]);

  const nextTurn = useCallback(() => setTurn(old => old + 1), []);

  return (
    <div className="App">
      {turn} {actionPoints}
      <div>
        <h4>Player</h4>
        {player.health}
      </div>
      <TilesDeck tile={waitingTile} onClick={onClick} />
      <button onClick={nextTurn}>Next turn</button>
      <div className={cn("ui-grid", classes.uiGrid)}>
        <Grid onCellClick={onCellClick} tiles={tiles} player={player} />
      </div>
      {/* <CardsDeck /> */}
    </div>
  );
}

export default App;
