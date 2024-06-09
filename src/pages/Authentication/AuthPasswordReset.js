import Icon from "@mdi/react";
import { useEffect, useState } from "react"
import { mdiCloseCircle, mdiEyeOffOutline, mdiEyeOutline } from '@mdi/js';
import './AuthPasswordReset.css';

const AuthPasswordReset = () => {

    const [showModal, setShowModal] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleClick = (e) => {
        e.preventDefault();
        if(showPassword) {
            setShowPassword(false);
        } else {
            setShowPassword(true);
        }


    }

    return (
        <>
        {/* modal */}
        <div className="modal-bg">
        <div className=" opacity-100 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">            <div className="rounded relative w-full my-6 mx-auto max-w-xs">
              {/*content*/}
              <div className="border-0 rounded shadow-lg relative flex flex-col w-full bg-on-primary outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-center justify-center p-5 border-solid border-slate-200 rounded-t">
                  <h3 className="text-md font-semibold text-center">
                    We will email you a temporary link to reset you password.
                  </h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 opacity-60 text-error float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <Icon path={mdiCloseCircle} size={1}></Icon>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">

                <div><label className="pb-2 text-start block text-on-background text-sm font-light">Email</label>
            <input  className="required:border-error invalid:border-error shadow border-0 focus:border-1 rounded w-full py-2 px-3 focus:outline-none focus:shadow-outline text-secondary" id="email" type="text" placeholder="Email"></input></div>
            <label className=" pt-5 pb-2 text-start block text-on-background text-sm font-light">Security code</label>
            {/* <span className="flex justify-end items-center">
            {showPassword ? <input  className="required:border-error invalid:border-error shadow border-0 focus:border-1 rounded w-full py-2 px-3 focus:outline-none focus:shadow-outline text-secondary" id="email" type="text" placeholder="Password"></input> : <input  className="required:border-error invalid:border-error shadow border-0 focus:border-1 rounded w-full py-2 px-3 focus:outline-none focus:shadow-outline text-secondary" id="email" type="password" placeholder="Password"></input>}
            <button className="absolute mr-4 hover:text-info" onClick={handleClick}>
                {showPassword ? <Icon path={ mdiEyeOutline } size={1} className=''></Icon> : <Icon path={ mdiEyeOffOutline } size={1} className=''></Icon>}
            </button>
            </span> */}
                </div>
                {/*footer*/}
                <div className="flex justify-center items-center border-solid border-slate-200 rounded-b">

                  <div className=' h-20'>
                    <div>
                <button className="borderborder-black border-2 px-10 py-1 rounded-full font-semibold text-black hover:bg-primary hover:text-on-primary active:bg-tertiary-container" type="button" onClick={''}>Submit</button>
                </div>
                <div className="mb-5 mt-2 text-center font-normal text-xs text-secondary">Have an account? <a className="text-primary" onClick=""><strong>Login</strong></a></div>
            </div>
                </div>
                {/* <div className='font-light text-on-background border-b text-xs pt-0 mx-1 pb-5'>This site is protected by reCAPTCHA and the google <a className='text-primary hover:text-on-primary-container hover:font-semibold' href='#'>Privacy Policy</a> and <a href='#' className='text-primary hover:text-on-primary-container hover:font-semibold'>Terms of Service apply</a></div> */}
                {/* <div className="flex justify-around items-center text-on-surface-variant">
                    <div className="px-3 py-2 hover:text-primary"><a href="/registration">Registration</a></div>
                    <div className="px-3 py-5 hover:text-primary"><a>Forgot Password</a></div>
                </div> */}
              </div>
            </div>
          </div>
          </div>
          </>
    )

}

export default AuthPasswordReset;