import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import '../../style/DoctorList.css';
import Header from './Header';
import Navbar from './Navbar';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import PatientCard from './PatientCard'
const SearchCurrentPatient = () => {
  const location = useLocation();
  const { doctor } = location.state;
  const { text } = useParams();
  const [patients, setPatients] = useState([]);
  const [searched, setSearched] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      if (doctor && text) {
        const patientList = doctor.data.patients;
        const patientPromises = patientList.map(async (patientId) => {
          const patientRef = doc(db, 'users', patientId);
          const patientSnapshot = await getDoc(patientRef);
          const patientData = {
            id: patientId,
            data: patientSnapshot.data(),
          };
          return patientData;
        });
  
        const patientData = await Promise.all(patientPromises);
        setPatients(patientData);
        // Search for patients based on the name parameter
        const searchedPatients = patientData.filter(
            (patient) =>
              patient.data && patient.data.name &&
              patient.data.name.toLowerCase() === text.toLowerCase()
          );
          
        setSearched(searchedPatients);
      }
    };
  
    fetchData();
  }, [doctor, text]);
  
  

  return (
    <div className="DoctorList">
      <div className="left">
        <Navbar doctor={doctor}/>
      </div>
      <div className="right">
        <Header />
        <div className='doc-list'>
            {searched.map((patient) => {
            if (!patient) {
                return null;
            }
            return <PatientCard key={patient.id} patient={patient} />;
            })}
        </div>
      </div>
    </div>
  );
};

export default SearchCurrentPatient;
