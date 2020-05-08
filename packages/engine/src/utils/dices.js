import seedRandom from 'seedrandom'

export const rand = (prevSeed) => {
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

export const getRandomInArray = (array) =>
  array[Math.round(Math.random() * (array.length - 1))]

export const roll = (number, prevSeed) => {
  const { value, nextSeed } = rand(prevSeed)
  return {
    value: Math.floor(value * number) + 1,
    nextSeed,
  }
}

export const roll6 = (prevSeed) => roll(6, prevSeed)
