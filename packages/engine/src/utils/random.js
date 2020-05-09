import { customRandom } from 'nanoid'
import seedRandom from 'seedrandom'

const rand = (prevSeed) => {
  if (!prevSeed) {
    const error = new Error('prevSeed must be given')
    error.code = 'bad_arguments'
    error.prevSeed = prevSeed
    throw error
  }

  const random = seedRandom(prevSeed)
  const value = random()
  return {
    value,
    nextSeed: prevSeed.split('@@')[0] + '@@' + value,
  }
}

export const roll = (number, prevSeed) => {
  const { value, nextSeed } = rand(prevSeed)
  return {
    value: Math.floor(value * number) + 1,
    nextSeed,
  }
}

export const roll6 = (prevSeed) => roll(6, prevSeed)

export const getRandomInArray = (array, prevSeed) => {
  const { value, nextSeed } = roll(array.length, prevSeed)
  return { value: array[Math.round(value - 1)], nextSeed }
}

export const ALPHABET =
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
export const SEED_SIZE = 10

export const getNanoid = (random) =>
  customRandom(ALPHABET, SEED_SIZE, (size) =>
    new Uint8Array(size).map(() => 256 * random()),
  )
