import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import store from './store/store'
import { Provider } from 'react-redux'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
)

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCpHrDRZ1VWnETEZM_0JtIUMPmduZZ-DxM',
  authDomain: 'anyday-frontend.firebaseapp.com',
  projectId: 'anyday-frontend',
  storageBucket: 'anyday-frontend.appspot.com',
  messagingSenderId: '941077074223',
  appId: '1:941077074223:web:4137270e5b9acf4efc51da',
  measurementId: 'G-55D2F57ZWM',
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
// Initialize Firebase
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)
