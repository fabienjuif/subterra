import { players } from '../actions'

const rotate90 = (where) => {
  switch (where) {
    case 'left':
      return 'bottom'
    case 'bottom':
      return 'right'
    case 'right':
      return 'top'
    case 'top':
      return 'left'
    default:
      return where
  }
}

export const nextRotation = (tile) => {
  const next = (tile.rotation || 0) + 90

  if (next === 360) return 0
  return next
}

export const isOpen = (where) => (tile) => {
  let rotations = (tile.rotation || 0) / 90
  let rotatedWhere = where
  for (let i = 0; i < rotations; i += 1) {
    rotatedWhere = rotate90(rotatedWhere)
  }
  return tile[rotatedWhere]
}

// TODO: rename it (tile => cell) since it only use x/y
export const isCellsTouched = (tile1, tile2) => {
  if (tile1.x !== tile2.x && tile1.y !== tile2.y) return false
  if (tile1.x === tile2.x && tile1.y === tile2.y) return false
  if (Math.abs(tile1.x - tile2.x) > 1) return false
  if (Math.abs(tile1.y - tile2.y) > 1) return false
  return true
}

export const getCellsBounds = (cells) => {
  let minX = +Infinity
  let minY = +Infinity
  let maxX = -Infinity
  let maxY = -Infinity

  cells.forEach(({ x, y }) => {
    minX = Math.min(minX, x)
    minY = Math.min(minY, y)
    maxX = Math.max(maxX, x)
    maxY = Math.max(maxY, y)
  })

  return { left: minX, top: minY, right: maxX, bottom: maxY }
}

export const isCellTile = (cell) => !!cell.tile

export const isCellEqual = (cell1) => (cell2) =>
  cell1.x === cell2.x && cell1.y === cell2.y

export const getWrappingCells = (tiles) => {
  const { left, top, right, bottom } = getCellsBounds(tiles)

  const emptyCells = []

  for (let y = top - 1; y < bottom + 2; y += 1) {
    for (let x = left - 1; x < right + 2; x += 1) {
      if (!tiles.some((tile) => tile.x === x && tile.y === y)) {
        emptyCells.push({ x, y, empty: true })
      }
    }
  }

  return [
    ...emptyCells,
    ...tiles.map((tile) => ({ x: tile.x, y: tile.y, empty: false, tile })),
  ]
}

export const canMoveFromTo = (from, to) => {
  if (from.y !== to.y && from.x !== to.x) return false
  if (from.y === to.y && from.x === to.x) return false

  if (from.y === to.y) {
    // left & right
    if (from.x < to.x) {
      if (!isOpen('right')(from) || !isOpen('left')(to)) {
        return false
      }
    } else if (!isOpen('left')(from) || !isOpen('right')(to)) {
      return false
    }
  } else {
    // top & bottom
    if (from.y < to.y) {
      if (!isOpen('bottom')(from) || !isOpen('top')(to)) {
        return false
      }
    } else if (!isOpen('top')(from) || !isOpen('bottom')(to)) {
      return false
    }
  }

  return true
}

export const getSimpleDistanceFromTo = (from) => (to) => {
  return Math.abs(from.y - to.y) + Math.abs(from.x - to.x)
}

export const getDistanceFromTo = (from) => (to) => {
  // TODO: use A*
  //      care of tile cost
  return getSimpleDistanceFromTo(from)(to)
}

export const findActionsOnCell = (player, playerTile) => (cell) => {
  if (getDistanceFromTo(playerTile)(cell) > 1) return []

  const actions = []

  if (isCellTile(cell)) {
    if (canMoveFromTo(playerTile, cell.tile)) {
      actions.push(players.move(player, cell.tile))
    }
  } else {
    // create a fake tile that is opened everywhere
    // so we can test we can go to this fake tile
    const fakeOpenTile = {
      ...cell,
      top: true,
      left: true,
      bottom: true,
      right: true,
    }
    if (
      isCellsTouched(playerTile, cell) &&
      canMoveFromTo(playerTile, fakeOpenTile)
    ) {
      actions.push(players.look(player, fakeOpenTile))
      //actions.push({ cell, code: 'explore', cost: 1 })
    }
  }

  return actions
}

const tiles = [
  {
    id: 0,
    type: 'start',
    top: true,
    left: true,
    bottom: true,
    right: true,
  },
  {
    id: 1,
    type: 'end',
    bottom: true,
  },
  {
    id: 2,
    type: 'gaz',
    top: true,
    right: true,
  },
  {
    id: 3,
    type: 'water',
    top: true,
    bottom: true,
  },
  {
    id: 4,
    top: true,
    bottom: true,
  },
  {
    id: 5,
    type: 'water',
    top: true,
    left: true,
    bottom: true,
    right: true,
  },
  {
    id: 6,
    type: 'landslide',
    dices: [3, 6],
    top: true,
    right: true,
  },
  {
    id: 7,
    type: 'landslide',
    dices: [3, 2],
    top: true,
    right: true,
    left: true,
  },
  {
    id: 8,
    type: 'landslide',
    dices: [6, 2],
    top: true,
    right: true,
  },
  {
    id: 9,
    top: true,
    left: true,
    bottom: true,
    right: true,
  },
  {
    id: 10,
    type: 'water',
    left: true,
    top: true,
    right: true,
  },
  {
    id: 11,
    top: true,
    bottom: true,
  },
  {
    id: 12,
    type: 'enemy',
    top: true,
  },
  {
    id: 13,
    type: 'tight',
    top: true,
    bottom: true,
  },
  {
    id: 14,
    top: true,
  },
  {
    id: 15,
    top: true,
    right: true,
  },
  {
    id: 16,
    type: 'fall',
    top: true,
    bottom: true,
  },
  {
    id: 17,
    type: 'water',
    top: true,
    left: true,
    bottom: true,
    right: true,
  },
  {
    id: 18,
    type: 'landslide',
    dices: [6, 1],
    top: true,
    right: true,
    left: true,
  },
  {
    id: 19,
    top: true,
    right: true,
  },
  {
    id: 20,
    type: 'block',
    top: true,
    bottom: true,
  },
  {
    id: 21,
    type: 'enemy',
    top: true,
  },
  {
    id: 22,
    top: true,
    left: true,
    bottom: true,
    right: true,
  },
  {
    id: 23,
    top: true,
    right: true,
  },
  {
    id: 24,
    top: true,
    right: true,
    left: true,
  },
  {
    id: 25,
    top: true,
    left: true,
    bottom: true,
    right: true,
  },
  {
    id: 26,
    type: 'damage',
    top: true,
    left: true,
    bottom: true,
    right: true,
  },
  {
    id: 27,
    type: 'gaz',
    top: true,
    right: true,
  },
  {
    id: 28,
    type: 'enemy',
    top: true,
  },
  {
    id: 29,
    type: 'gaz',
    top: true,
    right: true,
    left: true,
  },
  {
    id: 30,
    type: 'damage',
    top: true,
    left: true,
    bottom: true,
    right: true,
  },
  {
    id: 31,
    type: 'water',
    top: true,
    bottom: true,
  },
  {
    id: 32,
    type: 'block',
    top: true,
    bottom: true,
  },
  {
    id: 33,
    type: 'water',
    top: true,
    bottom: true,
  },
  {
    id: 34,
    type: 'gaz',
    top: true,
    right: true,
  },
  {
    id: 35,
    top: true,
    right: true,
    left: true,
  },
  {
    id: 36,
    type: 'block',
    top: true,
    bottom: true,
  },
  {
    id: 37,
    type: 'tight',
    top: true,
    bottom: true,
  },
  {
    id: 38,
    type: 'fall',
    top: true,
    bottom: true,
  },
  {
    id: 39,
    type: 'enemy',
    top: true,
  },
  {
    id: 40,
    type: 'gaz',
    top: true,
    right: true,
  },
  {
    id: 41,
    type: 'fall',
    top: true,
    bottom: true,
  },
  {
    id: 42,
    type: 'landslide',
    dices: [3, 5],
    top: true,
    right: true,
    left: true,
  },
  {
    id: 43,
    type: 'landslide',
    dices: [4, 5],
    top: true,
    right: true,
    left: true,
  },
  {
    id: 44,
    type: 'water',
    top: true,
    right: true,
    left: true,
  },
  {
    id: 45,
    type: 'landslide',
    dices: [3, 1],
    top: true,
    right: true,
    left: true,
  },
  {
    id: 46,
    type: 'gaz',
    top: true,
    right: true,
    left: true,
  },
  {
    id: 47,
    type: 'gaz',
    top: true,
    right: true,
  },
  {
    id: 48,
    top: true,
    right: true,
  },
  {
    id: 49,
    type: 'water',
    top: true,
    bottom: true,
  },
  {
    id: 50,
    type: 'landslide',
    top: true,
    right: true,
  },
  {
    id: 51,
    type: 'enemy',
    top: true,
  },
  {
    id: 52,
    top: true,
  },
  {
    id: 53,
    type: 'tight',
    top: true,
    bottom: true,
  },
  {
    id: 54,
    type: 'landslide',
    dices: [4, 6],
    top: true,
    right: true,
    left: true,
  },
  {
    id: 55,
    type: 'landslide',
    top: true,
    left: true,
    right: true,
  },
  {
    id: 56,
    type: 'enemy',
    top: true,
  },
  {
    id: 57,
    top: true,
    bottom: true,
  },
  {
    id: 58,
    type: 'landslide',
    dices: [1, 5],
    top: true,
    right: true,
  },
  {
    id: 59,
    type: 'enemy',
    top: true,
    right: true,
  },
  {
    id: 60,
    top: true,
    bottom: true,
  },
  {
    id: 61,
    type: 'gaz',
    top: true,
    right: true,
  },
  {
    id: 62,
    type: 'enemy',
    top: true,
    right: true,
  },
  {
    id: 63,
    type: 'landslide',
    dices: [2, 5],
    top: true,
    right: true,
    left: true,
  },
  {
    id: 64,
    top: true,
    right: true,
    left: true,
  },
]

export default tiles
