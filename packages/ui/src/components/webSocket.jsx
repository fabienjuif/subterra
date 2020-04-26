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
  addListener: notReady,
  dispatch: notReady,
}

const WebSocketContext = createContext(defaultValue)

export const useWebSocket = (domain, listener) => {
  const { addListener, dispatch } = useContext(WebSocketContext)

  useEffect(() => {
    addListener(listener)
  }, [addListener, listener])

  return useCallback(
    (action, withDomain = true) =>
      dispatch({ ...action, domain: withDomain ? domain : undefined }),
    [dispatch, domain],
  )
}

const WebSocketProvider = ({ children, url }) => {
  const readyRef = useRef(false)
  const wsRef = useRef(undefined)
  const waitingActions = useRef([])
  const listenersRef = useRef([])
  const [value] = useState({
    ...defaultValue,
    dispatch: (action) => {
      if (readyRef.current && wsRef.current) {
        console.debug('<<<', action.type, action)
        wsRef.current.send(JSON.stringify(action))
      } else {
        console.debug('[waiting]', action.type, action)
        waitingActions.current.push(action)
      }
    },
    addListener: (listener) => {
      listenersRef.current.push(listener)
      return () => {
        listenersRef.current = listenersRef.current.filter(
          (curr) => curr !== listener,
        )
      }
    },
  })

  // debug purpose only
  useEffect(() => {
    window._dispatch = value.dispatch
  }, [value.dispatch])

  const { token } = useUser()

  useEffect(() => {
    const close = () => {
      wsRef.current = undefined
      readyRef.current = false
    }

    if (!token) return close()

    const fullUrl = `${url}?token=${token}`
    wsRef.current = new WebSocket(fullUrl)
    wsRef.current.onopen = () => {
      // mark socket as ready
      readyRef.current = true

      // dispatch all waiting actions
      waitingActions.current.forEach(value.dispatch)
      waitingActions.current = []
    }
    wsRef.current.onclose = close
    wsRef.current.onerror = console.trace
    wsRef.current.onmessage = (event) => {
      let action
      try {
        action = JSON.parse(event.data)
        console.debug('>>>', action.type, action)
      } catch (ex) {
        console.trace(ex)
      }
      if (!action) return

      listenersRef.current.forEach((listener) => listener(action))
    }
  }, [token, url, value.dispatch])

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  )
}

export default WebSocketProvider
