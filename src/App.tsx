import React, { createContext, useEffect, useState } from 'react'
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
  from,
  ApolloLink,
  concat,
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'
import Helmet from 'react-helmet'
import {
  Routes,
  Route,
  Navigate,
  BrowserRouter as Router,
  useLocation,
} from 'react-router-dom'
import { UserProvider } from './userContext'
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
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import CompleteRegistration from './pages/CompleteRegistration/CompleteRegistration'
import PrivateRoutes from './utils/PrivateRoutes'
import PageNotFound from './pages/PageNotFound/PageNotFound'
import RedirectIfLoggedIn from './components/RedirectLoggedIn/RedirectLoggedIn'

interface UserInterface {
  id: string
  email: string
}

const baseUrl = process.env.REACT_APP_BACKEND_URL
  ? `${process.env.REACT_APP_BACKEND_URL}/graphql`
  : 'https://anyday-backend-app-hufozn77kq-uc.a.run.app/graphql'

const httpLink = new HttpLink({
  uri: baseUrl,
  fetchOptions: {},
  headers: {},
})

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token')
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }
})

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      )
    })
  }
  if (networkError) {
    console.log(`[Network error]: ${networkError}`)
  }
})

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),
  credentials: 'include',
})

const App = () => {
  const token = localStorage.getItem('token')

  const location = useLocation()
  const hideComponent =
    location.pathname === '/complete-registration' || token !== null

  console.log('Environment varriable', baseUrl)

  return (
    <ApolloProvider client={client}>
      <UserProvider>
        <div className="App">
          <Helmet>
            <meta charSet="utf-8" />
            <title>
              Essay Writing Service - We Do Essay Writing And Formatting
            </title>
            <link rel="canonical" href="http://mysite.com/example" />
            <meta
              name="description"
              content="Professional academic writing services"
            />
          </Helmet>
          {/* {token !== null ? null : (
        <section className="px-6 py-2 bg-surface">
          <NavigationBar />
        </section>
      )} */}
          {/*<section className='px-6 py-8 bg-surface'>
        <NavigationBar /> 
      </section>*/}
          {/* {!hideComponent && <NavigationBar />} */}
          <ToastContainer />
          <Routes>
            <Route element={<PrivateRoutes />}>
              {/* <Route path="/dashboard" element={<DashBoard />}></Route> */}
            </Route>
            <Route path="/dashboard" element={<DashBoard />}></Route>
            <Route
              path="/"
              element={
                <RedirectIfLoggedIn>
                  <section className="bg-gradient-to-r to-primary from-secondary-container flex justify-around items-center p-10 h-50">
                    <div className="">
                      <p className="tracking-wider text-5xl pr-10">
                        Online Essay Writing Service{' '}
                      </p>
                      <p className="text-5xl tracking-wider mt-10">
                        Available 24/7
                      </p>
                      <p className="text-lg py-10">
                        We do all types of writing at the cheapest rates in
                        town.
                      </p>
                    </div>
                    <div>
                      <Order />
                    </div>
                  </section>
                </RedirectIfLoggedIn>
              }
            ></Route>
            <Route
              path="/complete-registration"
              element={<CompleteRegistration />}
            ></Route>
            <Route path="/howitworks" element={<HowItWorks />}></Route>
            <Route path="/latestreviews" element={<LatestReviews />}></Route>
            <Route path="/topwriters" element={<TopWriters />}></Route>
            <Route path="/samples" element={<Samples />}></Route>
            <Route path="/blog" element={<Blog />}></Route>
            <Route path="/registration" element={<Registration />}></Route>
            <Route
              path="/auth_password_reset"
              element={<AuthPasswordReset />}
            ></Route>
            {/* <Route path="/dashboard" element={<DashBoard />}></Route> */}
            <Route path="/settings" element={<Settings />}></Route>
            <Route path="tables" element={<Tables />}></Route>
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </div>
      </UserProvider>
    </ApolloProvider>
  )
}

export default App
