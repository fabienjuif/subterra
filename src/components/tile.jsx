import React from "react";
import cn from "classnames";
import classes from "./tile.module.scss";

const Tile = ({
  id,
  start,
  end,
}) => {
  return (
    <div
      className={cn(classes.tile, {
        [classes.start]: start,
        [classes.end]: end
      })}
    >
      tile - {id}
    </div>
  );
};

export default Tile;
