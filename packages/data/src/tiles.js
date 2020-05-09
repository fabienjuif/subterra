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
export const CrossTile = {
  id: 'r-R-BTC0H4OmyFDBPQJuT',
  name: 'cross tile',
  top: true,
  right: true,
  bottom: true,
  left: true,
}
export const EdgeTile = {
  id: 'I-NRDVCDl7CSP7fV5FxDY',
  name: 'edge tile',
  top: true,
  right: true,
  bottom: true,
}
export const CornerTile = {
  id: 'HN0w_Pav5wh_s5d2PEp_A',
  name: 'corner tile',
  top: true,
  right: true,
}
export const AlleyTile = {
  id: 'yA-tGd1qwHzfb2VhStf2B',
  name: 'alley tile',
  top: true,
  bottom: true,
}
export const DeadEndTile = {
  id: 'hglerRhkulhXcf09fT_qP',
  name: 'dead end tile',
  top: true,
}

// Special Tiles
export const StartTile = {
  ...CrossTile,
  ...StartType,
  name: 'start tile',
  id: 'QqyB-54vIKWS3s4ku7j5Y',
}
export const FinalTile = {
  ...DeadEndTile,
  ...EndType,
  name: 'final tile',
  id: 'XuLC14NjlAStWpwJCoSxf',
}

export const CrossGazTile = {
  ...CrossTile,
  ...GazType,
  name: 'cross gaz tile',
  id: '4l3VAOjuxqkceyiML4Iwa',
}
export const EdgeGazTile = {
  ...EdgeTile,
  ...GazType,
  name: 'edge gaz tile',
  id: 'S7Z47I_FFW-ZSumM8aiJ5',
}
export const CornerGazTile = {
  ...CornerTile,
  ...GazType,
  name: 'corner gaz tile',
  id: 'Pfn8vlHx1b51VsiNIyScj',
}
export const AlleyGazTile = {
  ...AlleyTile,
  ...GazType,
  name: 'alley gaz tile',
  id: '45-EbI8thaUszH0kxRvxz',
}

export const CrossWaterTile = {
  ...CrossTile,
  ...WaterType,
  name: 'cross water tile',
  id: 'nzisSEndGakUiAuzfIFVF',
}
export const EdgeWaterTile = {
  ...EdgeTile,
  ...WaterType,
  name: 'edge water tile',
  id: 'iODsx23TbApGvJhFyWqMM',
}
export const CornerWaterTile = {
  ...CornerTile,
  ...WaterType,
  name: 'corner water tile',
  id: '3pOTTBzG404X5InJ7IhdM',
}
export const AlleyWaterTile = {
  ...AlleyTile,
  ...WaterType,
  name: 'allezy water tile',
  id: 'KB6PqUfbLZ9UE4QBu-Fne',
}

const CrossLandslideTile = {
  ...CrossTile,
  ...LandslideType,
}
const EdgeLandslideTile = {
  ...EdgeTile,
  ...LandslideType,
}
const CornerLandslideTile = {
  ...CornerTile,
  ...LandslideType,
}

export const DeadEndEnemyTile = {
  ...DeadEndTile,
  ...EnemyType,
  name: 'dead end enemy tile',
  id: 'vn0_eykg1uHmW0OVYokBz',
}
export const CornerEnemyTile = {
  ...CornerTile,
  ...EnemyType,
  name: 'corner enemy tile',
  id: '_wbDKHo0T69uSO1qclmqj',
}
export const AlleyTightTile = {
  ...AlleyTile,
  ...TightType,
  name: 'allezy tight tile',
  id: 'euBLqqryDfNyrUV3eqh1D',
}
export const AlleyFallTile = {
  ...AlleyTile,
  ...FallType,
  name: 'alley fall tile',
  id: 'xNjLi8WCXxaBCRQvdLTas',
}
export const AlleyBlockTile = {
  ...AlleyTile,
  ...BlockType,
  name: 'alley block tile',
  id: 'EfssmBj1Gg0i3zAKKlSGQ',
}
export const CrossDamageTile = {
  ...CrossTile,
  ...DamageType,
  name: 'cross damage tile',
  id: 'GL3wvjvDRUNq13upLe29u',
}
export const CornerLandslideTile36 = {
  ...CornerLandslideTile,
  dices: [3, 6],
  name: 'corner landslide tile 3 & 6',
  id: 'yyrTb2mLi7-wsaCgTOjZF',
}
export const EdgeLandslideTile23 = {
  ...EdgeLandslideTile,
  dices: [2, 3],
  name: 'edge landslide tile 2 & 3',
  id: 'lDAh6cMuKRibgfFqpkcza',
}
export const CornerLandslideTile26 = {
  ...CornerLandslideTile,
  dices: [2, 6],
  name: 'corner landslide tile 2 & 6',
  id: '7-ieW8glNb79icRDk1K1W',
}
export const EdgeLandslideTile16 = {
  ...EdgeLandslideTile,
  dices: [1, 6],
  name: 'edge landslide tile 1 & 6',
  id: '2CTuGVylqs7ejWFoLHsiw',
}
export const EdgeLandslideTile35 = {
  ...EdgeLandslideTile,
  dices: [3, 5],
  name: 'edge landslide tile 3 & 5',
  id: '8d2V4rOPI-kIkAx5s583p',
}
export const EdgeLandslideTile45 = {
  ...EdgeLandslideTile,
  dices: [4, 5],
  name: 'edge landslide tile 4 & 5',
  id: 'AeEQazY4QCBBb3Kt_yQuU',
}
export const EdgeLandslideTile13 = {
  ...EdgeLandslideTile,
  dices: [1, 3],
  name: 'edge landslide tile 1 & 3',
  id: 'aYbJvk_Vrwx0OFFMBmn22',
}
export const CornerLandslideTile12 = {
  ...CornerLandslideTile,
  dices: [1, 2],
  name: 'corner landslide tile 1 & 2',
  id: 'HwfQuoy7wU70-8cXVzqN9',
}
export const EdgeLandslideTile46 = {
  ...EdgeLandslideTile,
  dices: [4, 6],
  name: 'edge landslide tile 4 & 6',
  id: '7LxK3CZ1NHamA7-N3LodL',
}
export const EdgeLandslideTile25 = {
  ...EdgeLandslideTile,
  dices: [2, 5],
  name: 'edge landslide tile 2 & 5',
  id: '9EnpHW_Gd2I7y_OLVrcCy',
}
export const CornerLandslideTile15 = {
  ...CornerLandslideTile,
  dices: [1, 5],
  name: 'corner landslide tile 1 & 5',
  id: 'L0nblDzgW3Q4P6-zffoqG',
}

export default [
  CornerGazTile,
  AlleyWaterTile,
  AlleyTile,
  CrossWaterTile,
  CornerLandslideTile36,
  EdgeLandslideTile23,
  CornerLandslideTile26,
  CrossTile,
  EdgeWaterTile,
  AlleyTile,
  DeadEndEnemyTile,
  AlleyTightTile,
  DeadEndTile,
  CornerTile,
  AlleyFallTile,
  CrossWaterTile,
  EdgeLandslideTile16,
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
  EdgeLandslideTile35,
  EdgeLandslideTile45,
  EdgeWaterTile,
  EdgeLandslideTile13,
  EdgeGazTile,
  CornerGazTile,
  CornerTile,
  AlleyWaterTile,
  CornerLandslideTile12,
  DeadEndEnemyTile,
  DeadEndTile,
  AlleyTightTile,
  EdgeLandslideTile46,
  EdgeLandslideTile25,
  DeadEndEnemyTile,
  AlleyTile,
  CornerLandslideTile15,
  CornerEnemyTile,
  AlleyTile,
  CornerGazTile,
  CornerEnemyTile,
  EdgeLandslideTile25,
  EdgeTile,
]
