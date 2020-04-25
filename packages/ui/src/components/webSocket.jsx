import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from 'react'
import { useUser } from './user'
import { useCallback } from 'react'

const notReady = async () => {
  throw new Error('not ready')
}

const defaultValue = {
  ready: false,
  addListener: notReady,
  dispatch: notReady,
}

const WebSocketContext = createContext(defaultValue)

export const useWebSocket = (domain, listener) => {
  const { addListener, dispatch, ready } = useContext(WebSocketContext)

  useEffect(() => {
    if (!ready) return
    addListener(listener)
  }, [addListener, listener, ready])

  return useCallback((action) => dispatch({ ...action, domain }), [
    dispatch,
    domain,
  ])
}

const WebSocketProvider = ({ children, url }) => {
  const listenersRef = useRef([])
  const [value, setValue] = useState(defaultValue)
  const { token } = useUser()

  useEffect(() => {
    const close = () => setValue(defaultValue)

    if (!token) {
      close()
      return
    }

    const fullUrl = `${url}?token=${token}`
    const ws = new WebSocket(fullUrl)
    ws.onopen = () => {
      setValue((old) => ({
        ...old,
        ready: true,
        addListener: (listener) => {
          listenersRef.current.push(listener)
          return () => {
            listenersRef.current = listenersRef.current.filter(
              (curr) => curr !== listener,
            )
          }
        },
        dispatch: (action) => {
          ws.send(JSON.stringify(action))
        },
      }))
    }
    ws.onclose = close
    ws.onerror = console.trace
    ws.onmessage = (event) => {
      let action
      try {
        action = JSON.parse(event.data)
      } catch (ex) {
        console.trace(ex)
      }
      if (!action) return

      listenersRef.current.forEach((listener) => listener(action))
    }
  }, [token, url])

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  )
}

export default WebSocketProvider
