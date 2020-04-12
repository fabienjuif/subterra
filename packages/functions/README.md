# firebase cloud functions

## api

| endpoint                   | description                                                                             |
| -------------------------- | --------------------------------------------------------------------------------------- |
| `POST /api/lobby`          | Create or join a lobby, if a gameis already attached to the player, returns the game id |
| `POST /api/lobby/start`    | Start the game for the current lobby attached to the player                             |
| `POST /api/lobby/dispatch` | Dispatch an action to the lobby attached to the player                                  |
| `POST /api/game/dispatch`  | Dispatch an action to the game attached to the player                                   |
