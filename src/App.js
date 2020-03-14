import React, { useState, useEffect, useCallback } from "react";
import TilesDeck from "./components/tilesDeck";
import CardsDeck from "./components/cardsDeck";
import Grid from "./components/grid";
import tilesData from "./utils/tiles";
import "./App.css";

function App() {
  const [tiles, setTiles] = useState([])

  useEffect(() => {
    setTiles([
      { ...tilesData[0], x: 0, y: 0 },
    ])
  }, [])

  const onCellClick = useCallback(({ x, y }) => {
    setTiles(old => [...old, { ...tilesData[2], x, y }])
  }, [])

  return (
    <div className="App">
      <Grid
        onCellClick={onCellClick}
        tiles={tiles}
      />
      {/* <TilesDeck /> */}
      {/* <CardsDeck /> */}
    </div>
  );
}

export default App;
