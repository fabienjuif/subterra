import AWS from 'aws-sdk'
import { nanoid } from 'nanoid'
import { broadcast } from '@subterra/ws-utils'
import create from './engine'

AWS.config.update({ region: 'eu-west-3' })
const docClient = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' })

const WS_API_ENDPOINT =
  'https://iv082u46jh.execute-api.eu-west-3.amazonaws.com/beta'

const api = new AWS.ApiGatewayManagementApi({ endpoint: WS_API_ENDPOINT })

const sendError = async (connectionId, error) => {
  console.error(error)

  await api
    .postToConnection({
      ConnectionId: connectionId,
      Data: JSON.stringify({
        type: '@server>error',
        payload: error,
      }),
    })
    .promise()

  const err = new Error(error.message)
  err.error = error
  throw err
}

const dispatch = (lobby, userId) => async (state, actions) => {
  // dispatch actions
  const engine = create(state)
  ;[].concat(actions).forEach((action) =>
    engine.dispatch({
      ...action,
      userId,
    }),
  )
  const newState = { ...engine.getState(), id: lobby.id }

  return await Promise.all([
    // broadcast new state
    broadcast(
      lobby.connectionsIds,
      JSON.stringify({ type: '@server>setState', payload: newState }),
    ),
    // update dynamo
    docClient
      .update({
        TableName: 'lobby',
        Key: {
          id: lobby.id,
        },
        UpdateExpression: 'set #s = :state',
        ExpressionAttributeNames: {
          '#s': 'state',
        },
        ExpressionAttributeValues: {
          ':state': JSON.stringify(newState),
        },
      })
      .promise(),
  ])
}

export const handler = async (event) => {
  const { requestContext, body } = event
  const { connectionId } = requestContext

  const action = JSON.parse(body)
  console.log(connectionId, JSON.stringify(action, null, 2))

  const { Item: wsConnection } = await docClient
    .get({
      TableName: 'wsConnections',
      Key: {
        id: connectionId,
      },
      ProjectionExpression: 'id, lobbyId, userId',
    })
    .promise()

  if (!wsConnection) {
    return sendError(connectionId, {
      code: 'websocket_not_found',
      message: 'Websocket was not found',
      connectionId,
    })
  }

  if (action.type === '@lobby>create') {
    if (wsConnection.lobbyId) {
      return sendError(connectionId, {
        code: 'already_in_lobby',
        message: 'user is already in a lobby',
        lobbyId: wsConnection.lobbyId,
        userId: wsConnection.userId,
        connectionId,
      })
    }

    const lobbyId = nanoid()
    const lobby = {
      id: lobbyId,
      connectionsIds: [connectionId],
      state: JSON.stringify({ ...create(), id: lobbyId }),
    }
    const [{ Item: user }] = await Promise.all([
      // get the user (to have its pseudo)
      docClient
        .get({
          TableName: 'users',
          Key: {
            id: wsConnection.userId,
          },
          ProjectionExpression: 'pseudo',
        })
        .promise(),

      // create new lobby
      docClient
        .put({
          TableName: 'lobby',
          Item: lobby,
        })
        .promise(),

      // update wsConnection to match this new lobbyId
      docClient
        .update({
          TableName: 'wsConnections',
          Key: {
            id: connectionId,
          },
          UpdateExpression: 'set lobbyId = :lobbyId',
          ExpressionAttributeValues: {
            ':lobbyId': lobby.id,
          },
        })
        .promise(),
    ])

    // add the user to the lobby
    await dispatch(lobby, wsConnection.userId)(undefined, {
      type: '@players>add',
      payload: { name: user.pseudo },
    })
  } else {
    if (!wsConnection.lobbyId) {
      return sendError(connectionId, {
        code: 'user_not_in_lobby_state',
        message: 'the user is not in a lobby state',
        connectionId,
      })
    }

    const { Item: lobby } = await docClient
      .get({
        TableName: 'lobby',
        Key: {
          id: wsConnection.lobbyId,
        },
        ProjectionExpression: 'id, #s, connectionsIds',
        // we have to do this because state is reserved...
        ExpressionAttributeNames: {
          '#s': 'state',
        },
      })
      .promise()

    if (action.type === '@lobby>getState') {
      await api
        .postToConnection({
          ConnectionId: connectionId,
          Data: JSON.stringify({
            type: '@server>setState',
            payload: JSON.parse(lobby.state),
          }),
        })
        .promise()
    } else {
      await dispatch(lobby, wsConnection.userId)(
        JSON.parse(lobby.state),
        action,
      )
    }
  }

  return {
    statusCode: 200,
  }
}
