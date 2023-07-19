import React, { useState } from "react";
import "../../style/NavbarSlider.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt , faBars } from '@fortawesome/free-solid-svg-icons';
import { signOut } from 'firebase/auth';
import { useNavigate} from 'react-router-dom';
import { auth } from '../../config/firebase';

const NavbarSlider = ({doctor , setNavState}) => {
  
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
  };

  const goedit = () => {
    navigate('/doctorspace/editprofile', { state: { doctor } });
  };

  const gohome = () => {
    navigate('/doctorspace')
  };

  const goAdd = () => {
    navigate('/doctorspace/addpatient', { state: { doctor } });
  };

  const gomodify = () => {
    navigate('/doctorspace/glycemie-range', { state: { doctor } });
  };

  const goStats = () => {
    navigate('/doctorspace/statistics', { state: { doctor } });
  };

  return (
    <div className="NavbarSliderBackground">
      <div className="NavbarSlider">
        <div style={{textAlign : 'right'}}>
              <button style={{zIndex : '16'}}
               onClick={() => {
                setNavState(false);
                          
                }}
                >
                <FontAwesomeIcon
                icon={faBars}
                cursor="pointer"
                color="white"
                className="Bars-slider"
                />
              </button>
        </div>
        <div className="nav-element">
          <ul>
            <li onClick={gohome}>Profile</li>
            <li onClick={goedit}>Edit profile</li>
            <li onClick={golistpatients}>List of Patients</li>
            <li onClick={goAdd}>Add patient</li>
            <li onClick={gomodify}>Glycemie Range</li>
            <li onClick={goStats}>Statistics</li>
            <li>
                <label onClick={handleLogout}>Log out</label>
                <FontAwesomeIcon icon={faSignOutAlt} color="white" />
            </li>
          </ul>
          
        </div>
      </div>
    </div>
  );
};

export default NavbarSlider;
