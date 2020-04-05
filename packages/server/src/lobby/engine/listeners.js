import * as messages from './messages'
import * as players from './players'

export default [
  ['@message>add', messages.addMessage],
  ['@players>add', players.addPlayer],
  ['@players>remove', players.removePlayer],
  ['@players>setArchetype', players.setArchetype],
]
