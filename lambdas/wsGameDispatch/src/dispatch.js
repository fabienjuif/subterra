import { omit } from 'lodash'
import { createClient } from '@fabienjuif/dynamo-client'
import { broadcast } from '@subterra/ws-utils'
import { createEngine, initState } from '@subterra/engine'
import { setState } from './setState'

const dynamoClient = createClient()

export const dispatch = (game, userId) => async (
  state = initState(),
  actions,
) => {
  const games = dynamoClient.collection('games')
  const wsConnections = dynamoClient.collection('wsConnections')

  // save prevState to make sure not to send a state that did not change
  let prevState = typeof state === 'string' ? JSON.parse(state) : state
  prevState.id = game.id

  // dispatch actions
  const engine = createEngine(prevState)
  ;[].concat(actions).forEach((action) =>
    engine.dispatch({
      ...action,
      userId,
    }),
  )
  const newState = engine.getState()

  // closure to broadcast new state
  const broadcastState = () =>
    broadcast(game.connectionsIds, setState(newState))

  // if this is game over clean up all states
  if (newState.gameOver) {
    return Promise.all([
      broadcastState(),
      // remove gameId from connectionsIds (user are not in "game" state)
      // but we keep game row in dynamo so we can do some stats
      ...game.connectionsIds.map((id) =>
        wsConnections.update({
          id,
          lobbyId: undefined,
          gameId: undefined,
          updatedAt: Date.now(),
        }),
      ),
    ])
  }

  // if no modification does nothing
  if (newState === prevState) {
    return Promise.resolve([prevState])
  }

  // if there is modification
  return Promise.all([
    broadcastState(),
    // update dynamo
    games.update({
      id: game.id,
      updatedAt: Date.now(),
      state: JSON.stringify(newState),
    }),
  ])
}
