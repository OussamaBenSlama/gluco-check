import React from 'react';
import '../style/DoctorInterfaceStyle/Navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserMd , faUsers} from '@fortawesome/free-solid-svg-icons';
import myLogo from '../images/patient.png';
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
    const goDoctors = () => {
      navigate('/dashboard')
    }
    const goPatients = () => {
      navigate('/dashboard/patients')
    }
  return (
    <div className="Navbar">
      <div className="Doctor-nav">
        <img src={myLogo} alt="" />
        <h1>Administrator</h1> 
        <ul>
          <li onClick={goDoctors}>
            <FontAwesomeIcon icon={faUserMd} style={{marginRight:'0.5rem' , fontSize:'1rem'}}/>
            Doctors
            </li>
          <li onClick={goPatients}>
          <FontAwesomeIcon icon={faUsers} style={{marginRight:'0.5rem' , fontSize:'1rem'}}/>
          Patients</li>
        </ul>
        <label onClick={handleLogout}>Log Out</label>
        <FontAwesomeIcon icon={faSignOutAlt} color="white" />
      </div>
    </div>
  );
}

export default Navbar;
