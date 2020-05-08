export const getRandomInArray = (array) =>
  array[Math.round(Math.random() * (array.length - 1))]

export const roll = (number) => Math.floor(Math.random() * number) + 1

export const roll6 = () => roll(6)
