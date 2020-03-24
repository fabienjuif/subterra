const EndCard = { type: 'end' }
const WaterCard = { type: 'water', damage: 2, duration: 1 }
const WaterCard2 = { type: 'water', damage: 2, duration: 2 }
const GazCard = { type: 'gaz', damage: 2, duration: 1 }
const GazCard2 = { type: 'gaz', damage: 2, duration: 2 }
const LandslideCard = { type: 'landslide', damage: 3, duration: 1 }
const LandslideCard2 = { type: 'landslide', damage: 3, duration: 2 }
const ShakeCard = { type: 'shake', damage: 1, duration: 1 }
const HorrorCard = { type: 'enemy', damage: 0, duration: 1 }
const HorrorCard2 = { type: 'enemy', damage: 0, duration: 2 }

const cards = [
  EndCard,
  GazCard,
  LandslideCard2,
  ShakeCard,
  ShakeCard,
  GazCard,
  WaterCard,
  HorrorCard,
  LandslideCard,
  WaterCard,
  HorrorCard,
  WaterCard2,
  LandslideCard,
  WaterCard,
  ShakeCard,
  HorrorCard2,
  ShakeCard,
  ShakeCard,
  ShakeCard,
  GazCard,
  GazCard2,
  LandslideCard,
  WaterCard,
  LandslideCard,
  ShakeCard,
  LandslideCard,
  HorrorCard,
  WaterCard,
  GazCard,
  HorrorCard,
]

export default cards
