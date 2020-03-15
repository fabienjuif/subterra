import React from "react";
import cn from "classnames";
import EmptyCell from "./emptyCell";
import Tile from "./tile";
import Player from "./player";
import Action from "./action";
import classes from "./cell.module.scss";

const Cell = ({ x, y, empty, tile, players, actions, onAction }) => {
  return (
    <div
      style={{ top: `${y * 4}em`, left: `${x * 4}em` }}
      className={cn(classes.cell)}
    >
      {empty && <EmptyCell />}
      {tile && <Tile {...tile} />}

      {players && players.length > 0 && (
        <div className={cn("cell-players", classes.players)}>
          {players.map(player => (
            <Player {...player} />
          ))}
        </div>
      )}

      {actions && actions.length > 0 && (
        <div className={cn("cell-actions", classes.actions)}>
          {actions.map(action => (
            <Action key={action.code} {...action} onClick={onAction} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Cell;
