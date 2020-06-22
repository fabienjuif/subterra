import { FinalTile } from '@subterra/data'
import { isActionEquals, players as actions } from './actions'
import { players as selectors } from './selectors'
import { tiles, random } from './utils'

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

    const player = selectors.findById(state, action)

    player.actionPoints = Math.max(0, player.actionPoints - action.payload.cost)
    player.x = action.payload.x
    player.y = action.payload.y
  })
}

export const look = (store, action) => {
  store.mutate((state) => {
    if (!state.playerActions.possibilities.some(isActionEquals(action))) return

    const player = selectors.findById(state, action)
    const playerTile = state.grid.find(tiles.isCellEqual(player))

    // draw a tile
    // - if there is no more tiles, draw an end
    // - if there is less than 4 cards, roll a dice it could be the end!
    // - in other case take a card from remaining one
    //    and remove cards from deck when there is no more remaining
    let nextTile
    if (state.tiles.remaining - 1 <= 0) {
      nextTile = { ...FinalTile }
    } else {
      state.tiles.remaining -= 1

      const rollTile = (number) => {
        const { value, nextSeed } = random.roll(number, state.seeds.tilesNext)
        state.seeds.tilesNext = nextSeed
        return value
      }

      if (
        state.tiles.remaining < 4 &&
        rollTile(state.tiles.remaining + 1) === 1
      ) {
        nextTile = { ...FinalTile }
      } else {
        const value = rollTile(state.tiles.deck.length)

        const tileInDeck = state.tiles.deck[value - 1]
        tileInDeck.remaining -= 1
        if (tileInDeck.remaining <= 0) {
          state.tiles.deck.splice(value - 1, 1)
        }

        nextTile = { ...tileInDeck.tile }
      }
    }

    // tile is drawn, add it where the player looked at
    const tile = {
      ...nextTile,
      x: action.payload.x,
      y: action.payload.y,
      status: [],
      rotation: 0,
    }

    player.actionPoints = Math.max(0, player.actionPoints - action.payload.cost)
    state.playerActions.tile = tile

    state.playerActions.possibilities = [actions.rotate(player, 90)]

    if (tiles.canMoveFromTo(playerTile, tile)) {
      state.playerActions.possibilities.push(actions.drop(player))
    }
  })
}

export const rotate = (store, action) => {
  store.mutate((state) => {
    if (!state.playerActions.possibilities.some(isActionEquals(action))) return

    const player = selectors.findById(state, action)
    const playerTile = state.grid.find(tiles.isCellEqual(player))
    const rotatedTile = {
      ...state.playerActions.tile,
      rotation: action.payload.rotation,
    }

    state.playerActions.tile = rotatedTile
    state.playerActions.possibilities = [
      actions.rotate(player, tiles.nextRotation(rotatedTile)),
    ]

    if (tiles.canMoveFromTo(playerTile, rotatedTile))
      state.playerActions.possibilities.push(actions.drop(player))
  })
}

export const drop = (store, action) => {
  store.mutate((state) => {
    if (!state.playerActions.possibilities.some(isActionEquals(action))) return

    state.grid.push(state.playerActions.tile)
    state.playerActions.tile = undefined
  })
}

export const findPossibilities = (store, action) => {
  store.mutate((state) => {
    const player = state.players.find(({ current }) => current)
    state.playerActions.possibilities = []

    if (player.health === 0) return

    const tile = state.grid.find(tiles.isCellEqual(player))
    const playersOnCell = state.players.filter(tiles.isCellEqual(player))

    // based actions
    // TODO: clear / climb / etc
    let commonActions = [
      // - heal
      ...playersOnCell
        // some health is missing
        .filter(({ health, archetype }) => health < archetype.health)
        // map it to an action
        .map((currentPlayer) =>
          actions.heal(
            currentPlayer,
            // can be a skill, if not found the cost is set by actions.heal
            // the medic can not heal himself
            currentPlayer === player
              ? undefined
              : player.skills.find(({ type }) => type === 'heal'),
          ),
        ),
    ]

    // actions on cells
    const cells = tiles.getWrappingCells(state.grid)
    const findPlayerActionsOnCell = tiles.findActionsOnCell(player, tile)
    const cellsActions = cells.flatMap(findPlayerActionsOnCell)

    // actions based on skills
    // - heal is done above with the common "heal" skill
    const skillsActions = []
    // TODO:

    // possibilities + filter on cost + add excess
    state.playerActions.possibilities = [
      ...commonActions,
      ...skillsActions,
      ...cellsActions,
    ]
      .map((possibility) => {
        const actionPointsAfter = player.actionPoints - possibility.payload.cost

        // can be done
        if (actionPointsAfter >= 0) return possibility

        // can be done with one more AP, this is an excess
        if (actionPointsAfter === -1) return actions.excess(possibility)

        // can not be done, even with on more AP
        return undefined
      })
      .filter(Boolean)
  })
}

export const damage = (store, action) => {
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
        tiles.isCellEqual(player)(prevPlayer) &&
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
      store.dispatch(actions.death(player))
    }
  })
}

export const init = (store, action) => {
  store.mutate((state) => {
    state.players = action.payload.map((player) => ({
      ...player,
      id: player.id || player.type, // type is unique for now and we can replace it by an UUID when needed.
      x: 0,
      y: 0,
      actionPoints: 2,
    }))
    state.players[0].current = true
    state.players[0].first = true
  })
}

export const heal = (store, action) => {
  const prevState = store.getState()

  if (!prevState.playerActions.possibilities.some(isActionEquals(action))) {
    return
  }

  store.mutate((state) => {
    const player = selectors.findById(state, action)
    player.health = Math.min(
      player.health + action.payload.amount,
      player.archetype.health,
    )
    player.actionPoints = Math.max(0, player.actionPoints - action.payload.cost)
  })
}
