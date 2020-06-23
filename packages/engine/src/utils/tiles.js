import getClosestPath from '@fabienjuif/astar'
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

export const mapGridToAstarGraph = (grid) => {
  const graph = []

  grid.forEach((cell) => {
    if (!graph[cell.x]) graph[cell.x] = []
    if (!graph[cell.x][cell.y]) graph[cell.x][cell.y] = [cell.x, cell.y]
  })

  return graph
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

export const findActionsOnCell = (player, playerTile, grid) => (cell) => {
  const actions = []

  if (isCellTile(cell)) {
    // if simple distance is greater than the max we can move, we just can't do anything
    if (getSimpleDistanceFromTo(playerTile)(cell) > 3) return []

    // in other cases we get the real distance between the cell and the player
    const [status, path] = getClosestPath(
      mapGridToAstarGraph(grid),
      [cell.x, cell.y],
      [playerTile.x, playerTile.y],
      {
        heuristic: (start, end) => {
          if (
            canMoveFromTo(
              grid.find(isCellEqual({ x: start[0], y: start[1] })),
              grid.find(isCellEqual({ x: end[0], y: end[1] })),
            )
          ) {
            return 1
          }

          return Infinity
        },
      },
    )

    // no path or same cell
    if (status !== 0 || path.length <= 1) return []

    if (path.length === 2) {
      actions.push(players.move(player, cell.tile))
    } else if (path.length <= 4) {
      actions.push(players.run(player, cell.tile))
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
      canMoveFromTo(playerTile, fakeOpenTile) // TODO: use distance instead of canMoveFrom to, since distance check everything with A*
    ) {
      actions.push(players.look(player, fakeOpenTile))
      // FIXME: actions.push({ cell, code: 'explore', cost: 1 })
    }
  }

  return actions
}
