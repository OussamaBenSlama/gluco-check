import React, { useState, useEffect } from "react";
import "../style/Header.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faSearch,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import { faBell, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import NavbarSlider from "./NavbarSlider";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";

const Header = () => {
  const [inputValue, setInputValue] = useState("");
  const [searchOption, setSearchOption] = useState("name");
  const [specialities, setSpecialities] = useState([]);
  const navigate = useNavigate();

  // Fetch specialities from the 'specialities' collection
  useEffect(() => {
    const specialitiesRef = collection(db, "specialities");
    const getSpecialitiesList = async () => {
      try {
        const response = await getDocs(specialitiesRef);
        const fetchedData = response.docs.map((doc) => doc.data().name);
        setSpecialities(fetchedData);
      } catch (error) {
        console.error(error);
      }
    };

    getSpecialitiesList();
  }, []);

  const handleSearch = () => {
    if (inputValue.trim() !== "") {
      navigate(`/dashboard/searchdoctor`, {
        state: { searchOption, inputValue },
      });
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSearchOptionChange = (e) => {
    setSearchOption(e.target.value);
  };

  const [showButton, setShowButton] = useState(false);
  const [navState, setNavState] = useState(false);

  const trackWindowWidth = () => {
    if (window.innerWidth <= 800) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  };

  useEffect(() => {
    if (window.innerWidth <= 900) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  }, []);

  window.addEventListener("resize", trackWindowWidth);

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
        ) : null}
        {navState && showButton ? (
          <React.Fragment>
            <div className="show-nav">
              <NavbarSlider setNavState={setNavState} />
            </div>
          </React.Fragment>
        ) : null}
        <div>
          <FontAwesomeIcon icon={faBell} style={{ marginRight: "1rem" }} />
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
          <select
            value={searchOption}
            onChange={handleSearchOptionChange}
            style={{ marginRight: "0.5rem" }}
          >
            <option value="name">Search by Name</option>
            <option value="speciality">Search by Speciality</option>
          </select>
          {searchOption === "name" ? (
            <input
              type="text"
              placeholder="Search by full name"
              onChange={handleInputChange}
            />
          ) : (
            <select
              value={inputValue}
              onChange={handleInputChange}
              style={{ marginRight: "0.5rem" }}
            >
              <option value="">Select a Speciality</option>
              {specialities.map((speciality, index) => (
                <option key={index} value={speciality}>
                  {speciality}
                </option>
              ))}
            </select>
          )}
          <button
            onClick={handleSearch}
            style={{
              backgroundColor: "#009197",
              width: "4rem",
              cursor: "pointer",
            }}
          >
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
