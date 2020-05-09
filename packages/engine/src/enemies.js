import getClosestPath from '@fabienjuif/astar'
import { tiles } from './utils'
import { enemies as actions } from './actions'

const mapGridToAstarGraph = (grid) => {
  const graph = []

  grid.forEach((cell) => {
    if (!graph[cell.x]) graph[cell.x] = []
    if (!graph[cell.x][cell.y]) graph[cell.x][cell.y] = [cell.x, cell.y]
  })

  return graph
}

export const process = (store, action) => {
  const previousState = store.getState()
  const { grid, players } = previousState

  // find enemies
  const enemies = grid
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
  enemies.forEach((enemy) => {
    let shortestPath
    let closestPlayer

    players.forEach((player) => {
      const [status, path] = getClosestPath(
        graph,
        [enemy.x, enemy.y],
        [player.x, player.y],
        {
          heuristic: (start, end) => {
            if (
              tiles.canMoveFromTo(
                grid.find(tiles.isCellEqual({ x: start[0], y: start[1] })),
                grid.find(tiles.isCellEqual({ x: end[0], y: end[1] })),
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
        actions.move(
          enemy,
          shortestPath.map(([x, y]) => ({ x, y })),
          closestPlayer,
        ),
      )
    } else {
      store.dispatch(actions.kill(enemy))
    }
  })
}

export const move = (store, action) => {
  store.mutate((state) => {
    const previousCell = state.grid.find(
      tiles.isCellEqual(action.payload.enemy),
    )
    previousCell.status.splice(
      previousCell.status.findIndex((s) => s === 'enemy'),
      1,
    )

    const nextCell = state.grid.find(tiles.isCellEqual(action.payload.path[1]))
    nextCell.status.push('enemy')
  })
}

export const kill = (store, action) => {
  store.mutate((state) => {
    const cell = state.grid.find(tiles.isCellEqual(action.payload))
    cell.status.splice(
      cell.status.findIndex((s) => s === 'enemy'),
      1,
    )
  })
}
