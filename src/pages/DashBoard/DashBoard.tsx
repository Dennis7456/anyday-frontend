import React, { useState, useEffect } from 'react'
import { FaEnvelope, FaRegBell, FaSearch } from 'react-icons/fa'
import profile from '../../assets/download.png'
import { useUserContext } from '../../userContext'
import { gql, useQuery } from '@apollo/client'

interface UserData {
  loggedInUser: {
    id: string
    firstName: string
    lastName: string
    userName: string
    email: string
    dateOfBirth: string
  }
}

const CURRENT_USER_QUERY = gql`
  query loggedInUser {
    loggedInUser {
      id
      firstName
      lastName
      userName
      email
      dateOfBirth
    }
  }
`

function Dashboard() {
  const [open, setOpen] = useState(false)
  const { value } = useUserContext()
  const { loginState, logoutState } = value

  const logoutUser = async () => {
    logoutState()
    window.location.href = '/'
  }

  const showDropDown = () => {
    setOpen(!open)
  }

  const { loading, data, error } = useQuery(CURRENT_USER_QUERY, {
    onCompleted: (data) => {
      // console.log("Data", data)
      // const { currentUser } = data
      // console.log(currentUser.loggedInUser)
      const loggedInUser = data?.loggedInUser
      console.log('Logged In User:', loggedInUser)
    },
    onError: (error) => {
      console.error(error.message)
    },
  })
  if (loading) {
    console.log('Loading data')
  }

  const [user, setUser] = useState<UserData['loggedInUser'] | null>(null)

  useEffect(() => {
    if (loading) {
      console.log('Loading data')
    }

    if (data) {
      const { loggedInUser } = data
      setUser(loggedInUser)
    }
  }, [loading, data])
  return (
    <div className="flex items-center justify-between h-[70px] shadow-sm px-[25px]">
      <div className="flex items-center rounded-[5px]">
        <input
          type="text"
          className="bg-on-primary h-[40px] outline-none pt-[13px] w-[350px] rounded-[5px] placeholder:text-[14px] leading-[20px] font-normal"
          placeholder="search for..."
        />
        <div className="bg-primary h-[40px] px-[14px] flex items-center justify-center cursor-pointer rounded-tr-[5px] rounded-br-[5px]">
          <FaSearch color="white" />
        </div>
      </div>
      <div className="flex items-center gap-[15px] relative">
        <div className="flex items-center gap-[25px] border-r-[1px] pr-[25px]">
          <FaRegBell />
          <FaEnvelope />
        </div>
        <div
          className="flex items-center gap-[15px] relative"
          onClick={showDropDown}
        >
          <p>
            Welcome,{' '}
            <span className="text-primary font-semibold text-[15px]">
              {user?.firstName} {user?.lastName}
            </span>
          </p>
          <div className="h-[50px] w-[50px] rounded-full bg-primary cursor-pointer flex items-center justify-center relative ">
            <img src={profile} alt="profile" className="rounded-full" />
          </div>
          {open && (
            <div className="bg-on-primary h-[120px] w-[150px] absolute bottom-[-135px] z-20 right-0 pt-[15px] pl-[15px] space-y-[10px] border-primary border-[1px]">
              <p className="cursor-pointer hover:text-primary font-semibold">
                Profile
              </p>
              <p className="cursor-pointer hover:text-primary font-semibold">
                Settings
              </p>
              <p
                className="cursor-pointer hover:text-primary font-semibold"
                onClick={logoutUser}
              >
                Logout
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
