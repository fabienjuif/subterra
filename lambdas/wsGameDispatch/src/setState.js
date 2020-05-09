import { omit, pick } from 'lodash'

const mapState = (state) => ({
  ...omit(state, ['dices', state.seeds.private ? 'seeds' : undefined]),
  technical: {
    ...state.technical,
    actions: state.technical.actions
      .filter((action) => !action.type.match(/>init$/))
      .map((action) => omit(action, ['domain', 'userId'])),
  },
  deckCards: { length: state.deckCards.length },
  tiles: pick(state.tiles, ['remaining']),
})

export const setState = (state) => ({
  type: '@server>setState',
  payload: mapState(state),
})
