import { createClient } from '@subterra/dynamodb'
import { broadcast } from '@subterra/ws-utils'
import createEngine, { initState } from './engine'

const dynamoClient = createClient()

export const dispatch = (lobby, userId) => async (
  state = initState(),
  actions,
) => {
  // save prevState to make sure not to send a state that did not change
  let prevState = typeof state === 'string' ? JSON.parse(state) : state
  prevState.id = lobby.id

  // dispatch actions
  const engine = createEngine(prevState)
  ;[].concat(actions).forEach((action) =>
    engine.dispatch({
      ...action,
      userId,
    }),
  )

  // if no midification does nothing
  if (engine.getState() === prevState) {
    return Promise.resolve([prevState])
  }

  // if there is modification
  return Promise.all([
    // broadcast modifications
    broadcast(
      lobby.connectionsIds,
      JSON.stringify({
        type: '@server>setState',
        payload: engine.getState(),
      }),
    ),
    // update dynamo
    dynamoClient.collection('lobby').update({
      id: lobby.id,
      state: JSON.stringify(engine.getState()),
    }),
  ])
}
