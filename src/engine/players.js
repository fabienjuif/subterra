import { isActionEquals, players } from './actions'
import {
  isCellEqual,
  getWrappingCells,
  findActionsOnCell,
  canMoveFromTo,
} from '../utils/tiles'

export const pass = (store, action) => {
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

export const move = (store, action) => {
  store.mutate((state) => {
    if (!state.playerActions.possibilities.some(isActionEquals(action))) return

    const player = state.players.find(
      ({ name }) => name === action.payload.playerName,
    )

    player.actionPoints = Math.max(0, player.actionPoints - action.payload.cost)
    player.x = action.payload.x
    player.y = action.payload.y
  })
}

export const look = (store, action) => {
  store.mutate((state) => {
    if (!state.playerActions.possibilities.some(isActionEquals(action))) return

    const player = state.players.find(
      ({ name }) => name === action.payload.playerName,
    )
    const playerTile = state.grid.find(isCellEqual(player))

    // TODO: Should take the first tile of the deck Tile
    const tile = {
      x: action.payload.x,
      y: action.payload.y,
      top: true,
      right: true,
      bottom: true,
      left: true,
      status: [],
      rotation: 0,
    }

    player.actionPoints = Math.max(0, player.actionPoints - action.payload.cost)
    state.playerActions.tile = tile

    state.playerActions.possibilities = [
      players.rotate(player, tile, nextRotation(tile)),
    ]

    if (canMoveFromTo(playerTile, tile))
      state.playerActions.possibilities.push(
        players.drop(action.payload.playerName, tile),
      )
  })
}

export const rotate = (store, action) => {
  store.mutate((state) => {
    if (!state.playerActions.possibilities.some(isActionEquals(action))) return

    const rotatedTile = {
      ...action.payload.tile,
      rotation: action.payload.rotation,
    }

    state.playerActions.tile = rotatedTile
    state.playerActions.possibilities = [
      players.rotate(player, rotatedTile, nextRotation(rotatedTile)),
    ]

    if (canMoveFromTo(playerTile, rotatedTile))
      state.playerActions.possibilities.push(
        players.drop(action.payload.playerName, rotatedTile),
      )
  })
}

export const drop = (store, action) => {
  store.mutate((state) => {
    if (!state.playerActions.possibilities.some(isActionEquals(action))) return

    state.grid = [...state.grid, state.playerActions.tile]
    state.playerActions.tile = undefined
  })
}

export const findPossibilities = (store, action) => {
  store.mutate((state) => {
    const player = state.players.find(({ current }) => current)
    state.playerActions.possibilities = []

    if (player.actionPoints === 0 || player.health === 0) return // TODO: We should add excess in another PR.

    const tile = state.grid.find(isCellEqual(player))
    const cells = getWrappingCells(state.grid)
    const findPlayerActionsOnCell = findActionsOnCell(player, tile)

    state.playerActions.possibilities = cells.flatMap(findPlayerActionsOnCell)
  })
}

export const damage = (store, action) => {
  store.mutate((state) => {
    const player = state.players.find(
      ({ name }) => name === action.payload.playerName,
    )
    player.health = Math.max(0, player.health - action.payload.damage)

    if (player.health <= 0) {
      store.dispatch({
        type: '@players>death',
        payload: { playerName: action.payload.playerName },
      })
    }
  })
}

export const init = (store, action) => {
  store.mutate((state) => {
    state.players = action.payload.map((player) => ({
      ...player,
      x: 0,
      y: 0,
      actionPoints: 2,
    }))
    state.players[0].current = true
    state.players[0].first = true
  })
}
