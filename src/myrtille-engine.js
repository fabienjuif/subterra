import createStore from '@myrtille/mutate'
import { v4 as uuid } from 'uuid'
import cardsData from './utils/cards'
import tilesData, { isCellEqual } from './utils/tiles'
import { getRandomInArray } from './utils/dices'

const initState = () => ({
  gameOver: false,
  logs: [],
  decks: {
    tiles: { length: 10 },
    cards: { length: 10 },
  },
  turn: 0,
  players: [],
  action: {}, // action the player is currently doing
  actions: [], // known possible actions for the current player
  board: {
    card: undefined, // current active card
    tile: undefined,
    tiles: [{ ...tilesData[0], x: 0, y: 0 }],
  },
})

/**
 * Action list:
 * 'damagePlayer', { player, typeDamage, damage } - reduce the player health
 * 'newCard' - set a new board card and reduce the deck of card
 * 'pushLog', { code, player } - create a new logs with these infos.
 * 'reset' - reset the state.
 */
export const store = createStore(initState())

store.addListener('reset', (str, _) => {
  str.setState(initState())
})

store.addListener('pushLog', (str, act) => {
  str.mutate((state) =>
    state.logs.push({ ...act.payload, id: uuid(), timestamp: new Date() }),
  )
})

store.addListener('newCard', (str, _) => {
  str.mutate((state) => {
    if (state.decks.cards.length > 0) {
      state.board.card = getRandomInArray(Object.values(cardsData).slice(1))
      state.decks.cards.length -= 1
    } else {
      state.board.card = cardsData[0]
    }
  })
})

store.subscribe('state.board.card', (str) => {
  const state = str.getState()
  const card = state.board.card

  state.players.forEach((player) => {
    if (state.board.tiles.find(isCellEqual(player)).type === card.type) {
      str.dispatch({
        type: 'damagePlayer',
        payload: { player: player, damageType: card.type, damage: card.damage },
      })
    }
  })
})

store.addListener('damagePlayer', (str, act) => {
  str.mutate((state) => {
    state.players.reduce((acc, player) => {
      if (player.name === act.payload.player.name) {
        str.dispatch({
          type: 'pushLog',
          payload: { code: 'hit_' + act.payload.damageType, player: player },
        })
        return [...acc, player.health - act.payload.damage]
      } else {
        return [...acc, player]
      }
    })
  })
})
