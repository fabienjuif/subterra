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

// TODO: test repartition
export const getRandomInArray = (array, prevSeed) => {
  const { value, nextSeed } = roll(array.length, prevSeed)
  return { value: array[Math.round(value - 1)], nextSeed }
}
