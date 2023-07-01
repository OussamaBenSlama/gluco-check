import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../images/care.png';
import "../style/AdminLogin.css";

const AdminLogin = () => {
  return (
    <div className='AdminLogin'>
      <div className='background'>
        <img src={logo} alt="logo" />

        <div className="login-form">
          <h2>Login</h2>

          <form>
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" />

            <label htmlFor="password">Password:</label>
            <input type="password" id="password" />

            <Link to="/dashboard">
              <button type="submit">Sign In</button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
