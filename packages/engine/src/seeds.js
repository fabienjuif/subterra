import seedRandom from 'seedrandom'
import { random } from './utils'

export const init = (store, action) => {
  if (!action.payload.master) {
    const error = new Error('Master seed must be given')
    error.code = 'bad_parameters'
    error.missing = ['action.payload.master']
    throw error
  }

  const masterRandom = seedRandom(action.payload.master)
  const masterNanoid = random.getNanoid(masterRandom)

  const defaultDicesSeed = masterNanoid()
  const defaultCardsSeed = masterNanoid()
  const defaultTilesSeed = masterNanoid()

  const dices = action.payload.dices || defaultDicesSeed
  const cards = action.payload.cards || defaultCardsSeed
  const tiles = action.payload.tiles || defaultTilesSeed

  store.mutate((state) => {
    state.seeds = {
      ...action.payload,
      private:
        action.payload.private === undefined ? true : action.payload.private,
      dices,
      dicesNext: dices,
      cards,
      cardsNext: cards,
      tiles,
      tilesNext: tiles,
    }
  })
}
