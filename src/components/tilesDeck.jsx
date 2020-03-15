import React from "react";
import cn from "classnames";
import Tile from "./tile";
import classes from "./tilesDeck.module.scss";

const TilesDeck = ({ tile, size, onClick }) => {
  return (
    <div className={cn("tiles-deck", classes.tilesDeck)} onClick={onClick}>
      {!!tile ? <Tile {...tile} /> : <div>Tiles ({size})</div>}
    </div>
  );
};

export default TilesDeck;
