import { sendError } from './sendError'

export const webSocketNotFound = (connectionId) =>
  sendError(connectionId, {
    code: 'websocket_not_found',
    message: 'Websocket was not found',
    connectionId,
  })

export const userNotInGame = (connectionId) =>
  sendError(connectionId, {
    code: 'user_not_in_game_state',
    message: 'the user is not in a game state',
    connectionId,
  })

export const gameNotFound = (connectionId, gameId) =>
  sendError(connectionId, {
    code: 'game_not_found',
    message: 'the game is not found',
    connectionId,
    gameId,
  })
