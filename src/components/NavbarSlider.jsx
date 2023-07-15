import React, { useState } from "react";
import "../style/NavbarSlider.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserMd, faUsers ,faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {auth} from '../config/firebase'

const NavbarSlider = () => {
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
  const [navState, setNavState] = useState(false);
  return (
    <div className="NavbarSliderBackground">
      <div className="NavbarSlider">
          <div className="nav-element">
            <ul>
              <li>
                <Link to="/dashboard" className="nav-link">
                  <FontAwesomeIcon
                    icon={faUserMd}
                    color="white"
                    cursor="pointer"
                    style={{ marginRight: "1rem", fontSize: "1.5rem" }}
                  />
                  DOCTORS
                </Link>
              </li>
              <li>
                <Link to="/dashboard/patients" className="nav-link">
                <FontAwesomeIcon 
                icon={faUsers} 
                style={{marginRight:'0.5rem' , fontSize:'1rem'}}/>
                PATIENTS
                </Link>
              </li>
              <li>
                <label onClick={handleLogout}>Log Out</label>
                <FontAwesomeIcon icon={faSignOutAlt} color="white" />
              </li>
            </ul>
            
          </div>
        </div>
      </div>
    
  );
};

export default NavbarSlider;
