export const roll6 = () => 1 + Math.round(Math.random() * 5)

export const getRandomInArray = (array) =>
  array[Math.round(Math.random() * (array.length - 1))]

export const roll = (number) => 1 + Math.round(Math.random() * (number - 1))
