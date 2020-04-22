const messages = require('./messages')
const players = require('./players')

exports.listeners = [
  ['@message>add', messages.addMessage],
  ['@players>add', players.addPlayer],
  ['@players>remove', players.removePlayer],
  ['@players>setArchetype', players.setArchetype],
]
