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

export const isTilesTouched = (tile1, tile2) =>
  Math.abs(tile1.y - tile2.y) <= 1 && Math.abs(tile1.x - tile2.x) <= 1;

export const canMoveFromTo = (from, to) => {
  // control than we can move
  if (from.y !== to.y && from.x !== to.x) return false;
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

  return true
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
