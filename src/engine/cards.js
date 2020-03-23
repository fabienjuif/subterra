import cardsData from '../utils/cards'
import { getRandomInArray } from '../utils/dices'

export const pick = (store, action) => {
  store.mutate((state) => {
    if (state.deckCards.length > 0) {
      state.activeCard = getRandomInArray(Object.values(cardsData).slice(1))
      state.deckCards.length -= 1
    } else {
      state.activeCard = cardsData[0]
    }
  })
}
