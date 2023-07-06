import './App.css';
import DoctorList from './pages/DoctorList'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLogin from './components/AdminLogin'
import NewDoctor from './pages/NewDoctor'
import SpecificDoctor from './pages/SpecificDoctor'
import EditDoctor from './pages/EditDoctor'
import Profile from './pages/Profile'
import PatientList from './pages/PatientList'
import NewPatient from './pages/NewPatient'
import SpecificPatient from './pages/SpecificPatient'
import EditPatient from './pages/EditPatient'
import PatientProfile from './pages/PatientProfile'
function App() {
  return (
    <Router>
      <div className="App">
        
        <Routes>
          <Route path="/"  element={<AdminLogin/>} />
          <Route path="/dashboard"  element={<DoctorList />} />
          <Route path="/dashboard/addnewdoctor"  element={<NewDoctor />} />
          <Route path="/dashboard/searchdoctor/:text" element={<SpecificDoctor />} />
          <Route path="/dashboard/editdoctor/:text" element={<EditDoctor />} />
          <Route path="/dashboard/:text" element={<Profile />} />
          <Route path="/dashboard/patients" element={<PatientList/>} />
          <Route path="/dashboard/patients/addnewpatient" element={<NewPatient/>} />
          <Route path="/dashboard/patient/searchpatient/:text" element={<SpecificPatient/>} />
          <Route path="/dashboard/patient/editpatient/:text" element={<EditPatient/>} />
          <Route path="/dashboard/patient/profile/:text" element={<PatientProfile/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
