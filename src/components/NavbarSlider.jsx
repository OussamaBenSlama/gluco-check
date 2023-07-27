import React, { useState } from "react";
import "../style/NavbarSlider.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserMd, faUsers ,faSignOutAlt , faSlidersH , faBars,faBriefcaseMedical,faNotesMedical } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {auth} from '../config/firebase'

const NavbarSlider = ({setNavState}) => {
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
    <div className="NavbarSliderBackground">
      <div className="NavbarSlider">
          <div style={{width:'100%' , textAlign:'right'}}>
            <button 
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
                color="white"
                style={{marginRight:'1rem' , fontSize:'1.5rem'}}/>
                PATIENTS
                </Link>
              </li>
              <li>
                <Link to= "/dashboard/glycemie" className="nav-link">
                <FontAwesomeIcon 
                icon={faSlidersH} 
                color="white"
                style={{marginRight:'1rem' , fontSize:'1.5rem'}}/>
                  GLYCEMIE
                </Link>
              </li>

              <li>
                <Link to= "/specialities" className="nav-link">
                <FontAwesomeIcon 
                icon={faBriefcaseMedical} 
                color="white"
                style={{marginRight:'1rem' , fontSize:'1.5rem'}}/>
                  Specialities
                </Link>
              </li>

              <li>
                <Link to= "/services" className="nav-link">
                <FontAwesomeIcon 
                icon={faNotesMedical} 
                color="white"
                style={{marginRight:'1rem' , fontSize:'1.5rem'}}/>
                  Services
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
