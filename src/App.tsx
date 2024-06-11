import React, { createContext, useEffect, useState } from 'react';
import Helmet from 'react-helmet'
import { Routes, Route, Navigate } from 'react-router-dom'
import Tables from './pages/Tables/Tables'
import Settings from './pages/Settings/Settings'
import DashBoard from './pages/DashBoard/DashBoard'
import AuthPasswordReset from './pages/Authentication/AuthPasswordReset'
import Registration from './pages/Registration/Registration'
import Blog from './pages/Blog/Blog'
import Samples from './pages/Samples/Samples'
import TopWriters from './pages/TopWriters/TopWriters'
import Order from './pages/Order/Order'
import LatestReviews from './pages/LatestReviews/LatestReviews'
import HowItWorks from './pages/HowItWorks/HowItWorks'
import NavigationBar from './pages/Navigation/NavigationBar'
import httpClient from './config/httpClient'
import {ToastContainer, toast} from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";


interface UserInterface {
  id: string,
  email: string
}

export const UserContext = createContext<UserInterface | null>(null);

const App = () => {

  const [user, setUser] = useState<UserInterface | null>(null)

  useEffect(() => {
    (async () => {
      try {
        const resp = await httpClient.get("//localhost:5000/@me");
        setUser(resp.data);
      } catch (error) {
        console.log("Not authenticated");
        // setUser(null);
      }
    })();
  }, []);

  console.log(user)
  return (
    <div className="App">
    <Helmet>
                <meta charSet="utf-8" />
                <title>Essay Writing Service - We Do Essay Writing And Formatting</title>
                <link rel="canonical" href="http://mysite.com/example" />
                <meta name="description" content="Professional academic writing services" />
      </Helmet>
      {user !== null ? null : (<section className='px-6 py-2 bg-surface'><NavigationBar /></section>)}
      {/*<section className='px-6 py-8 bg-surface'>
        <NavigationBar /> 
      </section>*/}
  
      <UserContext.Provider value={user}>
        <ToastContainer/>
      <Routes>
        <Route path='/' element={
          <section className='bg-gradient-to-r to-primary from-secondary-container flex justify-around items-center p-10 h-50'>
          <div className=''>
            <p className='tracking-wider text-5xl pr-10'>Online Essay Writing Service </p>
            <p className='text-5xl tracking-wider mt-10'>Available 24/7</p>
            <p className='text-lg py-10'>We do all types of writing at the cheapest rates in town.</p>
          </div>
          <div>
            <Order/>
          </div>
        </section>
        }></Route>
        <Route path='/howitworks' element={<HowItWorks />}></Route>
        <Route path='/latestreviews' element={<LatestReviews />}></Route>
        <Route path='/topwriters' element={<TopWriters />}></Route>
        <Route path='/samples' element={<Samples />}></Route>
        <Route path='/blog' element={<Blog />}></Route>
        <Route path='/registration' element={<Registration />}></Route>
        <Route path='/auth_password_reset' element={<AuthPasswordReset />}></Route>
        <Route path="/dashboard" element={<DashBoard />}></Route>
        <Route path="/settings" element={<Settings />}></Route>
        <Route path="tables" element={<Tables />}></Route>
        {/*<Route path='/*' element={ <Navigate to="/dashboard" /> }/>*/}
      </Routes>
      </UserContext.Provider>
    </div>
  );
}

export default App;
