import Icon from '@mdi/react'
import React, { useState } from 'react'
import axios from 'axios'
import { Navigate } from 'react-router-dom'
import { mdiCloseCircle, mdiEyeOffOutline, mdiEyeOutline } from '@mdi/js'
import './LoginModal.css'
// import Toast from '../Toast/Toast'
import httpClient from '../../config/httpClient'

// Define the shape of your state
interface LoginModalState {
  showModal: boolean
  showPassword: boolean
  email: string
  password: string
  loggedin: boolean
}

const LoginModal: React.FC = () => {
  const [showModal, setShowModal] =
    useState<LoginModalState['showModal']>(false)
  const [showPassword, setShowPassword] =
    useState<LoginModalState['showPassword']>(false)
  const [email, setEmail] = useState<LoginModalState['email']>('')
  const [password, setPassword] = useState<LoginModalState['password']>('')
  const [loggedin, setLoggedin] = useState<LoginModalState['loggedin']>(false)

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setShowPassword(!showPassword)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const resp = await httpClient.post('//localhost:5000/login', {
        email,
        password,
      })
      window.location.href = '/dashboard'
    } catch (error) {
      if (
        axios.isAxiosError(error) &&
        error.response &&
        error.response.status === 401
      ) {
        alert('Invalid credentials')
      }
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
                <form onSubmit={handleSubmit}>
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
