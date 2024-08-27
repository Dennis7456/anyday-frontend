import { Outlet, Navigate } from 'react-router-dom'

const PrivateRoutes: React.FC = () => {
  const token = localStorage.getItem('token')

  return token ? <Outlet /> : <Navigate to="/" />
}

export default PrivateRoutes
