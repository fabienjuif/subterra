export const EndCard = {
  type: 'end',
  id: 'hKyJQmhBBSgFdJkZStisD',
}
export const WaterCard = {
  type: 'water',
  damage: 2,
  duration: 1,
  name: 'water',
  id: 'jVjrsEynaxHyQ0o2bn3F5',
}
export const WaterCard2 = {
  type: 'water',
  damage: 2,
  duration: 2,
  name: 'water 2',
  id: 'mQsb0CISJMDosYAl1y9bK',
}
export const GazCard = {
  type: 'gaz',
  damage: 2,
  duration: 1,
  name: 'gaz',
  id: '3KNfiVS61yBJ2lE26OR0N',
}
export const GazCard2 = {
  type: 'gaz',
  damage: 2,
  duration: 2,
  name: 'gaz 2',
  id: '0vK8Hw4hKFPRGf76BB7Nl',
}
export const LandslideCard = {
  type: 'landslide',
  damage: 3,
  duration: 1,
  name: 'landslide',
  id: 'XQeHmlrBzuZTpt2SXvVZe',
}
export const LandslideCard2 = {
  type: 'landslide',
  damage: 3,
  duration: 2,
  name: 'landslide 2',
  id: 'MxWpXeRkxDUK20CdwGpqD',
}
export const ShakeCard = {
  type: 'shake',
  damage: 1,
  duration: 1,
  name: 'shake',
  id: '1sKrNtKjjrYkrSDdmWkYy',
}
export const HorrorCard = {
  type: 'enemy',
  damage: 3,
  duration: 1,
  name: 'horror',
  id: 'Xk0FDZpwRm2re3Uox5Qg4',
}
export const HorrorCard2 = {
  type: 'enemy',
  damage: 3,
  duration: 2,
  name: 'horror 2',
  id: 'RVdgxn0bohDJuePSe8Na7',
}

const cards = [
  { card: GazCard, remaining: 4 },
  { card: HorrorCard, remaining: 4 },
  { card: LandslideCard, remaining: 5 },
  { card: ShakeCard, remaining: 7 },
  { card: WaterCard, remaining: 5 },
  { card: GazCard2, remaining: 1 },
  { card: HorrorCard2, remaining: 1 },
  { card: LandslideCard2, remaining: 1 },
  { card: WaterCard2, remaining: 1 },
]

export default cards
