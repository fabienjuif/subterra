import React, { useState, useRef, useEffect, useCallback } from 'react'
import cn from 'classnames'
import { PlayerIcon } from '../../components'
import getSkillDescription from './getSkillDescription'
import classes from './archetype.module.scss'

const Archetype = ({ type, onClick, className, skills }) => {
  const [showSkills, setShowSkills] = useState(false)
  const timerRef = useRef()

  const cancelShowSkills = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setShowSkills(false)
  }, [])

  const showSkillsAfterDelay = useCallback(() => {
    cancelShowSkills()
    timerRef.current = setTimeout(() => {
      setShowSkills(true)
    }, 200)
  }, [cancelShowSkills])

  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  return (
    <div
      onClick={onClick}
      className={cn('archetype', className, classes.archetype)}
      onMouseLeave={cancelShowSkills}
      onMouseEnter={showSkillsAfterDelay}
    >
      <PlayerIcon type={type} />
      <h2>{type}</h2>

      <div
        className={cn('skills', classes.skills, { [classes.show]: showSkills })}
      >
        {skills.map(({ type }) => (
          <div key={type} className={cn('skill', classes.skill)}>
            <h3>{type}</h3>
            <p>{getSkillDescription(type)}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Archetype
