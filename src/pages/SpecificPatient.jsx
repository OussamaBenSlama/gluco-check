import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import '../style/Doctors.css';
import Navbar from '../components/Navbar';
import HeaderPatient from '../components/HeaderPatient';
import PatientItem from '../components/PatientItem'
const SpecificPatient = () => {
  const [patient, setPatient] = useState([]);
  const { text } = useParams();
  useEffect(() => {
    const getPatientByName = async () => {
      if (text) {
        const patientRef = collection(db, 'users');
        const q = query(patientRef, where('name', '==', text));

        try {
          const response = await getDocs(q);
          if (!response.empty) {
            const fetchedPatient = response.docs.map((doc) => {return {id:doc.id , data: doc.data()}});
            setPatient(fetchedPatient);
          } else {
            setPatient([]);
          }
        } catch (error) {
          console.error(error);
        }
      }
    };

    getPatientByName();
  }, [text]);

  return (
    <div className="DoctorList">
      <div className="left">
        <Navbar />
      </div>
      <div className="right">
        <HeaderPatient />
        <div className="doc-list" >
          {patient.length > 0 ? (
            patient.map((patient, index) => <PatientItem key={index} patient={patient} />)
          ) : (
            <p>No patient found with the name {text}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpecificPatient;
