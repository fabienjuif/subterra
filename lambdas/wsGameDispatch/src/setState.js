import { omit } from 'lodash'

const mapState = (state) => ({
  ...omit(state, ['dices']),
  technical: {
    ...state.technical,
    actions: state.technical.actions
      .filter((action) => !action.type.match(/>init$/))
      .map((action) => omit(action, ['domain', 'userId'])),
  },
  deckCards: { length: state.deckCards.length },
  deckTiles: { length: state.deckTiles.length },
})

export const setState = (state) => ({
  type: '@server>setState',
  payload: mapState(state),
})
