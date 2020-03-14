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
  console.log({ tile, rotations, rotatedWhere, where })
  return tile[rotatedWhere];
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
    bottom: true,
  },
  2: {
    id: 2,
    left: true,
    right: true
  },
  3: {
    id: 3,
    left: true,
    bottom: true,
  }
};
