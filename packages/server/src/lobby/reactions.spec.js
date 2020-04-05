import got from 'got'
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
jest.mock('got')

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

    it('should join lobby add user to engine and broadcast state', () => {
      const dispatch = jest.fn()
      const getState = jest.fn(() => ({ state: 'with data' }))
      const engine = {
        dispatch,
        getState,
      }

      const context = {
        lobbies: [{ id: 1, users: new Set([1]), engine }],
        clients: new Map(),
      }

      const client = {
        user: {
          userId: 2,
        },
        send: jest.fn(),
      }

      context.clients.set(1, { send: jest.fn() })
      context.clients.set(2, client)

      createOrJoinLobby(context)(true)(client, { payload: { lobbyId: 1 } })

      expect(context.lobbies).toEqual([
        { id: 1, users: new Set([1, 2]), engine },
      ])
      expect(dispatch).toHaveBeenCalledTimes(1)
      expect(dispatch).toHaveBeenCalledWith({
        type: '@players>add',
        payload: {
          name: 2,
          id: 2,
        },
      })
      expect(client.send).toHaveBeenCalledTimes(2)
      expect(client.send).toHaveBeenCalledWith({
        type: '@server>redirect',
        payload: {
          type: 'lobby',
          id: 1,
        },
      })
      expect(client.send).toHaveBeenCalledWith({
        type: '@server>setState',
        payload: { state: 'with data' },
      })
      expect(context.clients.get(1).send).toHaveReturnedTimes(1)
      expect(context.clients.get(1).send).toHaveBeenCalledWith({
        type: '@server>setState',
        payload: { state: 'with data' },
      })
    })

    it('should NOT join lobby because it is full', () => {
      const context = {
        lobbies: [{ id: 1, users: new Set([1, 2, 3, 4, 5, 6]) }],
        clients: new Map(),
      }

      const client = {
        user: {
          userId: 7,
        },
        send: jest.fn(),
      }

      createOrJoinLobby(context)(true)(client, { payload: { lobbyId: 1 } })

      expect(context.lobbies[0].users.size).toEqual(6)
      expect(client.send).toHaveBeenCalledTimes(1)
      expect(client.send).toHaveBeenCalledWith({
        type: '@server>error',
        payload: {
          message: 'lobby is full',
          lobbyId: 1,
        },
      })
    })

    it('should send an error because lobby does not exists', () => {
      const context = {
        lobbies: [],
      }

      const client = {
        user: {
          userId: 7,
        },
        send: jest.fn(),
      }

      createOrJoinLobby(context)(true)(client, { payload: { lobbyId: 1 } })

      expect(context.lobbies.length).toEqual(0)
      expect(client.send).toHaveBeenCalledTimes(1)
      expect(client.send).toHaveBeenCalledWith({
        type: '@server>error',
        payload: {
          message: 'lobby not found or game already started',
          lobbyId: 1,
        },
      })
    })

    it('should send an error because game is started', () => {
      const context = {
        lobbies: [{ id: 1, game: {}, users: new Set() }],
      }

      const client = {
        user: {
          userId: 7,
        },
        send: jest.fn(),
      }

      createOrJoinLobby(context)(true)(client, { payload: { lobbyId: 1 } })

      expect(context.lobbies[0].users.size).toEqual(0)
      expect(client.send).toHaveBeenCalledTimes(1)
      expect(client.send).toHaveBeenCalledWith({
        type: '@server>error',
        payload: {
          message: 'lobby not found or game already started',
          lobbyId: 1,
        },
      })
    })

    it('should redirect to existing game on join', () => {
      const context = {
        lobbies: [{ id: 1, game: { id: 'game-id' }, users: new Set([1]) }],
      }

      const client = {
        user: {
          userId: 1,
        },
        send: jest.fn(),
      }

      createOrJoinLobby(context)(true)(client, { payload: { lobbyId: 1 } })
      expect(client.send).toHaveBeenCalledTimes(1)
      expect(client.send).toHaveBeenCalledWith({
        type: '@server>redirect',
        payload: {
          id: 'game-id',
          type: 'game',
        },
      })
    })

    it('should redirect to existing game on create', () => {
      const context = {
        lobbies: [{ id: 1, game: { id: 'game-id' }, users: new Set([1]) }],
      }

      const client = {
        user: {
          userId: 1,
        },
        send: jest.fn(),
      }

      createOrJoinLobby(context)(false)(client, { payload: { lobbyId: 1 } })
      expect(client.send).toHaveBeenCalledTimes(1)
      expect(client.send).toHaveBeenCalledWith({
        type: '@server>redirect',
        payload: {
          id: 'game-id',
          type: 'game',
        },
      })
    })

    it('should redirect to existing lobby on join, add user to engine and broadcast state', () => {
      const dispatch = jest.fn()
      const getState = jest.fn(() => ({ state: 'with data' }))
      const engine = {
        dispatch,
        getState,
      }

      const context = {
        lobbies: [{ id: 1, users: new Set([1, 2]), engine }],
        clients: new Map(),
      }

      const client = {
        user: {
          userId: 2,
        },
        send: jest.fn(),
      }

      context.clients.set(1, { send: jest.fn() })
      context.clients.set(2, client)

      createOrJoinLobby(context)(true)(client, {})

      expect(context.lobbies).toEqual([
        { id: 1, users: new Set([1, 2]), engine },
      ])
      expect(dispatch).toHaveBeenCalledTimes(1)
      expect(dispatch).toHaveBeenCalledWith({
        type: '@players>add',
        payload: {
          name: 2,
          id: 2,
        },
      })
      expect(client.send).toHaveBeenCalledTimes(2)
      expect(client.send).toHaveBeenCalledWith({
        type: '@server>redirect',
        payload: {
          type: 'lobby',
          id: 1,
        },
      })
      expect(client.send).toHaveBeenCalledWith({
        type: '@server>setState',
        payload: { state: 'with data' },
      })
      expect(context.clients.get(1).send).toHaveReturnedTimes(1)
      expect(context.clients.get(1).send).toHaveBeenCalledWith({
        type: '@server>setState',
        payload: { state: 'with data' },
      })
    })

    it('should redirect to existing lobby on create, add user to engine and broadcast state', () => {
      const dispatch = jest.fn()
      const getState = jest.fn(() => ({ state: 'with data' }))
      const engine = {
        dispatch,
        getState,
      }

      const context = {
        lobbies: [{ id: 1, users: new Set([1, 2]), engine }],
        clients: new Map(),
      }

      const client = {
        user: {
          userId: 2,
        },
        send: jest.fn(),
      }

      context.clients.set(1, { send: jest.fn() })
      context.clients.set(2, client)

      createOrJoinLobby(context)(false)(client, {})

      expect(context.lobbies).toEqual([
        { id: 1, users: new Set([1, 2]), engine },
      ])
      expect(dispatch).toHaveBeenCalledTimes(1)
      expect(dispatch).toHaveBeenCalledWith({
        type: '@players>add',
        payload: {
          name: 2,
          id: 2,
        },
      })
      expect(client.send).toHaveBeenCalledTimes(2)
      expect(client.send).toHaveBeenCalledWith({
        type: '@server>redirect',
        payload: {
          type: 'lobby',
          id: 1,
        },
      })
      expect(client.send).toHaveBeenCalledWith({
        type: '@server>setState',
        payload: { state: 'with data' },
      })
      expect(context.clients.get(1).send).toHaveReturnedTimes(1)
      expect(context.clients.get(1).send).toHaveBeenCalledWith({
        type: '@server>setState',
        payload: { state: 'with data' },
      })
    })
  })

  describe('joinGameNode', () => {
    it('should redirect all users to game node, and remove this game node from available list', async () => {
      const context = {
        waitingLobbies: new Set([2, 3]),
        gameNodes: new Map([
          ['game-1', { id: 'game-1', url: 'game-node-url' }],
          ['game-2', { id: 'game-2', url: 'game-node-url-2' }],
        ]),
        clients: new Map(),
      }

      const lobby = {
        id: 1,
        users: ['client-1', 'client-2'],
        engine: {
          getState: () => ({
            players: [{ id: 'client-1' }, { id: 'client-2' }],
          }),
        },
      }
      context.waitingLobbies.add(1)

      const client = {
        id: 'client-1',
        lobby,
        send: jest.fn(),
      }
      context.clients.set('client-1', client)
      context.clients.set('client-2', { send: jest.fn() })

      await joinGameNode(context)(client)

      expect(context.waitingLobbies.size).toEqual(2)
      expect(context.gameNodes.size).toEqual(1)
      expect(got).toHaveBeenCalledTimes(1)
      expect(got).toHaveBeenCalledWith(
        'game-node-url',
        expect.objectContaining({
          body: JSON.stringify({
            players: [{ id: 'client-1' }, { id: 'client-2' }],
          }),
        }),
      )
      expect(client.lobby.game).toEqual(
        expect.objectContaining({ id: 'game-1' }),
      )

      Array.from(context.clients.values()).forEach((cl) => {
        expect(cl.send).toHaveBeenCalledTimes(1)
        expect(cl.send).toHaveBeenCalledWith({
          type: '@server>redirect',
          payload: expect.objectContaining({
            id: 'game-1',
            url: 'game-node-url',
            type: 'game',
          }),
        })
      })
    })
  })

  describe('leaveLobby', () => {
    it('should send an error if lobby is not found', () => {
      const context = {
        waitingLobbies: new Set(),
      }

      const client = {
        send: jest.fn(),
        user: {
          userId: 1,
        },
      }

      leaveLobby(context)(client)

      expect(client.send).toHaveBeenCalledTimes(1)
      expect(client.send).toHaveBeenCalledWith({
        type: '@server>error',
        payload: {
          message: 'lobby not found (trying to leave)',
          userId: 1,
        },
      })
    })

    it('leave lobby and broadcast state to clients', () => {
      const context = {
        waitingLobbies: new Set(),
        clients: new Map(),
      }

      const dispatch = jest.fn()
      const getState = () => ({ state: 'with data' })
      const engine = { dispatch, getState }

      const client = {
        send: jest.fn(),
        user: {
          userId: 1,
        },
        lobby: {
          users: new Set([1, 2]),
          engine,
        },
      }
      context.clients.set(1, client)
      context.clients.set(2, { send: jest.fn() })

      leaveLobby(context)(client)

      expect(client.send).toHaveBeenCalledTimes(0)
      expect(context.clients.get(2).send).toHaveBeenCalledWith({
        type: '@server>setState',
        payload: { state: 'with data' },
      })
      expect(engine.dispatch).toHaveBeenCalledTimes(1)
      expect(engine.dispatch).toHaveBeenCalledWith({
        type: '@players>remove',
        payload: { id: 1 },
      })

      expect(client.lobby).toBeUndefined()
    })

    // TODO: it should remove lobby from waiting game node everytime
    //      and a new event should be send so players can hit "start" again
    it('should delete lobby from waiting lobbies when this is empty', () => {
      const context = {
        waitingLobbies: new Set(),
        lobbies: [],
        clients: new Map(),
      }

      const dispatch = jest.fn()
      const getState = () => ({ state: 'with data' })
      const engine = { dispatch, getState }

      const client = {
        send: jest.fn(),
        user: {
          userId: 1,
        },
        lobby: {
          users: new Set([1]),
          engine,
        },
      }
      context.clients.set(1, client)
      context.clients.set(2, { send: jest.fn() })
      context.lobbies.push(client.lobby)

      leaveLobby(context)(client)

      expect(client.send).toHaveBeenCalledTimes(0)
      expect(context.clients.get(1).send).toHaveBeenCalledTimes(0)
      expect(engine.dispatch).toHaveBeenCalledTimes(0)
      expect(client.lobby).toBeUndefined()
      expect(context.waitingLobbies.size).toEqual(0)
      expect(context.lobbies.length).toEqual(0)
    })
  })

  // FIXME:
  describe.skip('startGame')
})
