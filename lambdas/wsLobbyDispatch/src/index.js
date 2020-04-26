import { createClient } from '@fabienjuif/dynamo-client'
import { create } from './create'
import { dispatch } from './dispatch'
import { webSocketNotFound, userNotInLobby } from './errors'
import { getState } from './getState'
import { join } from './join'
import { leave } from './leave'
import { start } from './start'

const dynamoClient = createClient()

export const handler = async (event) => {
  const { requestContext, body } = event
  const { connectionId } = requestContext

  const action = JSON.parse(body)
  console.log(connectionId, JSON.stringify(action, null, 2))

  const wsConnections = dynamoClient.collection('wsConnections')
  const lobbyCollection = dynamoClient.collection('lobby')

  return (async () => {
    const wsConnection = await wsConnections.get(connectionId, [
      'id',
      'lobbyId',
      'userId',
    ])
    if (!wsConnection) return webSocketNotFound(connectionId)

    if (action.type === '@lobby>create')
      return create(wsConnection, connectionId)
    if (action.type === '@lobby>join') {
      return join(wsConnection, action.payload.id)
    }
    if (!wsConnection.lobbyId) return userNotInLobby(connectionId)

    const lobby = await lobbyCollection.get(wsConnection.lobbyId, [
      'id',
      'state',
      'connectionsIds',
    ])

    if (action.type === '@lobby>getState') {
      return getState(connectionId, lobby.state)
    }
    if (action.type === '@lobby>leave') {
      return leave(wsConnection, lobby)
    }
    if (action.type == '@lobby>start') {
      return start(wsConnection, lobby)
    }

    // use engine in all other cases
    return dispatch(lobby, wsConnection.userId)(lobby.state, action)
  })().then(
    () => ({ statusCode: 200 }),
    (err) => {
      console.trace(err)
      return { statusCode: 500, err }
    },
  )
}
