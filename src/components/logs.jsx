import React from 'react'

const Logs = ({ logs }) => {
  return (
    <div>
      <h3>Logs</h3>
      {[...logs].reverse().map((log) => (
        <div key={log.id}>
          {log.code} - {log.player.name}
        </div>
      ))}
    </div>
  )
}

export default Logs
