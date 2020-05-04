import React, { useState, useEffect, useCallback } from 'react'
import { wrapSubmit } from 'from-form-submit'
import { useUser } from '../components/user'

// TODO: env var
const API_BASEURL = '/beta'

const User = () => {
  const { token } = useUser()
  const [user, setUser] = useState({})

  useEffect(() => {
    if (!token) return

    console.log({ token })

    fetch(`${API_BASEURL}/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((raw) => raw.json())
      .then(setUser)
  }, [token])

  const onChangePseudo = useCallback(
    wrapSubmit((data) => {
      fetch(`${API_BASEURL}/user/pseudo`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      })
    }),
    [token],
  )

  return (
    <>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <form onSubmit={onChangePseudo}>
        <label>Pseudo</label>
        <input defaultValue={user.pseudo} name="pseudo" type="text" />
        <button type="submit">update</button>
      </form>
    </>
  )
}

export default User
