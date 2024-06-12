import Icon from '@mdi/react'
import React, { useState, useContext, FormEvent } from 'react'
import { useMutation, gql, ApolloError } from '@apollo/client'
import axios from 'axios'
import { Navigate } from 'react-router-dom'
import { mdiCloseCircle, mdiEyeOffOutline, mdiEyeOutline } from '@mdi/js'
import './LoginModal.css'
// import Toast from '../Toast/Toast'
import httpClient from '../../config/httpClient'
import { useUserContext } from 'src/userContext'
import UserContext from 'src/userContext'

interface LoginProps {
  onSubmit: (data: FormData) => void
}

const LOGIN_MUTATION = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        firstName
        lastName
        userName
        email
        dateOfBirth
      }
    }
  }
`

const LoginModal: React.FC = () => {
  // const { value } = useContext(UserContext);
  const { value } = useUserContext()
  const { loginState } = value
  const [showModal, setShowModal] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loggedin, setLoggedin] = useState(false)

  // Use the useMutation hook to handle the login mutation
  const [login, { data, loading, error }] = useMutation(LOGIN_MUTATION, {
    onCompleted: (data) => {
      // Handle successful login
      const { login } = data
      loginState(login.token, login.user)
      console.log(login.token, login.user)
    },

    onError: (error) => {
      // Handle login error
      console.error(error.message)
      // if (error. response.status === 401) {
      //   alert("Invalid credentials");
      // }
    },
  })

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (showPassword) {
      setShowPassword(false)
    } else {
      setShowPassword(true)
    }
  }

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      await login({
        variables: {
          email,
          password,
        },
      })
      window.location.href = '/dashboard'
    } catch (error) {
      const apolloError = error as ApolloError
      console.error('Unexpected error:', apolloError.message)
      console.log(apolloError.graphQLErrors)
    }
  }

  return (
    <>
      <button
        type="button"
        className="borderborder-black border-2 px-3 py-2 rounded-full font-semibold text-black hover:bg-primary hover:text-on-primary active:bg-tertiary-container"
        onClick={() => setShowModal(true)}
      >
        My Account
      </button>
      {showModal && (
        <>
          {/* modal */}
          <div className="modal-bg">
            {/* <Toast /> */}
            <div className=" opacity-100 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
              {' '}
              <div className="rounded relative w-full my-6 mx-auto max-w-xs">
                {/*content*/}
                <form onSubmit={handleLogin}>
                  <div className="border-0 rounded shadow-lg relative flex flex-col w-full bg-on-primary outline-none focus:outline-none">
                    {/*header*/}
                    <div className="flex items-center justify-center p-5 border-solid border-slate-200 rounded-t">
                      <h3 className="text-2xl font-semibold text-center">
                        Login
                      </h3>

                      <button
                        className="p-1 ml-auto bg-transparent border-0 opacity-60 text-error float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                        onClick={() => setShowModal(false)}
                      >
                        <Icon path={mdiCloseCircle} size={1} />
                      </button>
                    </div>
                    {/*body*/}
                    <div className="relative p-6 flex-auto">
                      <div>
                        <label className="pb-2 text-start block text-on-background text-sm font-light">
                          Email
                        </label>
                        <input
                          className="required:border-error invalid:border-error shadow border-0 focus:border-1 rounded w-full py-2 px-3 focus:outline-none focus:shadow-outline text-secondary"
                          id="email"
                          type="text"
                          placeholder="Email"
                          name="email"
                          onChange={(e) => setEmail(e.target.value)}
                          value={email}
                        />
                      </div>
                      <label className=" pt-5 pb-2 text-start block text-on-background text-sm font-light">
                        Password
                      </label>
                      <span className="flex justify-end items-center">
                        <input
                          className="required:border-error invalid:border-error shadow border-0 focus:border-1 rounded w-full py-2 px-3 focus:outline-none focus:shadow-outline text-secondary"
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Password"
                          name="password"
                          onChange={(e) => setPassword(e.target.value)}
                          value={password}
                        />
                        <button
                          type="button"
                          className="absolute mr-4 hover:text-info"
                          onClick={handleClick}
                        >
                          <Icon
                            path={
                              showPassword ? mdiEyeOutline : mdiEyeOffOutline
                            }
                            size={1}
                          />
                        </button>
                      </span>
                    </div>
                    {loggedin && (
                      <p className="text-success">
                        You are logged in successfully
                      </p>
                    )}
                    {/*footer*/}
                    <div className="flex justify-center items-center border-solid border-slate-200 rounded-b">
                      <div className="flex justify-center items-center h-20">
                        <button
                          className="borderborder-black border-2 px-10 py-1 rounded-full font-semibold text-black hover:bg-primary hover:text-on-primary active:bg-tertiary-container"
                          type="submit"
                        >
                          Login
                        </button>
                      </div>
                    </div>
                    <div className="font-light text-on-background text-xs pt-0 mx-1 pb-5 px-[10px]">
                      This site is protected by reCAPTCHA and the google{' '}
                      <a
                        className="text-primary hover:text-on-primary-container hover:font-semibold"
                        href="#"
                      >
                        Privacy Policy
                      </a>{' '}
                      and{' '}
                      <a
                        href="#"
                        className="text-primary hover:text-on-primary-container hover:font-semibold"
                      >
                        Terms of Service apply
                      </a>
                    </div>
                    <div className="flex justify-around items-center text-on-surface-variant">
                      <div className="px-3 py-2 hover:text-primary">
                        <a href="/registration">Registration</a>
                      </div>
                      <div className="px-3 py-5 hover:text-primary">
                        <a>Forgot Password</a>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      )}
    </>
  )
}

export default LoginModal
