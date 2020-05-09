import { customRandom } from 'nanoid'

export const ALPHABET =
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
export const SEED_SIZE = 10

export const getNanoid = (random) =>
  customRandom(ALPHABET, SEED_SIZE, (size) =>
    new Uint8Array(size).map(() => 256 * random()),
  )
