import React, { useCallback } from "react";
import cn from "classnames";
import EmptyCell from "./emptyCell";
import Tile from "./tile";
import Player from "./player";
import classes from "./cell.module.scss";

const Cell = ({ x, y, empty, tile, player, onClick }) => {
  const onInnerClick = useCallback(() => onClick({ x, y }), [onClick, x, y]);
  
  return (
    <div
      style={{ top: `${y * 4}em`, left: `${x * 4}em` }}
      className={cn(classes.cell)}
      onClick={onInnerClick}
    >
      {empty && <EmptyCell />}
      {tile && <Tile {...tile} />}
      {player && <Player {...player} />}
    </div>
  );
};

export default Cell;
