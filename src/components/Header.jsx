import React, { useEffect, useState } from "react";
import "../style/Header.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faSearch,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import { faBell, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from "react-router-dom";
import NavbarSlider from './NavbarSlider'
const Header = () => {
  const [inputValue, setInputValue] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (inputValue !== "") {
      navigate(`/dashboard/searchdoctor/${inputValue}`);
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const [showButton, setShowButton] = useState(false);
  const [navState , setNavState] = useState(false)
  const trackWindowWidth = () => {
    if (window.innerWidth <= 800) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  };

  window.addEventListener("resize", trackWindowWidth);
  useEffect(() => {
    if (window.innerWidth <= 900) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  }, []);

  return (
    <div className="Header">
      <div className="head">
        {showButton ? (
          <button 
            onClick={() => {
              setNavState(!navState);
              
            }}
          >
            <FontAwesomeIcon
              icon={faBars}
              cursor="pointer"
              color="white"
              className="Bars"
            />
          </button>
        ) : (
          null
        )}
        { navState && showButton ? (
          <React.Fragment>
            <div className="show-nav">
              <NavbarSlider setNavState = {setNavState}/>
            </div>
          </React.Fragment>
        ) : 
        (
          null 
        )}
        <div>
        
          <FontAwesomeIcon icon={faBell} style={{marginRight: '1rem'}}/>
          <FontAwesomeIcon icon={faEnvelope} />
        </div>
      </div>
      <div className="head-operation">
        <Link to="/dashboard/addnewdoctor">
          <button>
            <FontAwesomeIcon
              icon={faPlus}
              cursor="pointer"
              color="white"
              style={{ marginRight: "1rem" }}
            />
            Add New
          </button>
        </Link>
        <div>
          <input
            type="text"
            placeholder="search by full name"
            onChange={handleInputChange}
            
          />
          <button onClick={handleSearch} style={{backgroundColor:'#009197', width:'4rem' , cursor:'pointer'}}>
            <FontAwesomeIcon
              icon={faSearch}
              size="1x"
              cursor="pointer"
              color="rgba(255,255,255,1)"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
