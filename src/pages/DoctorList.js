import React, { useState } from "react";
import "../style/DoctorList.css";
import Navbar from "../components/Navbar";
import NavbarSlider from "../components/NavbarSlider";
import Header from "../components/Header";
import Doctors from "../components/Doctors";

const DoctorList = () => {
  const [navState, setNavState] = useState(false);
  return (
    <div className="DoctorList">
      <div className="left">
        {" "}
        <Navbar />
      </div>{" "}
      <div className="left">
        {" "}
        {navState ? (
          <NavbarSlider setNavState={setNavState} navState={navState} />
        ) : (
          ""
        )}{" "}
      </div>{" "}
      <div className="right">
        <Header setNavState={setNavState} navState={navState} /> <Doctors />
      </div>{" "}
    </div>
  );
};

export default DoctorList;
