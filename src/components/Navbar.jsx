import React from 'react';
import '../style/DoctorInterfaceStyle/Navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserMd , faUsers , faSlidersH ,faBriefcaseMedical,faNotesMedical} from '@fortawesome/free-solid-svg-icons';
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
    const goGlycemie = () => {
      navigate('/dashboard/glycemie')
    }
    const goSpecialities = () => {
      navigate('/specialities')
    }
    const goServices = () => {
      navigate('/services')
    }
  return (
    <div className="Navbar">
      <div className="Doctor-nav">
        <img src={myLogo} alt="" />
        <h1>Administrator</h1> 
        <ul>
          <li onClick={goDoctors}>
            <FontAwesomeIcon icon={faUserMd} style={{marginRight:'0.5rem' , fontSize:'1rem' , width:'2rem'}}/>
            Doctors
            </li>
          <li onClick={goPatients}>
          <FontAwesomeIcon icon={faUsers} style={{marginRight:'0.5rem' , fontSize:'1rem' , width:'2rem'}}/>
          Patients</li>
          <li onClick={goGlycemie}>
          <FontAwesomeIcon icon={faSlidersH} style={{marginRight:'0.5rem' , fontSize:'1rem' , width:'2rem'}}/>
          Glycemie</li>
          <li onClick={goSpecialities}>
          <FontAwesomeIcon icon={faBriefcaseMedical} style={{marginRight:'0.5rem' , fontSize:'1rem' , width:'2.2rem'}}/>
          Specialities</li>
          <li onClick={goServices}>
          <FontAwesomeIcon icon={faNotesMedical} style={{marginRight:'0.5rem' , fontSize:'1rem' , width:'2.2rem'}}/>
          Services</li>
          <li>
            <label onClick={handleLogout}>Log Out</label>
          < FontAwesomeIcon icon={faSignOutAlt} color="white" />
          </li>
        </ul>
        
      </div>
    </div>
  );
}

export default Navbar;
