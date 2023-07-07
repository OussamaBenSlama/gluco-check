import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../images/care.png";
import "../style/AdminLogin.css";

const WelcomeScreen = () => {
  const navigate = useNavigate();
  const handleLoginPage = (type) => {
    localStorage.setItem("userType", type);
    navigate("/login");
  };

  return (
    <div className="AdminLogin">
      <div className="background">
        <img src={logo} alt="logo" />

        <div className="login-form">
          <h2>Gluco chek</h2>
          {/* <form>
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" />

            <label htmlFor="password">Password:</label>
            <input type="password" id="password" />

            <Link to="/dashboard">
              <button type="submit">Sign In</button>
            </Link>
          </form> */}
          
          <button onClick={() => handleLoginPage("admin")}>Admin</button>
          <button onClick={() => handleLoginPage("medecin")}>Medecin</button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
