import React from 'react';
import myLogo from '../../images/patient.png';
import '../../style/DoctorInterfaceStyle/Navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../config/firebase';

const Navbar = ({ doctor }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  const golistpatients = () => {
    navigate('/doctorspace/listpatients')
  }
  const goedit = () => {
    navigate('/doctorspace/editprofile', { state: { doctor } });
  }
  const gohome = () => {
    navigate('/doctorspace')
  }
  const goAdd = () => {
    navigate('/doctorspace/addpatient', { state: { doctor } });
  }
  return (
    <div className="Navbar">
      <div className="Doctor-nav">
        <img src={myLogo} alt="" />
        <h1>{doctor ? doctor.data.name : 'Guest'}</h1>
        <ul>
          <li onClick={gohome}>Profile</li>
          <li onClick={goedit}>Edit profile</li>
          <li onClick={golistpatients}>List of Patients</li>
          <li onClick={goAdd}>Add patient</li>
        </ul>
        <label onClick={handleLogout}>Log out</label>
        <FontAwesomeIcon icon={faSignOutAlt} color="white" />
      </div>
    </div>
  );
};

export default Navbar;
