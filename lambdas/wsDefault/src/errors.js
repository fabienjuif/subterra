import { sendError } from './sendError'

export const webSocketNotFound = (connectionId) =>
  sendError(connectionId, {
    code: 'websocket_not_found',
    message: 'Websocket was not found',
    connectionId,
  })
