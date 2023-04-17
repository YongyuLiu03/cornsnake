import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// import './Navbar.css';
import {UserContext} from './UserContext';
import { useContext } from 'react';

function Navbar() {
    const {setUserInfo, userInfo} = useContext(UserContext);
    const [click, setClick] = useState(false);

    const handleClick = () => setClick(!click);
    const closeMobileMenu = () => setClick(false);
    // useEffect(() => {
    //     fetch("http://localhost:3001/api/userinfo", {
    //         credentials: 'include'
    //     }).then(res => {
    //         console.log(res)
    //         if (res) {
    //             res.json().then(userInfo => {
    //                 setUserInfo(userInfo);
    //             });
    //         }
    //     });
    // }, []);

    function logout() {
        fetch("http://localhost:3001/api/logout", {
            credentials: 'include',
        });
        setUserInfo(null);
    }

    const username = userInfo?.username;




  return (
    <>
      <nav className='navbar'>
        <div className='navbar-container'>
          <Link to='/' className='navbar-logo' onClick={closeMobileMenu}>
            <img src='./img/corn.png' height={80} width={80} />
          </Link>
          <div className='menu-icon' onClick={handleClick}>
            <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
          </div>
          <ul className={click ? 'nav-menu active' : 'nav-menu'}>
            <li className='nav-item'>
              <Link to='/' className='nav-links' onClick={closeMobileMenu}>
                Home
              </Link>
            </li>
            <li className='nav-item'>
              <Link
                to='/about'
                className='nav-links'
              >
                About
              </Link>
            </li>
            <li className='nav-item'>
              <Link
                to='/morph'
                className='nav-links'
              >
                Morph
              </Link>
            </li>
            <li>
              <Link
                to='/mine'
                className='nav-links-mobile'
              >
                Mine
              </Link>
            </li>
            <li>
              <Link
                to='/comment'
                className='nav-links-mobile'
              >
                Comment
              </Link>
            </li>
            {username && (
                <li>
                    <a
                    className='nav-links-mobile'
                    onClick={logout}>
                    Logout {{username}}
                    </a>
                </li>
            )}
            {!username && (
                <>
                <li>
                    <Link
                    to='/register'
                    className='nav-links-mobile'
                    onClick={closeMobileMenu}>
                    Sign Up
                    </Link>
                </li>
                <li>
                    <Link
                    to='/login'
                    className='nav-links-mobile'
                    onClick={closeMobileMenu}>
                    Sign In
                </Link>
                </li>
            </>
            )}

          </ul>
        </div>
      </nav>
    </>
  );
}

export default Navbar;