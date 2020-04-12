'use strict'

Object.defineProperty(exports, '__esModule', { value: true })

function _interopDefault(ex) {
  return ex && typeof ex === 'object' && 'default' in ex ? ex['default'] : ex
}

var functions = _interopDefault(require('firebase-functions'))
var firebase = _interopDefault(require('firebase-admin'))
var express = _interopDefault(require('express'))
var bodyParser = _interopDefault(require('body-parser'))
var nanoid = require('nanoid')
var createStore = _interopDefault(require('@myrtille/mutate'))

const players = {
  damage: (player, damage, from) => ({
    type: '@players>damage',
    payload: {
      damage,
      from,
      playerId: player.id,
    },
  }),
  death: (player) => ({
    type: '@players>death',
    payload: {
      playerId: player.id,
    },
  }),
  move: (player, tile) => ({
    type: '@players>move',
    payload: {
      playerId: player.id,
      x: tile.x,
      y: tile.y,
      cost: 1, // TODO: Get this from the tile and block any action with a cost > pa
    },
  }),
  look: (player, tile) => ({
    type: '@players>look',
    payload: {
      playerId: player.id,
      x: tile.x,
      y: tile.y,
      cost: 1,
    },
  }),
  rotate: (player, rotation) => ({
    type: '@players>rotate',
    payload: {
      playerId: player.id,
      rotation,
      cost: 0,
    },
  }),
  drop: (player) => ({
    type: '@players>drop',
    payload: {
      playerId: player.id,
      cost: 0,
    },
  }),
  heal: (player, skill) => ({
    type: '@players>heal',
    payload: {
      playerId: player.id,
      cost: skill ? skill.cost : 2,
      amount: 1,
    },
  }),
}

const enemies = {
  move: (enemy, path, player) => ({
    type: '@enemies>move',
    payload: {
      enemy: {
        x: enemy.x,
        y: enemy.y,
      },
      path,
      playerId: player.id,
    },
  }),
  kill: (enemy) => ({
    type: '@enemies>kill',
    payload: {
      x: enemy.x,
      y: enemy.y,
    },
  }),
}

const roll = {
  failThen: (min, player, actionOnFail) => ({
    type: '@dices>roll',
    payload: {
      min,
      playerId: player.id,
      actionOnFail,
    },
  }),
  then: (nextAction) => ({
    type: '@dices>roll',
    payload: {
      nextAction,
    },
  }),
}

const isActionEquals = (obj1) => (obj2) => {
  return JSON.stringify(obj1) === JSON.stringify(obj2)
}

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

const nextRotation = (tile) => {
  const next = (tile.rotation || 0) + 90

  if (next === 360) return 0
  return next
}

const isOpen = (where) => (tile) => {
  let rotations = (tile.rotation || 0) / 90
  let rotatedWhere = where
  for (let i = 0; i < rotations; i += 1) {
    rotatedWhere = rotate90(rotatedWhere)
  }
  return tile[rotatedWhere]
}

// TODO: rename it (tile => cell) since it only use x/y
const isCellsTouched = (tile1, tile2) => {
  if (tile1.x !== tile2.x && tile1.y !== tile2.y) return false
  if (tile1.x === tile2.x && tile1.y === tile2.y) return false
  if (Math.abs(tile1.x - tile2.x) > 1) return false
  if (Math.abs(tile1.y - tile2.y) > 1) return false
  return true
}

const getCellsBounds = (cells) => {
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

const isCellTile = (cell) => !!cell.tile

const isCellEqual = (cell1) => (cell2) =>
  cell1.x === cell2.x && cell1.y === cell2.y

const getWrappingCells = (tiles) => {
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

const canMoveFromTo = (from, to) => {
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

const getSimpleDistanceFromTo = (from) => (to) => {
  return Math.abs(from.y - to.y) + Math.abs(from.x - to.x)
}

const getDistanceFromTo = (from) => (to) => {
  // TODO: use A*
  //      care of tile cost
  return getSimpleDistanceFromTo(from)(to)
}

const findActionsOnCell = (player, playerTile) => (cell) => {
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

const init = (store, action) => {
  store.mutate((state) => {
    state.deckCards = action.payload
  })
}

const pick = (store, action) => {
  store.mutate((state) => {
    if (state.deckCards.length > 0) {
      state.activeCard = state.deckCards.shift()
    }
  })

  const nextState = store.getState()
  const { type: cardType } = nextState.activeCard
  if (['shake', 'water', 'gaz', 'enemy', 'end'].includes(cardType)) {
    store.dispatch({
      type: `@cards>${cardType}`,
      payload: { card: nextState.activeCard },
    })
  } else if (cardType === 'landslide') {
    store.dispatch(roll.then({ type: '@cards>landslide' }))
  }
}

const end = (store, action) => {
  store.getState().players.forEach((player) => {
    if (player.health <= 0) return

    store.dispatch(
      roll.failThen(
        3,
        player,
        players.damage(player, 1000, {
          from: { card: action.payload.card },
        }),
      ),
    )
  })
}

const shake = (store, action) => {
  const previousState = store.getState()

  previousState.players.forEach((player) => {
    store.dispatch(
      roll.failThen(
        4,
        player,
        players.damage(player, previousState.activeCard.damage, {
          card: previousState.activeCard,
        }),
      ),
    )
  })
}

const landslide = (store, action) => {
  const { activeCard } = store.getState()

  // find all tiles that are landslide and match the dice result
  // tile should not be already in the landslide status
  // add the status 'landslide' to these tiles
  // and for each of these tiles, check a player is in it and damage it in this case
  store.mutate((state) => {
    state.grid.forEach((tile) => {
      const { type, status, dices } = tile

      if (type !== 'landslide') return
      if (status.includes('landslide')) return
      if (!dices.includes(action.payload.rolled)) return

      tile.status.push('landslide')

      state.players.forEach((player) => {
        if (!isCellEqual(player)(tile)) return

        store.dispatch(
          players.damage(player, activeCard.damage, {
            card: activeCard,
          }),
        )
      })
    })
  })
}

const processMarkerCard = (store, action) => {
  const { card } = action.payload

  // find all tiles that have water type and put a status on it
  // if it do not already exists
  // if a player is in this tile then it take damage
  store.mutate((state) => {
    state.grid.forEach((tile) => {
      const { type, status } = tile

      if (type !== card.type) return
      if (status.includes(card.type)) return

      tile.status.push(card.type)

      state.players.forEach((player) => {
        if (!isCellEqual(player)(tile)) return

        store.dispatch(
          players.damage(player, card.damage, {
            card,
          }),
        )
      })
    })
  })
}

const players$1 = {
  findById: (state, action) => {
    return state.players.find(({ id }) => id === action.payload.playerId)
  },
}

const init$1 = (store, action) => {
  store.mutate((state) => {
    state.dices = action.payload
  })
}

const roll$1 = (store, action) => {
  let value
  store.mutate((state) => {
    value = state.dices.shift()
  })

  store.dispatch({
    type: '@dices>rolled',
    payload: {
      ...action.payload,
      value,
    },
  })
}

const checkAndDispatch = (store, action) => {
  let { value } = action.payload
  if (action.payload.min === undefined) {
    store.dispatch({
      ...action.payload.nextAction,
      payload: {
        ...action.payload.nextAction.payload,
        rolled: value,
      },
    })
    return
  }

  const prevState = store.getState()
  const player = players$1.findById(prevState, action)
  if (player && player.skills.some(({ type }) => type === 'experienced')) {
    value += 1
  }

  if (value < action.payload.min) {
    if (action.payload.actionOnFail) {
      store.dispatch(action.payload.actionOnFail)
    }
  } else {
    if (action.payload.actionOnSuccess) {
      store.dispatch(action.payload.actionOnSuccess)
    }
  }
}

// https://fr.wikipedia.org/wiki/Algorithme_A*
// A* Search Algorithm

// node: [x, y, cost, h, parentNode]

function identity(o) {
  return o
}
function sortNodes(node1, node2) {
  if (node1[3] > node2[3]) return 1
  if (node1[3] < node2[3]) return -1
  return 0
}
function getFinalPath(end) {
  if (!end[4]) return [end.slice(0, 3)]
  return [...getFinalPath(end[4]), end.slice(0, 3)]
}
function defaultSameNode(node1, node2) {
  return node1[0] === node2[0] && node1[1] === node2[1]
}

function defaultGetNeighbours(graph, node, { mapNode = identity } = {}) {
  const neighbours = []

  // left
  let next = graph[node[0] - 1] && graph[node[0] - 1][node[1]]
  if (next) neighbours.push(mapNode(next))

  // right
  next = graph[node[0] + 1] && graph[node[0] + 1][node[1]]
  if (next) neighbours.push(mapNode(next))

  // top
  next = graph[node[0]][node[1] - 1]
  if (next) neighbours.push(mapNode(next))

  // bottom
  next = graph[node[0]][node[1] + 1]
  if (next) neighbours.push(mapNode(next))

  return neighbours
}

function defaultDistance(node, end) {
  const x = end[0] - node[0]
  const y = end[1] - node[1]

  return x * x + y * y
}

var astar = function getClosestPath(
  graph,
  start,
  end,
  {
    sameNode = defaultSameNode,
    mapGraph = identity,
    mapNode = identity,
    getNeighbours = defaultGetNeighbours,
    distance = defaultDistance,
    heuristic = () => 1,
    maxLoops = Infinity,
  } = {},
) {
  const mappedGraph = mapGraph(
    [...graph].map((row) => [...row].map((cell) => [...cell])),
  )
  const closedList = []
  const openList = []

  openList.push(mapNode(start).concat(0))

  let loop = -1
  while (openList.length > 0 && loop++ < maxLoops) {
    const current = openList.shift()

    if (current[2] === Infinity) {
      return [-2, [], loop]
    }

    if (sameNode(current, end)) {
      return [0, getFinalPath(current), loop]
    }

    const neighbours = getNeighbours(mappedGraph, current, { mapNode })
    for (let i = 0; i < neighbours.length; i += 1) {
      const neighbour = neighbours[i]
      const known = neighbour[2] !== undefined

      if (closedList.find((n) => sameNode(n, neighbour))) continue

      const newCost =
        (current[2] || 0) +
        heuristic(current.slice(0, 2), neighbour.slice(0, 2))

      if (known && neighbour[2] < newCost) continue

      neighbour[2] = newCost
      neighbour[3] = neighbour[2] + distance(neighbour, end)
      neighbour[4] = current
      if (!known) openList.push(neighbour)
      openList.sort(sortNodes)
    }

    closedList.push(current)
  }

  if (loop >= maxLoops) {
    return [1, getFinalPath(openList[0]), loop]
  }

  return [-1, [], loop]
}

const mapGridToAstarGraph = (grid) => {
  const graph = []

  grid.forEach((cell) => {
    if (!graph[cell.x]) graph[cell.x] = []
    if (!graph[cell.x][cell.y]) graph[cell.x][cell.y] = [cell.x, cell.y]
  })

  return graph
}

const process = (store, action) => {
  const previousState = store.getState()
  const { grid, players } = previousState

  // find enemies
  const enemies$1 = grid
    .filter(({ status }) => status.includes('enemy'))
    // if there is multiple enemies on the same tile we duplicates tiles
    // for the rest of the function
    .flatMap((tile) =>
      Array.from({
        length: tile.status.filter((s) => s === 'enemy').length,
      }).map(() => tile),
    )

  // map grid to a star graph
  const graph = mapGridToAstarGraph(grid)

  // for each enemy get the closest player
  // - get all path from enemy to each player
  // - get the shortest path
  // *  if the closest enemy is at more than 7 tiles, the enemy is dead (TODO:)
  // *  if the shortest path is shared between multiple player
  //    the enemy move toward the player with the lesser strengh
  enemies$1.forEach((enemy) => {
    let shortestPath
    let closestPlayer

    players.forEach((player) => {
      const [status, path] = astar(
        graph,
        [enemy.x, enemy.y],
        [player.x, player.y],
        {
          heuristic: (start, end) => {
            if (
              canMoveFromTo(
                grid.find(isCellEqual({ x: start[0], y: start[1] })),
                grid.find(isCellEqual({ x: end[0], y: end[1] })),
              )
            )
              return 1
            return Infinity
          },
        },
      )

      if (status === 0) {
        if (!shortestPath || path.length === shortestPath.length) {
          if (!closestPlayer || closestPlayer.strength > player.strength) {
            shortestPath = path
            closestPlayer = player
          }
        } else if (path.length < shortestPath.length) {
          shortestPath = path
          closestPlayer = player
        }
      }
    })

    if (shortestPath && shortestPath.length > 1 && shortestPath.length < 7) {
      store.dispatch(
        enemies.move(
          enemy,
          shortestPath.map(([x, y]) => ({ x, y })),
          closestPlayer,
        ),
      )
    } else {
      store.dispatch(enemies.kill(enemy))
    }
  })
}

const move = (store, action) => {
  store.mutate((state) => {
    const previousCell = state.grid.find(isCellEqual(action.payload.enemy))
    previousCell.status.splice(
      previousCell.status.findIndex((s) => s === 'enemy'),
      1,
    )

    const nextCell = state.grid.find(isCellEqual(action.payload.path[1]))
    nextCell.status.push('enemy')
  })
}

const kill = (store, action) => {
  store.mutate((state) => {
    const cell = state.grid.find(isCellEqual(action.payload))
    cell.status.splice(
      cell.status.findIndex((s) => s === 'enemy'),
      1,
    )
  })
}

const checkLoose = (store, action) => {
  const prevState = store.getState()

  if (!prevState.players.some(({ health }) => health > 0)) {
    store.mutate((state) => {
      state.gameOver = 'loose'
    })
  }
}

const checkWin = (store, action) => {
  const prevState = store.getState()

  const outCell = prevState.grid.find(({ type }) => type === 'end')
  if (!outCell) return

  const playersOut = prevState.players.filter(isCellEqual(outCell))
  const deadPlayers = prevState.players.filter(({ health }) => health <= 0)

  if (deadPlayers.length + playersOut.length !== prevState.players.length) {
    return
  }

  store.mutate((state) => {
    state.gameOver =
      deadPlayers.length < prevState.players.length / 3 ? 'win' : 'loose'
  })
}

const pass = (store, action) => {
  const previousState = store.getState()
  const firstPlayerIndex = previousState.players.findIndex(({ first }) => first)
  const currentPlayerIndex = previousState.players.findIndex(
    ({ current }) => current,
  )

  const getNextIndex = (current) => {
    const next = current + 1
    if (next >= previousState.players.length) {
      return 0
    }
    return next
  }

  const nextCurrentPlayerIndex = getNextIndex(currentPlayerIndex)

  const turnEnd = firstPlayerIndex === nextCurrentPlayerIndex

  store.mutate((state) => {
    state.players[currentPlayerIndex].current = false

    if (turnEnd) {
      state.players.forEach((player, index) => {
        player.actionPoints = 2
      })

      const nextFirstPlayerIndex = getNextIndex(firstPlayerIndex)
      state.players[nextFirstPlayerIndex].current = true
      state.players[nextFirstPlayerIndex].first = true
      state.players[firstPlayerIndex].first = false
    } else {
      state.players[nextCurrentPlayerIndex].current = true
    }
  })

  if (turnEnd) store.dispatch('@turn>start')
}

const move$1 = (store, action) => {
  store.mutate((state) => {
    if (!state.playerActions.possibilities.some(isActionEquals(action))) return

    const player = players$1.findById(state, action)

    player.actionPoints = Math.max(0, player.actionPoints - action.payload.cost)
    player.x = action.payload.x
    player.y = action.payload.y
  })
}

const look = (store, action) => {
  store.mutate((state) => {
    if (!state.playerActions.possibilities.some(isActionEquals(action))) return

    const player = players$1.findById(state, action)
    const playerTile = state.grid.find(isCellEqual(player))

    // TODO: Should take the first tile of the deck Tile
    const tile = {
      x: action.payload.x,
      y: action.payload.y,
      right: true,
      bottom: true,
      left: true,
      status: [],
      rotation: 0,
    }

    player.actionPoints = Math.max(0, player.actionPoints - action.payload.cost)
    state.playerActions.tile = tile

    state.playerActions.possibilities = [players.rotate(player, 90)]

    if (canMoveFromTo(playerTile, tile))
      state.playerActions.possibilities.push(players.drop(player))
  })
}

const rotate = (store, action) => {
  store.mutate((state) => {
    if (!state.playerActions.possibilities.some(isActionEquals(action))) return

    const player = players$1.findById(state, action)
    const playerTile = state.grid.find(isCellEqual(player))
    const rotatedTile = {
      ...state.playerActions.tile,
      rotation: action.payload.rotation,
    }

    state.playerActions.tile = rotatedTile
    state.playerActions.possibilities = [
      players.rotate(player, nextRotation(rotatedTile)),
    ]

    if (canMoveFromTo(playerTile, rotatedTile))
      state.playerActions.possibilities.push(players.drop(player))
  })
}

const drop = (store, action) => {
  store.mutate((state) => {
    if (!state.playerActions.possibilities.some(isActionEquals(action))) return

    state.grid.push(state.playerActions.tile)
    state.playerActions.tile = undefined
  })
}

const findPossibilities = (store, action) => {
  store.mutate((state) => {
    const player = state.players.find(({ current }) => current)
    state.playerActions.possibilities = []

    if (player.actionPoints === 0 || player.health === 0) return // TODO: We should add excess in another PR by filter all actions once they are created

    const tile = state.grid.find(isCellEqual(player))
    const playersOnCell = state.players.filter(isCellEqual(player))

    // based actions
    // TODO: clear / climb / etc
    let commonActions = [
      // - heal
      ...playersOnCell
        // some health is missing
        .filter(({ health, archetype }) => health < archetype.health)
        // map it to an action
        .map((currentPlayer) => players.heal(currentPlayer)), // TODO: We should add excess in another PR by filter all actions once they are created
    ]

    // actions on cells
    const cells = getWrappingCells(state.grid)
    const findPlayerActionsOnCell = findActionsOnCell(player, tile)
    const cellsActions = cells.flatMap(findPlayerActionsOnCell)

    // actions based on skills
    const skillsActions = []
    // - heal
    if (player.skills.some(({ type }) => type === 'heal')) {
      // this is already processed in common actions, we just lower the cost
      commonActions = commonActions.map((currAction) => {
        if (currAction.type !== '@players>heal') return currAction
        if (currAction.payload.playerId === player.id) return currAction
        return {
          ...currAction,
          payload: {
            ...currAction.payload,
            cost: player.skills.find(({ type }) => type === 'heal').cost, // TODO: We should add excess in another PR by filter all actions once they are created
          },
        }
      })
    }

    state.playerActions.possibilities = [
      ...commonActions,
      ...skillsActions,
      ...cellsActions,
    ]
  })
}

const damage = (store, action) => {
  const prevState = store.getState()
  const playerIndex = prevState.players.findIndex(
    ({ id }) => id === action.payload.playerId,
  )
  const prevPlayer = prevState.players[playerIndex]

  const findProtect = (skill) => skill.type === 'protect'

  // if the player does not have protect skill
  // we try to find someone who has one the same tile
  if (!prevPlayer.skills.some(findProtect)) {
    const withProtect = prevState.players.find(
      (player) =>
        isCellEqual(player)(prevPlayer) &&
        player.health > 0 &&
        player.skills.some(findProtect),
    )

    if (withProtect) {
      store.dispatch({
        type: '@players>protected',
        payload: {
          playerId: action.payload.playerId,
          protectedBy: withProtect.id,
        },
      })

      return
    }
  }

  // no one to protect the player, it takes damage
  store.mutate((state) => {
    const player = state.players[playerIndex]
    player.health = Math.max(0, player.health - action.payload.damage)

    if (player.health <= 0) {
      store.dispatch(players.death(player))
    }
  })
}

const init$2 = (store, action) => {
  store.mutate((state) => {
    state.players = action.payload.map((player) => ({
      ...player,
      id: player.type, // type is unique for now and we can replace it by an UUID when needed.
      x: 0,
      y: 0,
      actionPoints: 2,
    }))
    state.players[0].current = true
    state.players[0].first = true
  })
}

const heal = (store, action) => {
  const prevState = store.getState()

  if (!prevState.playerActions.possibilities.some(isActionEquals(action))) {
    return
  }

  store.mutate((state) => {
    const player = players$1.findById(state, action)
    player.health = Math.min(
      player.health + action.payload.amount,
      player.archetype.health,
    )
    player.actionPoints = Math.max(0, player.actionPoints - action.payload.cost)
  })
}

var listeners = [
  // initializations
  ['@players>init', init$2],
  ['@players>init', findPossibilities],
  ['@cards>init', init],
  // game going on
  ['@players>pass', pass],
  ['@players>pass', findPossibilities],
  ['@players>look', look],
  ['@players>rotate', rotate],
  ['@players>drop', drop],
  ['@players>drop', findPossibilities],
  ['@players>damage', damage],
  ['@turn>start', checkWin],
  ['@turn>start', (store) => store.dispatch('@cards>pick')],
  ['@turn>start', (store) => store.dispatch('@enemies>process')],
  ['@players>move', move$1],
  ['@players>move', findPossibilities],
  ['@players>heal', heal],
  ['@cards>pick', pick],
  ['@cards>shake', shake],
  ['@cards>landslide', landslide],
  ['@cards>water', processMarkerCard],
  ['@cards>gaz', processMarkerCard],
  ['@cards>enemy', processMarkerCard],
  ['@cards>end', end],
  ['@players>death', checkLoose],
  ['@enemies>kill', kill],
  ['@enemies>process', process],
  ['@enemies>move', move],
  // "random"
  ['@dices>init', init$1],
  ['@dices>roll', roll$1],
  ['@dices>rolled', checkAndDispatch],
]

const initState = () => ({
  gameOver: undefined, // 'loose' | 'win'
  players: [],
  enemies: [],
  deckTiles: { length: 10 }, // should be an array in a futur iteration
  deckCards: [],
  dices: [],
  activeCard: {}, // should be an array in a futur iteration
  grid: [
    {
      ...tiles[0],
      x: 0,
      y: 0,
      status: [
        /* gaz, water, landslide, etc */
      ],
    },
  ],
  playerActions: {
    tile: undefined,
    possibilities: [], // known possible actions for the current player
  },
  technical: {
    actions: [],
  },
})

const saveAction = (store, action) => {
  const { actions } = store.getState().technical || {}

  if (!actions) return

  store.mutate((state) => {
    state.technical.actions.push(action)
  })
}

var createEngine = (state = initState()) => {
  // creating store
  let store = createStore(state)

  // adding all game listeners
  listeners.forEach((args) => store.addListener(...args))

  // adding an action listener to save them all
  store.addListener(saveAction)

  // adding utility
  store.reset = () => store.setState(state)

  return store
}

const create = (firestore) => async (playerDoc) => {
  // create a new game
  const gameId = nanoid.nanoid()
  await firestore
    .collection('games')
    .doc(gameId)
    .set({
      id: gameId,
      createdAt: new Date(Date.now()),
      state: JSON.parse(JSON.stringify(createEngine().getState())),
    })

  await playerDoc.ref.set(
    {
      gameId,
    },
    { merge: true },
  )

  // TODO: for all players unset lobby

  return gameId
}

// TODO: should be exceptions
const dispatch = (firestore) => async (playerDoc, action) => {
  const player = playerDoc.data()
  if (!player.gameId) {
    console.warn('Game does not exist on player', player.uid)
    return
  }

  const gameDoc = await firestore.collection('games').doc(player.gameId).get()
  if (!gameDoc.exists) {
    console.warn('Game does not exist on id', player.gameId)
    console.warn('\tremoving its reference on player', player.uid)
    await playerDoc.ref.update({
      gameId: firestore.FieldValue.delete(),
    })

    return
  }

  const { state } = gameDoc.data()
  const engine = createEngine(state)
  engine.dispatch(action)
  await gameDoc.ref.update({
    state: JSON.parse(JSON.stringify(engine.getState())),
  })
}

var archetypes = [
  {
    type: 'medic',
    health: 3,
    strength: 6,
    skills: [
      {
        type: 'heal',
        perGame: Infinity,
        perTurn: Infinity,
        cost: 1,
      },
      {
        type: 'sprint',
        perGame: Infinity,
        perTurn: Infinity,
        cost: 1,
      },
    ],
  },
  {
    type: 'geologist',
    health: 3,
    strength: 3,
    skills: [
      {
        type: 'intuition',
        perGame: Infinity,
        perTurn: Infinity,
        cost: 0,
      },
      {
        type: 'clear',
        perGame: Infinity,
        perTurn: Infinity,
        cost: 1,
      },
    ],
  },
  {
    type: 'scoot',
    health: 3,
    strength: 2,
    skills: [
      {
        type: 'guide',
        cost: 0,
        perGame: 3,
        perTurn: Infinity,
      },
      {
        type: 'furtivity',
        cost: 0,
        perGame: Infinity,
        perTurn: Infinity,
      },
    ],
  },
  {
    type: 'diver',
    health: 3,
    strength: 1,
    skills: [
      {
        type: 'dive',
        cost: 2,
        perGame: Infinity,
        perTurn: Infinity,
      },
      {
        type: 'amphibious',
        cost: 0,
        perGame: Infinity,
        perTurn: Infinity,
      },
    ],
  },
  {
    type: 'bodyguard',
    health: 5,
    strength: 7,
    skills: [
      {
        type: 'repulse',
        cost: 1,
        perGame: Infinity,
        perTurn: Infinity,
      },
      {
        type: 'protect',
        cost: 0,
        perGame: Infinity,
        perTurn: Infinity,
      },
    ],
  },
  {
    type: 'chef',
    health: 3,
    strength: 8,
    skills: [
      {
        type: 'lead',
        cost: 1,
        perGame: Infinity,
        perTurn: 1,
      },
      {
        type: 'experienced',
        cost: 0,
        perGame: Infinity,
        perTurn: Infinity,
      },
    ],
  },
  {
    type: 'engineer',
    health: 3,
    strength: 4,
    skills: [
      {
        type: 'demolish',
        cost: 2,
        perTurn: Infinity,
        perGame: 3,
      },
      {
        type: 'careful',
        cost: 0,
        perGame: Infinity,
        perTurn: Infinity,
      },
    ],
  },
  {
    type: 'climber',
    health: 5,
    strength: 5,
    skills: [
      {
        type: 'ensure',
        cost: 1,
        perTurn: Infinity,
        perGame: Infinity,
      },
      {
        type: 'agile',
        cost: 0,
        perTurn: Infinity,
        perGame: Infinity,
      },
    ],
  },
]

const addMessage = (store, action) => {
  store.mutate((state) => {
    state.messages.push(action.payload)
  })
}

const addPlayer = (store, action) => {
  const prevState = store.getState()
  if (prevState.players.some(({ id }) => id === action.payload.id)) return

  store.mutate((state) => {
    state.players.push(action.payload)
  })
}

const removePlayer = (store, action) => {
  const prevState = store.getState()
  const playerIndex = prevState.players.findIndex(
    ({ id }) => id === action.payload.id,
  )

  if (playerIndex < 0) return

  store.mutate((state) => {
    const player = state.players[playerIndex]
    if (player.type) {
      state.archetypes.push(archetypes.find(({ type }) => type === player.type))
    }
    state.players.splice(playerIndex, 1)
  })
}

const setArchetype = (store, action) => {
  const prevState = store.getState()

  const archetypeIndex = prevState.archetypes.findIndex(
    ({ type }) => type === action.payload.archetypeType,
  )
  if (archetypeIndex < 0) return
  const archetype = prevState.archetypes[archetypeIndex]

  store.mutate((state) => {
    const player = state.players.find(({ id }) => id === action.userId)
    if (!player) return

    // free up the older archetype
    if (player.type) {
      state.archetypes.push(archetypes.find(({ type }) => type === player.type))
    }

    Object.assign(player, archetype, { archetype })

    state.archetypes.splice(archetypeIndex, 1)
  })
}

var listeners$1 = [
  ['@message>add', addMessage],
  ['@players>add', addPlayer],
  ['@players>remove', removePlayer],
  ['@players>setArchetype', setArchetype],
]

const initState$1 = () => ({
  archetypes,
  players: [],
  messages: [],
})

const create$1 = (state = initState$1()) => {
  const store = createStore(state)

  listeners$1.forEach((args) => store.addListener(...args))

  return store
}

const create$2 = (firestore) => async (playerDoc) => {
  // create a new lobby
  const player = playerDoc.data()
  const lobbyId = nanoid.nanoid()
  const engine = create$1()
  engine.dispatch({
    type: '@players>add',
    payload: {
      id: player.userId,
      name: player.pseudo || player.name,
    },
  })

  await firestore
    .collection('lobby')
    .doc(lobbyId)
    .set({
      lobbyId,
      createdAt: new Date(Date.now()),
      state: JSON.parse(JSON.stringify(engine.getState())),
    })

  await playerDoc.ref.update({
    lobbyId,
  })

  return lobbyId
}

const join = (firestore) => async (playerDoc, lobbyId) => {
  const lobbyDoc = await firestore.collection('lobby').doc(lobbyId).get()

  if (!lobbyDoc.exists) {
    const error = new Error('Lobby does not exist')
    error.code = 'LOBBY_NOT_FOUND'
    error.lobbyId = lobbyId
    throw error
  }

  const { state } = lobbyDoc.data()
  if (!state || state.players.length > 6) {
    const error = new Error('Lobby is full')
    error.code = 'LOBBY_FULL'
    error.lobbyId = lobbyId
    throw error
  }

  const player = playerDoc.data()
  const engine = create$1(state)
  engine.dispatch({
    type: '@players>add',
    payload: {
      id: player.userId,
      name: player.pseudo || player.name,
    },
  })

  await lobbyDoc.ref.update({
    state: JSON.parse(JSON.stringify(engine.getState())),
  })

  await playerDoc.ref.update({
    lobbyId,
  })

  return lobbyId
}

const dispatch$1 = (firestore) => async (playerDoc, action) => {
  const player = playerDoc.data()
  if (!player.lobbyId) {
    console.warn('Lobby does not exist on player', player.uid)
    return
  }

  const lobbyDoc = await firestore.collection('lobby').doc(player.lobbyId).get()
  if (!lobbyDoc.exists) {
    console.warn('Lobby does not exist on id', player.lobbyId)
    console.warn('\tremoving its reference on player', player.userId)
    await playerDoc.ref.update({
      lobbyId: firestore.FieldValue.delete(),
    })

    return
  }

  const { state } = lobbyDoc.data()
  const engine = create$1(state)
  engine.dispatch({ ...action, userId: player.userId })
  await lobbyDoc.ref.update({
    state: JSON.parse(JSON.stringify(engine.getState())),
  })
}

firebase.initializeApp()
const firestore = firebase.firestore()
const app = express()

app.use(bodyParser.json())
app.use(async (req, res, next) => {
  const idToken = (req.headers.authorization || '').replace('Bearer ', '')
  const { uid } = await firebase.auth().verifyIdToken(idToken, true)
  let playerRef = firestore.collection('players').doc(uid)
  const playerDoc = await playerRef.get()
  if (!playerDoc.exists) {
    const error = new Error('User is not known')
    error.uid = uid
    next(error)
    return
  }

  req.playerDoc = playerDoc

  next()
})

app.post('/lobby', async (req, res) => {
  const player = req.playerDoc.data()
  if (player.gameId) {
    res.send({
      id: player.gameId,
      type: 'game',
    })

    return
  }

  const lobbyId = player.lobbyId || (await create$2(firestore)(req.playerDoc))

  res.send({
    id: lobbyId,
    type: 'lobby',
  })
})

app.post('/lobby/join', async (req, res) => {
  const player = req.playerDoc.data()
  if (player.gameId) {
    res.send({
      id: player.gameId,
      type: 'game',
    })

    return
  }

  const lobbyId =
    player.lobbyId || (await join(firestore)(req.playerDoc, req.body.id))

  res.send({
    id: lobbyId,
    type: 'lobby',
  })
})

app.post('/lobby/start', async (req, res) => {
  const player = req.playerDoc.data()
  const gameId = player.gameId || (await create(firestore)(req.playerDoc))

  res.send({
    id: gameId,
    type: 'game',
  })
})

app.post('/lobby/dispatch', async (req, res) => {
  await dispatch$1(firestore)(req.playerDoc, req.body)

  res.sendStatus(200)
})

app.post('/game/dispatch', async (req, res) => {
  await dispatch(firestore)(req.playerDoc, req.body)

  res.sendStatus(200)
})

const api = functions.region('europe-west1').https.onRequest(app)

exports.api = api
