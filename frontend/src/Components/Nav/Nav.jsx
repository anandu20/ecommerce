import React from 'react'
import '../Nav/Nav.scss'
import { Link } from 'react-router-dom';

const Nav = ({user,login}) => {
    console.log(user);
  return (
    <div className='navbar'>
      <nav>
        <div className="leftx">
        <h1>DAZZLER.COM</h1>

        </div>
        <div className="right">
            <div className="profile">
            <Link to="/userdetails"><img src="pic.jpg" alt="" /></Link>
            </div>
            <div className="name">
            <h2>{user}</h2>
            </div>
               
          <div className="names">
          <Link to="/cart"><img src="" alt="cart" /></Link>
          </div>
          <div className="names2">
          <Link to="/wishlist"><img src="" alt="wishlist" /></Link>
          </div>
            <div className="login">
            <Link to="/seller"><h2>{login}</h2></Link>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Nav
