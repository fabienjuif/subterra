import { createClient } from '@fabienjuif/dynamo-client'
import { broadcast } from '@subterra/ws-utils'
import { createEngine, initState } from '@subterra/engine'

const dynamoClient = createClient()

export const dispatch = (game, userId) => async (
  state = initState(),
  actions,
) => {
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

  // if no modification does nothing
  if (engine.getState() === prevState) {
    return Promise.resolve([prevState])
  }

  // if there is modification
  return Promise.all([
    // broadcast modifications
    broadcast(game.connectionsIds, {
      type: '@server>setState',
      payload: engine.getState(),
    }),
    // update dynamo
    dynamoClient.collection('games').update({
      id: game.id,
      updatedAt: Date.now(),
      state: JSON.stringify(engine.getState()),
    }),
  ])
}
