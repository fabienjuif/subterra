import { createClient } from '@fabienjuif/dynamo-client'
import { dispatch } from './dispatch'
import { webSocketNotFound, userNotInGame, gameNotFound } from './errors'
import { getState } from './getState'
import { createEngine } from '@subterra/engine'

const dynamoClient = createClient()

export const handler = async (event) => {
  const { requestContext, body } = event
  const { connectionId } = requestContext

  const action = JSON.parse(body)
  console.log(connectionId, JSON.stringify(action, null, 2))

  const wsConnections = dynamoClient.collection('wsConnections')
  const games = dynamoClient.collection('games')

  return (async () => {
    const wsConnection = await wsConnections.get(connectionId, [
      'id',
      'gameId',
      'userId',
    ])
    if (!wsConnection) return webSocketNotFound(connectionId)
    if (!wsConnection.gameId) return userNotInGame(connectionId)

    const game = await games.get(wsConnection.gameId, [
      'id',
      'initState',
      'actions',
      'connectionsIds',
    ])
    if (!game) return gameNotFound(connectionId, wsConnection.gameId)

    // replay actions on top of the current state
    const engine = createEngine(JSON.parse(game.initState))
    game.actions.forEach((action) => engine.dispatch(JSON.parse(action)))
    const state = engine.getState()

    if (action.type === '@game>getState') {
      return getState(connectionId, state)
    }

    // use engine in all other cases
    return dispatch(game, wsConnection.userId)(engine, action)
  })().then(
    () => ({ statusCode: 200 }),
    (err) => {
      console.trace(err)
      return { statusCode: 500, err }
    },
  )
}
