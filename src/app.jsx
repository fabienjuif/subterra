import React, { useState, useEffect, useCallback } from "react";
import cn from "classnames";
import { useImmerReducer } from "use-immer";
import Grid from "./components/grid";
import Player from "./components/ui/player";
import CardsDeck from "./components/cardsDeck";
import { getWrappingCells, isCellEqual } from "./utils/tiles";
import { game, initState } from "./engine";
import classes from "./app.module.scss";

function App() {
  const [state, dispatch] = useImmerReducer(game, initState());
  const [cells, setCells] = useState([]);

  useEffect(() => {
    dispatch({ type: "ON_INIT_PLAYER" });
  }, [dispatch]);

  useEffect(() => {
    let cells = getWrappingCells(state.board.tiles);

    cells = cells.map(cell => ({
      ...cell,
      actions: state.actions.filter(action => isCellEqual(action.cell)(cell))
    }));

    setCells(cells);
  }, [state.board.tiles, state.actions]);

  const onAction = useCallback(
    action => {
      if (action.code === "done") {
        dispatch({ type: "ON_DONE" });
      } else if (action.code === "rotate") {
        dispatch({ type: "ON_ROTATE_TILE" });
      } else {
        dispatch({ type: "ON_ACTION", payload: action });
      }
    },
    [dispatch]
  );

  if (state.players.length === 0) return null;

  return (
    <div className={cn("app", classes.app)}>
      <div className={cn("ui-players", classes.players)}>
        {state.players.map(player => (
          <Player key={player.id} {...player} />
        ))}
      </div>
      <div className={cn("ui-grid", classes.grid)}>
        <Grid
          onAction={onAction}
          cells={cells}
          players={state.players}
          nextTile={state.board.tile}
        />
      </div>
      <div>
        <div>turn: {state.turn}</div>
        <div>tiles: {state.decks.tiles.length}</div>
        <div className={cn("ui-cards", classes.cards)}>
          <CardsDeck size={state.decks.cards.length} card={state.board.card} />
        </div>
        {/* FIXME: <button onClick={toNextPlayer}>Next player</button> */}
      </div>
    </div>
  );
}

export default App;
