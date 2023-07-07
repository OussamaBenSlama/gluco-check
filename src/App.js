import './App.css';
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import DoctorList from "./pages/DoctorList";
import NewDoctor from "./pages/NewDoctor";
import SpecificDoctor from "./pages/SpecificDoctor";
import EditDoctor from "./pages/EditDoctor";
import Profile from "./pages/Profile";
import PatientList from "./pages/PatientList";
import NewPatient from "./pages/NewPatient";
import SpecificPatient from "./pages/SpecificPatient";
import EditPatient from "./pages/EditPatient";
import PatientProfile from "./pages/PatientProfile";
import MainPage from "./components/DoctorInterface/MainPage";
import WelcomeScreen from "./components/WelcomeScreen";
import Login from './components/Login'
import { auth } from "./config/firebase";

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setAuthenticated(true);
        navigate("/dashboard"); // Redirect to "/dashboard" when authenticated
      } else {
        setAuthenticated(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  return (
    <Router>
      <div className="App">
        <Routes>
          {!authenticated ? (
            <Route path="/" element={<WelcomeScreen />} />
          ) : (
            <Route path="/" element={<DoctorList />} />
          )}

          {!authenticated ? <Route path="/login" element={<Login />} /> : null}

          {authenticated && (
            <React.Fragment>
              <Route path="/dashboard" element={<DoctorList />} />
              <Route path="/dashboard/addnewdoctor" element={<NewDoctor />} />
              <Route
                path="/dashboard/searchdoctor/:text"
                element={<SpecificDoctor />}
              />
              <Route
                path="/dashboard/editdoctor/:text"
                element={<EditDoctor />}
              />
              <Route path="/dashboard/:text" element={<Profile />} />
              <Route path="/dashboard/patients" element={<PatientList />} />
              <Route
                path="/dashboard/patients/addnewpatient"
                element={<NewPatient />}
              />
              <Route
                path="/dashboard/patient/searchpatient/:text"
                element={<SpecificPatient />}
              />
              <Route
                path="/dashboard/patient/editpatient/:text"
                element={<EditPatient />}
              />
              <Route
                path="/dashboard/patient/profile/:text"
                element={<PatientProfile />}
              />
            </React.Fragment>
          )}

          {authenticated && localStorage.getItem("userType") === "admin" && (
            <Route path="/doctorspace" element={<MainPage />} />
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;