import React, { useState, useEffect } from "react";
import cn from "classnames";
import { getCellsBounds } from "../utils/tiles";
import Cell from "./cell";
import classes from "./grid.module.scss";

const Grid = ({ cells, onAction, players }) => {
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);

  useEffect(() => {
    const { left, top } = getCellsBounds(cells);

    setTranslateX(left * -1);
    setTranslateY(top * -1);
  }, [cells]);

  return (
    <div
      className={cn("grid", classes.grid)}
      style={{
        transform: `translate(${translateX * 4}em, ${translateY * 4}em)`
      }}
    >
      {cells.map(cell => (
        <Cell key={`${cell.x}:${cell.y}`} {...cell} onAction={onAction} />
      ))}

      {players.map(player => (
        <Cell key={player.id} x={player.x} y={player.y} player={player} />
      ))}
    </div>
  );
};

export default Grid;
