import React from "react";
import "../style/NavbarSlider.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserMd, faBars } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const NavbarSlider = ({ setNavState, navState }) => {
  return (
    <div className="NavbarSliderBackground">
      <div className="NavbarSlider">
        <div>
          {/* <div className='nav-head'>
        <FontAwesomeIcon icon={faTimes} size="2x" color="white" cursor="pointer" />
      </div> */}
          <button
            onClick={() => {
              setNavState(!navState);
            }}
          >
            <FontAwesomeIcon
              icon={faBars}
              cursor="pointer"
              color="white"
              style={{ marginRight: "1rem", fontSize: "1.5rem" }}
            />
          </button>
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
                  DOCTEURS
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavbarSlider;
