import { useCallback, useContext } from 'react'
// import { AuthContext } from '../../App';
//import Cookies from 'universal-cookie';
import Example from '../Example/Example'
import { UserContext } from '../../App'
// import { User } from '../../types'
import httpClient from '../../config/httpClient'

const DashBoard = () => {
  const user = useContext(UserContext)
  console.log(user)

  const logoutUser = async () => {
    await httpClient.post('//localhost:5000/logout')
    window.location.href = '/'
  }

  return (
    <div>
      {user != null ? (
        <div>
          <Example />
        </div>
      ) : (
        <div>
          <p>You are not logged in</p>
          <div>
            <a href="/login">
              <button>Login</button>
            </a>
            <a href="/register">
              <button>Register</button>
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

export default DashBoard
