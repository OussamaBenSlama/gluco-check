import React, { useEffect, useState } from "react";
import "../style/Header.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSearch, faBars } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";

const HeaderPatient = ({ navState, setNavState }) => {
  const [inputValue, setInputValue] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (inputValue !== "") {
      navigate(`/dashboard/searchpatient/${inputValue}`);
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const [showButton, setShowButton] = useState(false);
  const trackWindowWidth = () => {
    if (window.innerWidth <= 750) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  };

  window.addEventListener("resize", trackWindowWidth);
  useEffect(() => {
    if (window.innerWidth <= 750) {
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
              style={{ marginRight: "1rem", fontSize: "1.5rem" }}
            />
          </button>
        ) : (
          ""
        )}
      </div>
      <div className="head-operation">
        <Link to="/dashboard/patients/addnewpatient">
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
        <div style={{ display: "flex" }}>
          <input
            type="text"
            placeholder="search by full name"
            onChange={handleInputChange}
          />
          <button onClick={handleSearch}>
            <FontAwesomeIcon
              icon={faSearch}
              size="1x"
              cursor="pointer"
              color="rgba(0, 0, 0, 0.7)"
            />
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default HeaderPatient;
