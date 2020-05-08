import seedRandom from 'seedrandom'
import { customRandom } from 'nanoid'

const ALPHABET =
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
const SEED_SIZE = 10

export const init = (store, action) => {
  if (!action.payload.master) {
    const error = new Error('Master seed must be given')
    error.code = 'bad_parameters'
    error.missing = ['action.payload.master']
    throw error
  }

  const masterRandom = seedRandom(action.payload.master)
  const masterNanoid = customRandom(ALPHABET, SEED_SIZE, (size) => {
    return new Uint8Array(size).map(() => 256 * masterRandom())
  })

  const defaultDicesSeed = masterNanoid()
  const dices = action.payload.dices || defaultDicesSeed

  store.mutate((state) => {
    state.seeds = {
      ...action.payload,
      private:
        action.payload.private === undefined ? false : action.payload.private,
      dices,
      dicesNext: dices,
    }
  })
}
