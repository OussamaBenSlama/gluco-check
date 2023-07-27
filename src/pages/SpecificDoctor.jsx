import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import '../style/Doctors.css';
import Navbar from '../components/Navbar';
import Header from '../components/Header';
import DoctorItem from '../components/DoctorItem';

const SpecificDoctor = () => {
  const [doctors, setDoctors] = useState([]);
  const location = useLocation();
  const searchOption = location.state?.searchOption;
  const text = location.state?.inputValue;

  useEffect(() => {
    const getDoctors = async () => {
      if (text) {
        const doctorsRef = collection(db, 'doctors');
        let q;
        if (searchOption === 'name') {
          q = query(doctorsRef, where('name', '==', text));
        } else if (searchOption === 'speciality') {
          q = query(doctorsRef, where('speciality', '==', text));
        } else {
          setDoctors([]);
          return;
        }

        try {
          const response = await getDocs(q);
          if (!response.empty) {
            const fetchedDoctors = response.docs.map((doc) => ({ id: doc.id, data: doc.data() }));
            setDoctors(fetchedDoctors);
          } else {
            setDoctors([]);
          }
        } catch (error) {
          console.error(error);
        }
      }
    };

    getDoctors();
  }, [searchOption, text]);

  return (
    <div className="DoctorList">
      <div className="left">
        <Navbar />
      </div>
      <div className="right">
        <Header />
        <div className='doc-list'>
          {doctors.length > 0 ? (
            doctors.map((doctor, index) => <DoctorItem key={index} doctor={doctor} />)
          ) : (
            <p>No doctor found with the {searchOption === 'name' ? 'name' : 'speciality'}: {text}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpecificDoctor;
