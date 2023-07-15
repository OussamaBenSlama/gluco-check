import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Header from './Header';
import Home from './Home';
import PatientCard from './PatientCard';
import '../../style/DoctorList.css';
import { auth, db } from '../../config/firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import {useNavigate } from "react-router-dom";
const ListPatient = () => {
  const [doctor, setDoctor] = useState(null);
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const doctorsRef = collection(db, 'doctors');
          const doctorsSnapshot = await getDocs(doctorsRef);
          const doctors = doctorsSnapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }));

          const currentDoctor = doctors.find(
            (doc) => doc.data.id === user.uid
          );
          if (currentDoctor) {
            setDoctor(currentDoctor);

            const patientPromises = currentDoctor.data.patients.map(
              async (patientId) => {
                const patientRef = doc(db, 'users', patientId);
                const patientSnapshot = await getDoc(patientRef);
                return { id: patientId, data: patientSnapshot.data() };
              }
            );

            const patientData = await Promise.all(patientPromises);
            setPatients(patientData);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);
  const [inputValue, setInputValue] = useState("");
  const navigate = useNavigate();
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  const handleSearch = () => {
    if (inputValue !== "") {
      navigate(`/doctorspace/searchpatient/${inputValue}`, { state: { doctor } });
    }
  };
  return (
    <div className="DoctorList">
      <div className="left">
        <Navbar doctor={doctor} />
      </div>
      <div className="right">
        <Header doctor = {doctor}/> 
        <div className='Header' style={{backgroundColor : 'white' , height:'4rem', position:'relative'}}>
           <div style={{position:'absolute', right:'0' , padding:'0.5rem'}}>
            <input type="text" placeholder='search by name' onChange={handleInputChange}/>
            <button onClick={handleSearch}>search</button>
           </div>
        </div>
        <div className='doc-list'>
            {/* {inputValue == "" || inputValue == " "} */}
              {patients.map((patient) => {
              if (!patient) {
                  return null;
              }
              return <PatientCard key={patient.id} patient={patient} doctor={doctor} />;
              })}
        </div>
      </div>
    </div>
  );
};

export default ListPatient;
