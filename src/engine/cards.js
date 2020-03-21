import cardsData from '../utils/cards'
import { getRandomInArray } from '../utils/dices'

export const pick = (store, action) => {
  store.mutate((state) => {
    if (state.decks.cards.length > 0) {
      state.board.card = getRandomInArray(Object.values(cardsData).slice(1))
      state.decks.cards.length -= 1
    } else {
      state.board.card = cardsData[0]
    }
  })
}
