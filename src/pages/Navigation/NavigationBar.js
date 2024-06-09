import { useContext } from 'react'
import HowItWorks from '../HowItWorks/HowItWorks';
import Blog from '../Blog/Blog';
import LatestReviews from '../LatestReviews/LatestReviews';
import TopWriters from '../TopWriters/TopWriters';
import AboutUs from '../AboutUs/AboutUs';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import './Navigation.css';
import LoginModal from '../LoginModal/LoginModal';
import UserContext from '../../App'
import httpClient from '../../config/httpClient'

// const cookies = new Cookies();
// const token = cookies.get("TOKEN");


const NavigationBar = () => {

    const location = useLocation();
    const user = useContext(UserContext);
    

const logoutUser = async () => {
    await httpClient.post("//localhost:5000/logout");
    window.location.href = "/";
  };

    return (
        <>
        <nav className=''>
            <ul className='flex justify-around items-center'>
                <li>
                    <a href='/'>
                    <img src="/media/logo.png" alt="Any Day Logo" className="logo"></img>
                    </a>
                </li>
                <div className='flex justify-around'>
                { location.pathname == '/howitworks' ? <li className='pr-3'><Link to ='/howitworks' className='bg-primary rounded-full py-2 px-3 text-md text-black font-bold hover:text-on-primary'>How it works</Link></li> : <li className='pr-3'><Link to ='/howitworks' className='text-md text-black font-bold hover:text-primary'>How it works</Link></li>}
                { location.pathname == '/latestreviews' ? <li className='pr-3'><Link to ='/latestreviews' className='bg-primary rounded-full py-2 px-3 font-semibold text-black text-md hover:text-on-primary'>Latest reviews</Link></li> :<li className='pr-3'><Link to ='/latestreviews' className='font-semibold text-black text-md hover:text-primary'>Latest reviews</Link></li>}
                { location.pathname == '/topwriters' ? <li className='pr-3'><Link to ='/topwriters' className='bg-primary rounded-full py-2 px-3 text-md text-black font-bold hover:text-on-primary'>Top writers</Link></li> : <li className='pr-3'><Link to ='/topwriters' className='text-md text-black font-bold hover:text-primary'>Top writers</Link></li>}
                { location.pathname == '/samples' ? <li className='pr-3'><Link to ='/samples' className='bg-primary rounded-full py-2 px-3 text-md text-black font-bold hover:text-on-primary'>Samples</Link></li> : <li className='pr-3'><Link to ='/samples' className='text-md text-black font-bold hover:text-primary'>Samples</Link></li>}
                { location.pathname == '/blog' ? <li className=''><Link to ='/blog' className='bg-primary rounded-full py-2 px-3 text-md text-md text-black font-bold hover:text-on-primary'>Blog</Link></li> : <li className=''><Link to ='/blog' className='text-md text-black font-bold hover:text-primary'>Blog</Link></li>}
                </div>
                { user ? <div className='borderborder-black border-2 px-10 py-1 rounded-full font-semibold text-black hover:bg-primary hover:text-on-primary active:bg-tertiary-container' onClick={logoutUser}>Logout</div> : <li><LoginModal /></li>}
            </ul>
        </nav>
        </>
        
    )
}

export default NavigationBar;