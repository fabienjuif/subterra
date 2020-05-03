// Type
const StartType = { type: 'start' }
const EndType = { type: 'end' }
const GazType = { type: 'gaz' }
const WaterType = { type: 'water' }
const LandslideType = { type: 'landslide' }
const EnemyType = { type: 'enemy' }
const TightType = { type: 'tight' }
const FallType = { type: 'fall' }
const BlockType = { type: 'block' }
const DamageType = { type: 'damage' }

// Normal Tiles
export const CrossTile = { top: true, right: true, bottom: true, left: true }
export const EdgeTile = { top: true, right: true, bottom: true }
export const CornerTile = { top: true, right: true }
export const AlleyTile = { top: true, bottom: true }
export const DeadEndTile = { top: true }

// Special Tiles
export const StartTile = { ...CrossTile, ...StartType }
export const FinalTile = { ...DeadEndTile, ...EndType }

export const CrossGazTile = { ...CrossTile, ...GazType }
export const EdgeGazTile = { ...EdgeTile, ...GazType }
export const CornerGazTile = { ...CornerTile, ...GazType }
export const AlleyGazTile = { ...AlleyTile, ...GazType }

export const CrossWaterTile = { ...CrossTile, ...WaterType }
export const EdgeWaterTile = { ...EdgeTile, ...WaterType }
export const CornerWaterTile = { ...CornerTile, ...WaterType }
export const AlleyWaterTile = { ...AlleyTile, ...WaterType }

export const CrossLandslideTile = { ...CrossTile, ...LandslideType }
export const EdgeLandslideTile = { ...EdgeTile, ...LandslideType }
export const CornerLandslideTile = { ...CornerTile, ...LandslideType }
export const AlleyLandslideTile = { ...AlleyTile, ...LandslideType }

export const DeadEndEnemyTile = { ...DeadEndTile, ...EnemyType }
export const CornerEnemyTile = { ...CornerTile, ...EnemyType }
export const AlleyTightTile = { ...AlleyTile, ...TightType }
export const AlleyFallTile = { ...AlleyTile, ...FallType }
export const AlleyBlockTile = { ...AlleyTile, ...BlockType }
export const CrossDamageTile = { ...CrossTile, ...DamageType }

export default [
  StartTile,
  FinalTile,
  CornerGazTile,
  AlleyWaterTile,
  AlleyTile,
  CrossWaterTile,
  { ...CornerLandslideTile, dices: [3, 6] },
  { ...EdgeLandslideTile, dices: [2, 3] },
  { ...CornerLandslideTile, dices: [2, 6] },
  CrossTile,
  EdgeWaterTile,
  AlleyTile,
  DeadEndEnemyTile,
  AlleyTightTile,
  DeadEndTile,
  CornerTile,
  AlleyFallTile,
  CrossWaterTile,
  { ...EdgeLandslideTile, dices: [1, 6] },
  CornerTile,
  AlleyBlockTile,
  DeadEndEnemyTile,
  CrossTile,
  CornerTile,
  EdgeTile,
  CrossTile,
  CrossDamageTile,
  AlleyGazTile,
  DeadEndEnemyTile,
  EdgeGazTile,
  CrossDamageTile,
  AlleyWaterTile,
  AlleyBlockTile,
  AlleyWaterTile,
  CornerGazTile,
  EdgeTile,
  AlleyBlockTile,
  AlleyTightTile,
  AlleyFallTile,
  DeadEndEnemyTile,
  CornerGazTile,
  AlleyFallTile,
  { ...EdgeLandslideTile, dices: [3, 5] },
  { ...EdgeLandslideTile, dices: [4, 5] },
  EdgeWaterTile,
  { ...EdgeLandslideTile, dices: [1, 3] },
  EdgeGazTile,
  CornerGazTile,
  CornerTile,
  AlleyWaterTile,
  { ...CornerLandslideTile, dices: [1, 2] },
  DeadEndEnemyTile,
  DeadEndTile,
  AlleyTightTile,
  { ...EdgeLandslideTile, dices: [4, 6] },
  { ...EdgeLandslideTile, dices: [2, 5] },
  DeadEndEnemyTile,
  AlleyTile,
  { ...CornerLandslideTile, dices: [1, 5] },
  CornerEnemyTile,
  AlleyTile,
  CornerGazTile,
  CornerEnemyTile,
  { ...EdgeLandslideTile, dices: [2, 5] },
  EdgeTile,
]
