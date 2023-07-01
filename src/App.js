import './App.css';
import DoctorList from './pages/DoctorList'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLogin from './components/AdminLogin'
import NewDoctor from './pages/NewDoctor'
import SpecificDoctor from './pages/SpecificDoctor'
import EditDoctor from './pages/EditDoctor'
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
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;
