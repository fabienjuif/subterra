import { isActionEquals, players as actions } from './actions'
import {
  isCellEqual,
  getWrappingCells,
  findActionsOnCell,
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

export const findPossibilities = (store, action) => {
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
        .map((currentPlayer) => actions.heal(currentPlayer)), // TODO: We should add excess in another PR by filter all actions once they are created
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
        if (currAction.payload.playerName === player.name) return currAction
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

export const damage = (store, action) => {
  const prevState = store.getState()
  const playerIndex = prevState.players.findIndex(
    ({ name }) => name === action.payload.playerName,
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
          playerName: action.payload.playerName,
          protectedBy: withProtect.name,
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

export const heal = (store, action) => {
  store.mutate((state) => {
    const player = state.players.find(
      ({ name }) => name === action.payload.playerName,
    )
    player.health = Math.min(
      player.health + action.payload.amount,
      player.archetype.health,
    )
    player.actionPoints = Math.max(0, player.actionPoints - action.payload.cost)
  })
}
