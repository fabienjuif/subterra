import React, { useCallback } from 'react'
import cn from 'classnames'
import { useHistory } from 'react-router-dom'
import { wrapSubmit } from 'from-form-submit'
import { useUser } from '../components'
import classes from './pseudo.module.scss'

const Pseudo = () => {
  const history = useHistory()
  const { fetch, user } = useUser()

  const onChangePseudo = useCallback(
    wrapSubmit(async (data) => {
      await fetch('/user/pseudo', {
        method: 'POST',
        body: JSON.stringify(data),
      })

      history.push('/')
    }),
    [fetch],
  )

  return (
    <form
      onSubmit={onChangePseudo}
      className={cn('change-pseudo', 'screen', classes.form)}
    >
      <div className={cn('label', classes.label)}>
        {user.pseudo ? (
          'You can change your pseudo here'
        ) : (
          <>
            You have to choose a first pseudo before playing{' '}
            <span role="img" aria-label="smile">
              😁
            </span>
          </>
        )}
      </div>

      <input defaultValue={user.pseudo} name="pseudo" type="text" />
      <button type="submit">{user.pseudo ? 'Update' : 'Save'}</button>
    </form>
  )
}

export default Pseudo
