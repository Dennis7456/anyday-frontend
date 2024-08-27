import React, { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'

interface RedirectIfLoggedInProps {
  children: ReactNode
}

const RedirectIfLoggedIn: React.FC<RedirectIfLoggedInProps> = ({
  children,
}) => {
  const token = localStorage.getItem('token')

  if (token) {
    // If the user is logged in, redirect to the dashboard
    return <Navigate to="/dashboard" />
  }

  // Otherwise, render the children (the original component)
  return <>{children}</>
}

export default RedirectIfLoggedIn
