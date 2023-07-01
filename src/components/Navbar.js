import React from 'react';
import '../style/Navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { faUserMd } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className='Navbar'>
      <div>
        <div className='nav-head'>
        <FontAwesomeIcon icon={faTimes} size="2x" color="white" cursor="pointer" />
      </div>
      
      <div className='nav-element'>
        <ul>
          <li>
            <Link to="/destination" className='nav-link'>
              <FontAwesomeIcon icon={faUserMd} color="white" cursor="pointer" style={{ marginRight: '1rem', fontSize: '1.5rem' }} />
              DOCTEURS
            </Link>
          </li>
        </ul>
      </div>
      </div>
    </div>
  );
}

export default Navbar;
