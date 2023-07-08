import React from 'react'
import myLogo from '../../images/patient.png'
import '../../style/DoctorInterfaceStyle/Header.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {auth} from '../../config/firebase'
const Header = () => {
  
  const navigate = useNavigate();
    const handleLogout = async () => {
      try {
        await signOut(auth);
        navigate("/");
      } catch (error) {
        console.error("Error logging out:", error);
        
      }
    };
  return (
    <div className='Doctor-header'>
        <div className='Doctor-nav'>
            <img src={myLogo} alt="" />
            <h1>Oussama ben Slama</h1>
            <ul>
                <li>Home</li>
                <li>Edit profile</li>
                <li>List of Patients</li>
                <li>Add patient</li>
            </ul>
            <label onClick={handleLogout}>Log out </label>
            <FontAwesomeIcon icon={faSignOutAlt} color='white' />
        </div>
    </div>
  )
}

export default Header