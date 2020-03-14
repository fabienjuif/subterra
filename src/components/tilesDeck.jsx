import React, { useState, useEffect } from "react";
import tilesData from '../utils/tiles'
import Tile from "./tile";

const TilesDeck = () => {
  const [tiles, setTiles] = useState([]);

  useEffect(() => {
    setTiles(Array
        .from({ length: 64 })
        .map((_, index) => ({ id: index === 0 ? 0 : index === 63 ? 1 : 2 }))
        .map(({ id }) => tilesData[id])
    );
  }, []);

  return (
    <div>
      {tiles.map(tile => (
        <Tile {...tile} />
      ))}
    </div>
  );
};

export default TilesDeck;
