const rotate90 = where => {
  switch (where) {
    case "left":
      return "bottom";
    case "bottom":
      return "right";
    case "right":
      return "top";
    case "top":
      return "left";
    default:
      return where;
  }
};

export const isOpen = where => tile => {
  let rotations = (tile.rotation || 0) / 90;
  let rotatedWhere = where;
  for (let i = 0; i < rotations; i += 1) {
    rotatedWhere = rotate90(rotatedWhere);
  }
  return tile[rotatedWhere];
};

// TODO: rename it (tile => cell) since it only use x/y
export const isCellsTouched = (tile1, tile2) => {
  if (tile1.x !== tile2.x && tile1.y !== tile2.y) return false;
  if (tile1.x === tile2.x && tile1.y === tile2.y) return false;
  if (Math.abs(tile1.x - tile2.x) > 1) return false;
  if (Math.abs(tile1.y - tile2.y) > 1) return false;
  return true;
};

export const getCellsBounds = cells => {
  let minX = +Infinity;
  let minY = +Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  cells.forEach(({ x, y }) => {
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  });

  return { left: minX, top: minY, right: maxX, bottom: maxY };
};

export const isCellTile = cell => !!cell.tile;

export const isCellEqual = cell1 => cell2 =>
  cell1.x === cell2.x && cell1.y === cell2.y;

export const getWrappingCells = tiles => {
  const { left, top, right, bottom } = getCellsBounds(tiles);

  const emptyCells = [];

  for (let y = top - 1; y < bottom + 2; y += 1) {
    for (let x = left - 1; x < right + 2; x += 1) {
      if (!tiles.some(tile => tile.x === x && tile.y === y)) {
        emptyCells.push({ x, y, empty: true });
      }
    }
  }

  return [
    ...emptyCells,
    ...tiles.map(tile => ({ x: tile.x, y: tile.y, empty: false, tile }))
  ];
};

export const canMoveFromTo = (from, to) => {
  if (from.y !== to.y && from.x !== to.x) return false;
  if (from.y === to.y && from.x === to.x) return false;

  if (from.y === to.y) {
    // left & right
    if (from.x < to.x) {
      if (!isOpen("right")(from) || !isOpen("left")(to)) {
        return false;
      }
    } else if (!isOpen("left")(from) || !isOpen("right")(to)) {
      return false;
    }
  } else {
    // top & bottom
    if (from.y < to.y) {
      if (!isOpen("bottom")(from) || !isOpen("top")(to)) {
        return false;
      }
    } else if (!isOpen("top")(from) || !isOpen("bottom")(to)) {
      return false;
    }
  }

  return true;
};

export const getSimpleDistanceFromTo = from => to => {
  return Math.abs(from.y - to.y) + Math.abs(from.x - to.x);
};

export const getDistanceFromTo = from => to => {
  // TODO: use A*
  return getSimpleDistanceFromTo(from)(to);
};

export const findActionsOnCell = playerCell => cell => {
  if (getDistanceFromTo(playerCell)(cell) > 1) return []
  
  const actions = [];

  if (isCellTile(cell)) {
    if (canMoveFromTo(playerCell.tile, cell.tile)) {
      actions.push({ cell, code: "move", cost: 1 });
    }
  } else {
    if (isCellsTouched(playerCell, cell)) {
      actions.push({ cell, code: "look", cost: 1 });
      actions.push({ cell, code: "explore", cost: 1 });
    }
  }

  return actions;
};

export default {
  0: {
    id: 0,
    start: true,
    top: true,
    left: true,
    bottom: true,
    right: true
  },
  1: {
    id: 1,
    end: true,
    bottom: true
  },
  2: {
    id: 2,
    left: true,
    right: true
  },
  3: {
    id: 3,
    left: true,
    bottom: true
  }
};
