// import React, { useContext } from 'react'
// import { Link, useLocation } from 'react-router-dom'
// import './NavigationBar.css'
// import LoginModal from '../LoginModal/LoginModal'
// import UserContext from '../../App'
// import httpClient from '../../config/httpClient'

// interface NavigationBarProps {}

// export const NavigationBar = ({}: NavigationBarProps) => {
//   const location = useLocation()
//   const user = useContext(UserContext)

//   const logoutUser = async () => {
//     await httpClient.post('//localhost:5000/logout')
//     window.location.href = '/'
//   }

//   const links = [
//     { to: '/howitworks', label: 'How it works' },
//     { to: '/latestreviews', label: 'Latest reviews' },
//     { to: '/topwriters', label: 'Top writers' },
//     { to: '/samples', label: 'Samples' },
//     { to: '/blog', label: 'Blog' },
//   ]

//   return (
//     <nav className="storybook-navigation-bar">
//       <Link to="/">
//         <img
//           src="/media/logo.png"
//           alt="Any Day Logo"
//           className="storybook-navigation-bar__logo"
//         />
//       </Link>
//       <div className="storybook-navigation-bar__links">
//         {links.map((link) => (
//           <Link
//             key={link.to}
//             to={link.to}
//             className={`storybook-navigation-bar__link ${
//               location.pathname === link.to
//                 ? 'storybook-navigation-bar__link--active'
//                 : ''
//             }`}
//           >
//             {link.label}
//           </Link>
//         ))}
//       </div>
//       {user ? (
//         <div className="storybook-navigation-bar__logout" onClick={logoutUser}>
//           Logout
//         </div>
//       ) : (
//         <LoginModal />
//       )}
//     </nav>
//   )
// }
