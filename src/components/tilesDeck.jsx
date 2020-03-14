import React, { useState, useEffect } from "react";
import cn from "classnames";
import Tile from "./tile";
import classes from "./tilesDeck.module.scss";

const TilesDeck = ({ tile, size, onClick }) => {
  return (
    <div className={cn("tiles-deck", classes.tilesDeck)} onClick={onClick}>
      {!!tile ? <Tile {...tile} /> : <div>Click to play a tile ({size})</div>}
    </div>
  );
};

export default TilesDeck;
