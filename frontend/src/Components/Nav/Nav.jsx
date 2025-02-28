
import React from 'react'
import '../Nav/Nav.scss'
import { Link } from 'react-router-dom';

const Nav = ({user,login}) => {
    console.log(user);
  return (
    <div className='navbar'>
      <nav>
        <div className="leftx">
          <Link to={'/'}> <h2 >Dazzler.com</h2>  </Link>

        </div>
        <div className="right">
            <div className="profile">
            <Link to="/userdetails"><img src="/pic.jpg" alt="" /></Link>
            </div>
            <div className="name">
            <h2>{user}</h2>
            </div>
         
            {login === 'Seller' && (
               <>
            <div className="login">
              <Link to="/seller"><h2>{login}</h2></Link>
            </div>
            </>
            )}
                
          <div className="names">
          <Link to="/cart"><img src="/cart.png" alt="cart" /></Link>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Nav
