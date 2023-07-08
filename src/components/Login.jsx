// Login.js
import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import logo from "../images/care.png";
import "../style/AdminLogin.css";
import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, doc, getDocs } from "firebase/firestore";
import { db, auth } from "../config/firebase";

const Login = () => {
  const { userType } = useParams();
  
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (email === "" || password === "") {
      alert("Email and password are mandatory.");
      return;
    }
  
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      
      if (userType === "admin") {
        const adminsRef = collection(db, "admins");
        const adminQuerySnapshot = await getDocs(adminsRef);
        const adminDocument = adminQuerySnapshot.docs.find(
          (doc) => doc.data().id === user.uid
        );
        // console.log(adminDocument)
        if (adminDocument) {
          navigate("/dashboard");
        } else {
          alert("Admin not found.");
        }
      } else if (userType === "doctor") {
        const doctorsRef = collection(db, "doctors");
        const doctorQuerySnapshot = await getDocs(doctorsRef);
        const doctorDocument = doctorQuerySnapshot.docs.find(
          (doc) => doc.data().id === user.uid
        );
  
        if (doctorDocument) {
          navigate("/doctorspace");
        } else {
          alert("Doctor not found.");
        }
      }
    } catch (error) {
      alert(error.message);
    }
  };
  
  return (
    <div className="AdminLogin">
      <div className="background">
        <img src={logo} alt="logo" />
        <div className="login-form">
          <h2>Login</h2>
          <form>
            <label htmlFor="email">Email:</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              id="email"
            />
            <label htmlFor="password">Password:</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              id="password"
            />
            <button onClick={handleLogin} type="button">
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
