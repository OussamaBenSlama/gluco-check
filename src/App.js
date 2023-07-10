// App.js
import './App.css';
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
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
import ListPatient from './components/DoctorInterface/ListPatient'
import EditProfile from './components/DoctorInterface/EditProfile'
import SearchCurrentPatient from './components/DoctorInterface/SearchCurrentPatient'
import AddPatient from './components/DoctorInterface/AddPatient'
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
        console.log(doctorUser)
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
      console.log(authenticated);
      console.log(userType);
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
  <>
  <Route path="/" element={<WelcomeScreen />} />
  <Route path="/login/:userType" element={<Login />} />
  </>
  ) : (
  <>
  {userType === "admin" ? (
  <>
  <Route path="/" element={<DoctorList />} />
  <Route path="/dashboard" element={<DoctorList />} />
  <Route path="/dashboard/addnewdoctor" element={<NewDoctor />} />
  <Route path="/dashboard/searchdoctor/:text" element={<SpecificDoctor />} />
  <Route path="/dashboard/editdoctor/:text" element={<EditDoctor />} />
  <Route path="/dashboard/:text" element={<Profile />} />
  <Route path="/dashboard/patients" element={<PatientList />} />
  <Route path="/dashboard/patients/addnewpatient" element={<NewPatient />} />
  <Route path="/dashboard/patient/searchpatient/:text" element={<SpecificPatient />} />
  <Route path="/dashboard/patient/editpatient/:text" element={<EditPatient />} />
  <Route path="/dashboard/patient/profile/:text" element={<PatientProfile />} />
  </>
  ) : userType === "doctor" ? (
  <>
  <Route path="/doctorspace" element={<MainPage />} />
  <Route path="/doctorspace/listpatients" element={<ListPatient />} />
  <Route path="/doctorspace/editprofile" element={<EditProfile />} />
  <Route path="/doctorspace/searchpatient/:text" element={<SearchCurrentPatient />} />
  <Route path="/doctorspace/addpatient" element={<AddPatient />} />
  </>
  ) : null}
  </>
  )}
  </Routes>
  </div>
  </Router>
  );
  }
  
export default App;    