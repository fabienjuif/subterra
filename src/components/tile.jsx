import React from "react";
import cn from "classnames";
import classes from "./tile.module.scss";

const Tile = ({ id, start, end, top, bottom, left, right }) => {
  return (
    <div
      className={cn(classes.tile, {
        [classes.start]: start,
        [classes.end]: end
      })}
    >
      tile - {id}
      <div>
        {top || <div className={classes.top}>&nbsp;</div>}
        {bottom || <div className={classes.bottom}>&nbsp;</div>}
        {left || <div className={classes.left}>&nbsp;</div>}
        {right || <div className={classes.right}>&nbsp;</div>}
      </div>
    </div>
  );
};

export default Tile;
