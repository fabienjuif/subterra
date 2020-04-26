import { sendError } from './sendError'

export const alreadyInLobby = (connectionId, infos) =>
  sendError(connectionId, {
    ...infos,
    code: 'already_in_lobby',
    message: 'user is already in a lobby',
  })

export const webSocketNotFound = (connectionId) =>
  sendError(connectionId, {
    code: 'websocket_not_found',
    message: 'Websocket was not found',
    connectionId,
  })

export const userNotInLobby = (connectionId) =>
  sendError(connectionId, {
    code: 'user_not_in_lobby_state',
    message: 'the user is not in a lobby state',
    connectionId,
  })
