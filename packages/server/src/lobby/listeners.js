import {
  addClient,
  callsEngineAndBroadcastState,
  createOrJoinLobby,
  leaveLobby,
  startGame,
} from './reactions'

export default (context) => [
  ['@server>user>verified', addClient(context)],
  ['@client>create', createOrJoinLobby(context)(false)],
  ['@client>join', createOrJoinLobby(context)(true)],
  ['@client>leave', leaveLobby(context)],
  ['@client>start', startGame(context)],
  ['@client>dispatch', callsEngineAndBroadcastState(context)],
]
