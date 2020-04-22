const { createStore } = require('@myrtille/mutate')
const { archetypes } = require('@subterra/data')
const { listeners } = require('./listeners')

exports.initState = () => ({
  archetypes,
  players: [],
  messages: [],
})

exports.create = (state = exports.initState()) => {
  const store = createStore(state)

  listeners.forEach((args) => store.addListener(...args))

  return store
}
