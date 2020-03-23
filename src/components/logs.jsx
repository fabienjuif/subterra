import React from 'react'

const Logs = ({ logs, className }) => {
  return (
    <div className={className}>
      <h3>Logs</h3>
      {[...logs].reverse().map((log) => (
        <div key={log.id}>
          {log.code}
          {log.player && ` - ${log.player.name}`}
        </div>
      ))}
    </div>
  )
}

export default Logs
