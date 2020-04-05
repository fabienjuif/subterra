import {
  addClient,
  broadcastState,
  callsEngineAndBroadcastState,
  createOrJoinLobby,
  joinGameNode,
  leaveLobby,
  startGame,
} from './reactions'
import createEngine from './engine'

jest.mock('./engine')
jest.mock('nanoid', () => ({
  nanoid: () => 'genrerated-uuid-mocked',
}))

describe('lobby/reactions', () => {
  describe('addClient', () => {
    it('should add client to the clients Map', () => {
      const clients = new Map()
      const context = { clients }

      addClient(context)({ id: 'client', user: { userId: 2 } })

      expect(clients.size).toEqual(1)
      expect(clients.entries().next().value).toEqual([
        2,
        { id: 'client', user: { userId: 2 } },
      ])
    })
  })

  describe('broadcastState', () => {
    it('should send the engine state to all clients in the lobby', () => {
      const clients = new Map()
      const context = {
        clients,
      }

      const client = {
        send: jest.fn(),
        lobby: {
          users: [1, 3, 5, 7],
          engine: {
            getState: () => ({ state: 'with data' }),
          },
        },
      }

      clients.set(1, client)
      clients.set(2, { send: jest.fn() })
      clients.set(3, { send: jest.fn() })
      clients.set(5, { send: jest.fn() })

      broadcastState(context)(client)

      const testSend = (send) => {
        expect(send).toHaveBeenCalledTimes(1)
        expect(send).toHaveBeenCalledWith({
          type: '@server>setState',
          payload: { state: 'with data' },
        })
      }
      testSend(client.send)
      testSend(clients.get(3).send)
      testSend(clients.get(5).send)

      expect(clients.get(2).send).toHaveReturnedTimes(0)
    })
  })

  describe('callsEngineAndBroadcastState', () => {
    const context = {
      clients: new Map(),
    }

    const client = {
      user: {
        userId: 1,
      },
      send: jest.fn(),
      lobby: {
        users: [1, 2],
        engine: {
          dispatch: jest.fn(),
          getState: () => ({ state: 'with data' }),
        },
      },
    }

    context.clients.set(1, client)
    context.clients.set(2, { send: jest.fn() })

    callsEngineAndBroadcastState(context)(client, {
      payload: {
        type: 'action to dispatch',
        payload: { message: 'payload in payload' },
      },
    })

    expect(client.lobby.engine.dispatch).toHaveBeenCalledTimes(1)
    expect(client.lobby.engine.dispatch).toHaveBeenCalledWith({
      type: 'action to dispatch',
      payload: { message: 'payload in payload' },
      userId: 1, // TODO: check if this is necessary?
    })
    expect(client.send).toHaveBeenCalledTimes(1)
    expect(client.send).toHaveBeenCalledWith({
      type: '@server>setState',
      payload: { state: 'with data' },
    })
    expect(context.clients.get(2).send).toHaveBeenCalledTimes(1)
  })

  describe('createOrJoinLobby', () => {
    it('should create lobby add user to engine (freshly created) and broadcast state', () => {
      const context = {
        lobbies: [],
        clients: new Map(),
      }

      const client = {
        user: {
          userId: 1,
        },
        send: jest.fn(),
      }

      context.clients.set(1, client)

      const dispatch = jest.fn()
      const getState = jest.fn(() => ({ state: 'with data' }))
      const engine = {
        dispatch,
        getState,
      }
      createEngine.mockReturnValueOnce(engine)

      createOrJoinLobby(context)(false)(client, {})

      expect(createEngine).toHaveBeenCalledTimes(1)
      expect(context.lobbies).toEqual([
        expect.objectContaining({
          id: 'genrerated-uuid-mocked',
          engine,
          users: new Set([1]),
        }),
      ])
      expect(dispatch).toHaveBeenCalledTimes(1)
      expect(dispatch).toHaveBeenCalledWith({
        type: '@players>add',
        payload: {
          name: 1,
          id: 1,
        },
      })
      expect(client.send).toHaveBeenCalledTimes(2)
      expect(client.send).toHaveBeenCalledWith({
        type: '@server>redirect',
        payload: {
          type: 'lobby',
          id: 'genrerated-uuid-mocked',
        },
      })
      expect(client.send).toHaveBeenCalledWith({
        type: '@server>setState',
        payload: { state: 'with data' },
      })
    })

    it.todo('should join lobby add user to engine and broadcast state')
    it.todo('should NOT join lobby because it is full')
    it.todo(
      'should redirect to existing lobby on join, add user to engine and broadcast state',
    )
    it.todo(
      'should redirect to existing lobby on create, add user to engine and broadcast state',
    )
    it.todo('should redirect to existing game on join')
    it.todo('should redirect to existing game on create')
    it.todo('should send an error because lobby does not exists')
    it.todo('should send an error because game is started')
  })
})
