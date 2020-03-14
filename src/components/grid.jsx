import React, { useState, useEffect } from "react";
import cn from "classnames";
import Cell from "./cell";
import classes from "./grid.module.scss";

const Grid = ({ tiles, onCellClick, player }) => {
  const [cells, setCells] = useState([]);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);

  useEffect(() => {
    let minX = +Infinity;
    let minY = +Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    tiles.forEach(({ x, y }) => {
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    });

    const emptyCells = [];

    for (let y = minY - 1; y < maxY + 2; y += 1) {
      for (let x = minX - 1; x < maxX + 2; x += 1) {
        if (!tiles.some(tile => tile.x === x && tile.y === y)) {
          emptyCells.push({ x, y, empty: true });
        }
      }
    }

    setCells([
      ...emptyCells,
      ...tiles.map(tile => ({ x: tile.x, y: tile.y, empty: false, tile }))
    ]);

    setTranslateX((minX - 1) * -1);
    setTranslateY((minY - 1) * -1);
  }, [tiles]);

  return (
    <div
      className={cn("grid", classes.grid)}
      style={{
        transform: `translate(${translateX * 4}em, ${translateY * 4}em)`
      }}
    >
      {cells.map(cell => (
        <Cell key={`${cell.x}:${cell.y}`} {...cell} onClick={onCellClick} />
      ))}

      <Cell x={player.x} y={player.y} player={player} />
    </div>
  );
};

export default Grid;
