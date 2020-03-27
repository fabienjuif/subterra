// This action will be used to initialise a state only for deployed test purpose.
// So it will be removed

export const init = (store, action) => {
  store.mutate((state) => {
    // necessary as long as the view or explore actions are not functional.
    state.grid = [
      ...state.grid,
      { id: 1, type: 'end', bottom: true, x: 0, y: 1, status: [] },
      {
        id: 2,
        type: 'gaz',
        left: true,
        top: true,
        bottom: true,
        x: 1,
        y: 0,
        status: [],
      },
      { id: 3, bottom: true, x: 1, y: 1, status: [] },
      { id: 4, type: 'water', left: true, top: true, x: 1, y: -1 },
      {
        id: 5,
        type: 'landslide',
        dices: [2, 3],
        top: true,
        right: true,
        x: 0,
        y: -1,
        status: [],
      },
      {
        id: 6,
        top: true,
        bottom: true,
        left: true,
        right: true,
        x: -1,
        y: -1,
        status: [],
      },
      { id: 7, type: 'tight', right: true, top: true, x: -1, y: 0, status: [] },
      {
        id: 8,
        type: 'enemy',
        top: true,
        bottom: true,
        left: true,
        right: true,
        x: -1,
        y: 1,
        status: [],
      },
    ]

    // necessary as long as possibilities are not calculated
    state.playerActions.possibilities = [
      {
        type: '@players>actions>move',
        payload: { playerName: 'Sutat', cost: 1, x: 0, y: 1 },
      },
      {
        type: '@players>actions>move',
        payload: { playerName: 'Sutat', cost: 1, x: 1, y: 0 },
      },
      {
        type: '@players>actions>move',
        payload: { playerName: 'Sutat', cost: 1, x: 0, y: -1 },
      },
      {
        type: '@players>actions>move',
        payload: { playerName: 'Sutat', cost: 2, x: -1, y: 0 },
      },
    ]
  })
}
