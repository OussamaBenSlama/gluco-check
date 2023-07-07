import './App.css';
import React from 'react'
import DoctorList from './pages/DoctorList'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from "./components/Login";
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
import { auth } from "./config/firebase";
// import { onAuthStateChanged } from "firebase/auth";

function App() {
  const [authenticated, setAuthenticated] = useState(!!auth.currentUser);
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<WelcomeScreen />} />
          <Route path="/login" element={<Login />} />

          {localStorage.getItem("userType") == "admin" ? (
            <React.Fragment>
              <Route
                path={authenticated ? "/" : "/dashboard"}
                element={<DoctorList />}
              />
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
          ) : (
            ""
          )}

          {localStorage.getItem("userType") == "admin" &&
          localStorage.getItem("login") == "true" ? (
            <Route
              path={authenticated ? "/" : "/doctorspace"}
              element={<MainPage />}
            />
          ) : (
            ""
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;