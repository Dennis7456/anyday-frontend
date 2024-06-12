import React, { createContext, useContext, useState } from 'react'
import propTypes from 'prop-types'

const UserContext = createContext()

export const UserProvider = (props) => {
  const [user, setUser] = useState({
    id: '',
    firstName: '',
    lastName: '',
    userName: '',
    email: '',
    dateOfBirth: '',
  })

  const loginState = (token, user) => {
    localStorage.setItem('token', token)
    setUser(user)
  }

  const logoutState = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  const value = { user, setUser, loginState, logoutState }

  return (
    <UserContext.Provider value={{ value }}>
      {props.children}
    </UserContext.Provider>
  )
}

UserProvider.propTypes = {
  children: propTypes.node,
}

export const useUserContext = () => {
  return useContext(UserContext)
}

export default UserContext
