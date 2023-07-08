import React from 'react';
import '../style/Navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserMd } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import {
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {auth} from '../config/firebase'


const Navbar = () => {
  const navigate = useNavigate();
    const handleLogout = async () => {
      try {
        await signOut(auth);
        navigate("/");
      } catch (error) {
        console.error("Error logging out:", error);
        // Handle any error that occurred during logout
        // Display an error message or take appropriate action
      }
    };
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
        <div className='logout'>
            <label onClick={handleLogout}>Log out </label>
            <FontAwesomeIcon icon={faSignOutAlt} />
          </div>
      </div>
          
      </div>
      
    </div>
  );
}

export default Navbar;
