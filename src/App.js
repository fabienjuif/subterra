import React, { useState, useEffect, useCallback } from "react";
import cn from "classnames";
import TilesDeck from "./components/tilesDeck";
import CardsDeck from "./components/cardsDeck";
import Grid from "./components/grid";
import tilesData from "./utils/tiles";
import classes from "./app.module.scss";

const rotate = old => howMany => {
  const value = old + howMany;
  if (value >= 360) return 0;
  return value;
};

function App() {
  const [tiles, setTiles] = useState([]);
  const [waitingTile, setWaitingTile] = useState();
  const [player, setPlayer] = useState({ x: 0, y: 0 });

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
    },
    [waitingTile]
  );

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

  return (
    <div className="App">
      <div className={cn("ui-grid", classes.uiGrid)}>
        <Grid onCellClick={onCellClick} tiles={tiles} player={player} />
      </div>
      <TilesDeck tile={waitingTile} onClick={onClick} />
      {/* <CardsDeck /> */}
    </div>
  );
}

export default App;
