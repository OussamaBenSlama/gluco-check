import React from 'react';
import '../style/Navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserMd } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className='Navbar'>
      <div>
        {/* <div className='nav-head'>
        <FontAwesomeIcon icon={faTimes} size="2x" color="white" cursor="pointer" />
      </div> */}
      
      <div className='nav-element'>
        <ul>
          <li>
            <Link to="/dashboard" className='nav-link'>
              <FontAwesomeIcon icon={faUserMd} color="white" cursor="pointer" style={{ marginRight: '1rem', fontSize: '1.5rem' }} />
              DOCTORS
            </Link>
          </li>
          <li>
            <Link to="/dashboard/patients" className='nav-link'>
              <FontAwesomeIcon icon={faUserMd} color="white" cursor="pointer" style={{ marginRight: '1rem', fontSize: '1.5rem' }} />
              PATIENTS
            </Link>
          </li>
        </ul>
      </div>
      </div>
    </div>
  );
}

export default Navbar;
