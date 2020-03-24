import React from 'react'

const Logs = ({ actions, className }) => {
  return (
    <div className={className}>
      <h3>Logs</h3>
      {[...actions]
        .filter(({ type }) => !type.startsWith('@@react'))
        .reverse()
        .map((action) => (
          <div key={action.id}>
            {action.type}
            {action.payload &&
              action.payload.player &&
              ` - ${action.payload.player.name}`}
          </div>
        ))}
    </div>
  )
}

export default Logs
