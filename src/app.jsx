import React, { useState, useEffect, useCallback } from "react";
import cn from "classnames";
import { useImmerReducer } from "use-immer";
import TilesDeck from "./components/tilesDeck";
import Grid from "./components/grid";
import Player from "./components/ui/player";
import CardsDeck from "./components/cardsDeck";
import {
  getWrappingCells,
  findActionsOnCell,
  isCellEqual
} from "./utils/tiles";
import { game, initState } from "./engine";
import classes from "./app.module.scss";

function App() {
  const [state, dispatch] = useImmerReducer(game, initState());
  const [cells, setCells] = useState([]);

  const getPlayer = useCallback(
    () => state.players.find(({ current }) => current),
    [state.players]
  );

  useEffect(() => {
    dispatch({ type: "ON_INIT_PLAYER" });
  }, [dispatch]);

  useEffect(() => {
    const player = getPlayer();
    if (!player) return;

    let cells = getWrappingCells(state.board.tiles);

    const playerCell = cells.find(isCellEqual(player));
    const findActionsFromPlayer = findActionsOnCell(playerCell);

    cells = cells.map(cell => ({
      ...cell,
      actions: findActionsFromPlayer(cell)
    }));

    setCells(cells);
  }, [state.board.tiles, getPlayer]);

  const onTilesDeckClick = useCallback(
    () => dispatch({ type: "ON_ROTATE_TILE" }),
    [dispatch]
  );

  const onDone = useCallback(() => dispatch({ type: "ON_DONE" }), [dispatch]);

  const onAction = useCallback(
    action => {
      dispatch({ type: "ON_ACTION", payload: action });
    },
    [dispatch]
  );

  if (state.players.length === 0) return null;

  return (
    <div className={cn("app", classes.app)}>
      <div className={cn("ui-players", classes.players)}>
        {state.players.map((player, index) => (
          <Player key={player.id} {...player} />
        ))}
      </div>
      <div className={cn("ui-grid", classes.grid)}>
        <Grid onAction={onAction} cells={cells} players={state.players} />
      </div>
      <div>
        <div> turn: {state.turn}</div>
        <div className={cn("ui-cards", classes.cards)}>
          <CardsDeck size={state.decks.cards.length} card={state.board.card} />
          {state.decks.tiles.length > -1 && (
            <TilesDeck
              tile={state.board.tile}
              onClick={onTilesDeckClick}
              size={state.decks.tiles.length}
            />
          )}
        </div>
        {state.board.tile && <button onClick={onDone}>done</button>}
        {/* FIXME: <button onClick={toNextPlayer}>Next player</button> */}
      </div>
    </div>
  );
}

export default App;
