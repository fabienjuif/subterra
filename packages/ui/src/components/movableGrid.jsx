import React, { useState, useCallback, useEffect, useRef } from 'react'
import cn from 'classnames'
import classes from './movableGrid.module.scss'

const MovableGrid = ({ className, children }) => {
  const moving = useRef(false)
  const [translateX, setTranslateX] = useState(0)
  const [translateY, setTranslateY] = useState(0)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const onMouseMove = (e) => {
      if (!moving.current) return
      setTranslateX((old) => old + e.movementX)
      setTranslateY((old) => old + e.movementY)
    }

    const onMouseUp = (e) => {
      moving.current = false
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [])

  const onMouseDown = useCallback(() => {
    moving.current = true
  }, [])

  const onWheel = useCallback((e) => {
    const { deltaY } = e

    setScale((old) => Math.max(0.2, old - deltaY * 0.05))
  }, [])

  return (
    <div
      className={cn('movable-grid', className, classes.movableGrid)}
      onWheel={onWheel}
      onMouseDown={onMouseDown}
    >
      <div
        style={{
          transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
        }}
      >
        {children}
      </div>

      <div className={cn('shadow', classes.shadow)} />
    </div>
  )
}

export default MovableGrid
