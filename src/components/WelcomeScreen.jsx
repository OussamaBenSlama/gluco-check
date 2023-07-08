// WelcomeScreen.js
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../images/care.png";
import "../style/AdminLogin.css";

const WelcomeScreen = () => {
  const navigate = useNavigate();

  const handleLoginPage = (userType) => {
    navigate(`/login/${userType}`);
  };

  return (
    <div className="AdminLogin">
      <div className="background">
        <img src={logo} alt="logo" />

        <div className="login-form">
          <h2>Gluco chek</h2>
          <button onClick={() => handleLoginPage("admin")}>Admin</button>
          <button onClick={() => handleLoginPage("doctor")}>Doctor</button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
