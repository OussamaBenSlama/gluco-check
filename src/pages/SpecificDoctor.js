import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import '../style/Doctors.css';
import Navbar from '../components/Navbar';
import Header from '../components/Header';
import DoctorItem from '../components/DoctorItem';

const SpecificDoctor = () => {
  const [doctors, setDoctors] = useState([]);
  const { text } = useParams();
  useEffect(() => {
    const getDoctorsByName = async () => {
      if (text) {
        const doctorsRef = collection(db, 'doctors');
        const q = query(doctorsRef, where('name', '==', text));

        try {
          const response = await getDocs(q);
          if (!response.empty) {
            const fetchedDoctors = response.docs.map((doc) => {return {id:doc.id , data: doc.data()}});
            setDoctors(fetchedDoctors);
          } else {
            setDoctors([]);
          }
        } catch (error) {
          console.error(error);
        }
      }
    };

    getDoctorsByName();
  }, [text]);

  return (
    <div className="DoctorList">
      <div className="left">
        <Navbar />
      </div>
      <div className="right">
        <Header />
        <div className="result" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '3rem' }}>
          {doctors.length > 0 ? (
            doctors.map((doctor, index) => <DoctorItem key={index} doctor={doctor} />)
          ) : (
            <p>No doctor found with the name {text}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpecificDoctor;
