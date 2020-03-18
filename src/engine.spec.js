import { initState, getCurrentPlayer, createLog } from "./engine";

describe("game engine", () => {
  describe("createLog", () => {
    it("should create new log with all given information, an id and timestamp", () => {
      const state = initState();
      
      createLog(state)({ some: "informations", are: "here" });

      expect(state.logs).toEqual([
        expect.objectContaining({ some: "informations", are: "here" })
      ]);
      expect(state.logs[0].id).toBeDefined()
      expect(state.logs[0].timestamp).toBeDefined()
    });
  });

  describe('getCurrentPlayer', () => {
    it('should get the current player', () => {
      const state = initState()
      state.players.push({ name: 'test', current: true })

      expect(getCurrentPlayer(state)).toEqual([state.players[0], 0])
      
      state.players[0].current = false
      state.players.push({ name: 'test 2', current: true })
      expect(getCurrentPlayer(state)).toEqual([state.players[1], 1])
    })

    it('should not get the current player if none', () => {
      const state = initState()

      expect(getCurrentPlayer(state)).toEqual([undefined, -1])
    })
  })
});
