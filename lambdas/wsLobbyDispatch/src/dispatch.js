import AWS from 'aws-sdk'
import { broadcast } from '@subterra/ws-utils'
import createEngine, { initState } from './engine'

AWS.config.update({ region: 'eu-west-3' })
const docClient = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' })

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
          ':state': JSON.stringify(engine.getState()),
        },
      })
      .promise(),
  ])
}
