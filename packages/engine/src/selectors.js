export const players = {
  findById: (state, action) => {
    return state.players.find(({ id }) => id === action.payload.playerId)
  },
}
