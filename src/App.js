// App.js
import './App.css';
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route , Navigate} from "react-router-dom";
import DoctorList from "./pages/DoctorList";
import NewDoctor from "./pages/NewDoctor";
import SpecificDoctor from "./pages/SpecificDoctor";
import EditDoctor from "./pages/EditDoctor";
import Profile from "./pages/Profile";
import PatientList from "./pages/PatientList";
import Glycemie from './components/Glycemie'
import SpecificPatient from "./pages/SpecificPatient";
import EditPatient from "./pages/EditPatient";
import PatientProfile from "./pages/PatientProfile";
import Specialities from './pages/Specialities';
import Service from './pages/Services'
import MainPage from "./components/DoctorInterface/MainPage";
import ListPatient from './components/DoctorInterface/ListPatient'
import EditProfile from './components/DoctorInterface/EditProfile'
import SearchCurrentPatient from './components/DoctorInterface/SearchCurrentPatient'
import AddPatient from './components/DoctorInterface/AddPatient'
import GlycemieRange from './components/DoctorInterface/GlycemieRange'
import Diagrammes from './components/DoctorInterface/Diagrammes'
import PatientGraphic from './components/DoctorInterface/PatientGraphic'
import PatientPro from './components/DoctorInterface/PatientProfile'
import WelcomeScreen from "./components/WelcomeScreen";
import Login from './components/Login'
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db, auth } from "./config/firebase";

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [userType, setUserType] = useState("");

  useEffect(() => {
    const checkUserType = async (user) => {
      if (user) {
        const adminsRef = collection(db, "admins");
        const adminsSnapshot = await getDocs(adminsRef);
        const adminUsers = adminsSnapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }));

        const adminUser = adminUsers.find(
          (admin) => admin.data.id === user.uid
        );

        if (adminUser) {
          setAuthenticated(true);
          setUserType("admin");
          return;
        }

        const doctorsRef = collection(db, "doctors");
        const doctorsSnapshot = await getDocs(doctorsRef);
        const doctorUsers = doctorsSnapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }));
        

        const doctorUser = doctorUsers.find(
          (doctor) => doctor.data.id === user.uid
        );
        
        if (doctorUser) {
          setAuthenticated(true);
          setUserType("doctor");
          return;
        }

        setAuthenticated(false);
        setUserType("");
      } else {
        setAuthenticated(false);
        setUserType("");
      }
      
    };
    
    const unsubscribe = auth.onAuthStateChanged((user) => {
      checkUserType(user);
    });
    
    return () => unsubscribe();
  }, []);

  return (
  <Router>
  <div className="App">
  <Routes>
  {!authenticated ? (
    <React.Fragment>
      <Route exact path="/"  element={<WelcomeScreen />} />
      <Route exact path="/*"  element={<Navigate to="/" />} />
      <Route exact path="/login/:userType"  element={<Login />} />
    </React.Fragment>
  ) : (
    <React.Fragment>
      {userType === "admin" ? (
        <React.Fragment>
          
          <Route exact path="/*"  element={<Navigate to="/dashboard" />} />
          <Route exact path="/dashboard"  element={<DoctorList />} />
          <Route exact path="/dashboard/addnewdoctor"  element={<NewDoctor />} />
          <Route exact path="/dashboard/searchdoctor"  element={<SpecificDoctor />} />
          <Route exact path="/dashboard/editdoctor/:text"  element={<EditDoctor />} />
          <Route exact path="/dashboard/:text"  element={<Profile />} />
          <Route exact path="/dashboard/patients"  element={<PatientList />} />
          <Route exact path="/dashboard/glycemie"  element={<Glycemie />} /> 
          <Route exact path="/dashboard/patient/searchpatient/:text"  element={<SpecificPatient />} />
          <Route exact path="/dashboard/patient/editpatient/:text"  element={<EditPatient />} />
          <Route exact path="/dashboard/patient/profile/:text"  element={<PatientProfile />} />
          <Route exact path="/specialities"  element={<Specialities />} />
          <Route exact path="/services"  element={<Service/>} />
        </React.Fragment>
      ) : userType === "doctor" ? (
        <React.Fragment>
          <Route exact path="/doctorspace"  element={<MainPage />} />
          <Route exact path="/*"  element={<Navigate to="/doctorspace" />} />
          <Route exact path="/doctorspace/listpatients"  element={<ListPatient />} />
          <Route exact path="/doctorspace/editprofile"  element={<EditProfile />} />
          <Route exact path="/doctorspace/searchpatient/:text"  element={<SearchCurrentPatient />} />
          <Route exact path="/doctorspace/addpatient"  element={<AddPatient />} />
          <Route exact path="/doctorspace/glycemie-range"  element={<GlycemieRange />} />
          <Route exact path="/doctorspace/statistics"  element={<Diagrammes />} />
          <Route exact path="/doctorspace/patient"  element={<PatientPro/>} />
          <Route exact path="/doctorspace/patient/graphic"  element={<PatientGraphic/>} />
        </React.Fragment>
      ) : null}
    </React.Fragment>
  )}
</Routes>

  </div>
  </Router>
  );
  }
  
export default App;    