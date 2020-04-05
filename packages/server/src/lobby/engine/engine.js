import createStore from '@myrtille/mutate'
import { archetypes } from '@subterra/data'
import listeners from './listeners'

export const initState = () => ({
  archetypes,
  players: [],
  messages: [],
})

const create = (state = initState()) => {
  const store = createStore(state)

  listeners.forEach((args) => store.addListener(...args))

  return store
}

export default create
