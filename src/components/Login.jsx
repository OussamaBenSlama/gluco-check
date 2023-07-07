import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../images/care.png";
import "../style/AdminLogin.css";
import { signInWithEmailAndPassword } from "firebase/auth";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  updateDoc,
  getDocFromServer,
  onSnapshot,
  getDocs,
} from "firebase/firestore";
import { db } from "../config/firebase";

const Login = () => {
  const userType = localStorage.getItem("userType");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const selectDoctor = async (Doctors, uid) => {
    if (Doctors.docs.filter((doc) => doc.data().id == uid).length == 0) {
      alert("user not found");
    }
    return Doctors.docs.filter((doc) => doc.data().id == uid)[0];
  };

  const selectAdmin = async (Admins, uid) => {
    if (Admins.docs.filter((doc) => doc.data().id == uid).length == 0) {
      alert("admin not found");
    }
    return Admins.docs.filter((doc) => doc.data().id == uid)[0];
  };

  const handleLogin = async () => {
    if (email === "" || password === "") {
      alert("Email and password are mandatory.");
      return;
    }

    // try {
    await signInWithEmailAndPassword(auth, email, password)
      .then(async (res) => {
        console.log("res baa333200: ", res.user.uid);

        if (userType == "medecin") {
          const dataDetrived = await getDocs(collection(db, "doctors"));

          const doctorInfos = await selectDoctor(dataDetrived, res.user.uid);

          localStorage.setItem("login", "true");
          localStorage.setItem("userType", "medecin");
          localStorage.setItem("userInfo", doctorInfos);
        }
        if (userType == "admin") {
          const dataDetrived = await getDocs(collection(db, "admins"));
          const adminInfos = await selectAdmin(dataDetrived, res.user.uid);

          localStorage.setItem("login", "true");
          localStorage.setItem("userType", "admin");
          localStorage.setItem("userInfo", adminInfos);
        }
      })
      .catch((err) => {
        alert(err);
      });
  };

  return (
    <div className="AdminLogin">
      <div className="background">
        <img src={logo} alt="logo" />
        <div className="login-form">
          <h2> Login </h2>{" "}
          <form>
            <label htmlFor="email"> Email: </label>{" "}
            <input
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              type="email"
              id="email"
            />
            <label htmlFor="password"> Password: </label>{" "}
            <input
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              type="password"
              id="password"
            />
            <Link to="/dashboard">
              <button onClick={handleLogin} type="submit">
                {" "}
                Sign In{" "}
              </button>{" "}
            </Link>{" "}
          </form>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
};

export default Login;
