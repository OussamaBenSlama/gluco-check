import React, { useEffect, useState } from 'react';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../config/firebase';
import '../style/Doctors.css'
import PatientItem from './PatientItem'

const Patients = () => {
  const [patients, setpatients] = useState([]);
  

  useEffect(() => {
    const patientsRef = collection(db, "users");
    const getPatientsList = async () => {
      try {
        const response = await getDocs(patientsRef);
        const fetchedData = response.docs.map((doc) => {return {id:doc.id , data : doc.data()}});
        setpatients(fetchedData);
      } catch (error) {
        console.error(error);
      }
    };
  
    getPatientsList();
  }, []);
  
   
  return (
    <div className='doc-list'>
      
      {patients.map((patient, index) => (
         <PatientItem key={index} patient={patient} />
      ))}
    </div>
  );
};

export default Patients;
