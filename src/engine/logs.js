import { v4 as uuid } from 'uuid'

export const push = (store, action) => {
  store.mutate((state) => {
    state.logs.push({ ...action.payload, id: uuid(), timestamp: new Date() })
  })
}
