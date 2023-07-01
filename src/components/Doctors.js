import React, { useEffect, useState } from 'react';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../config/firebase';
import '../style/Doctors.css'

import DoctorItem from './DoctorItem';


const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  

  useEffect(() => {
    const doctorsRef = collection(db, "doctors");
    const getDoctorsList = async () => {
      try {
        const response = await getDocs(doctorsRef);
        const fetchedData = response.docs.map((doc) => {return {id:doc.id , data : doc.data()}});
        setDoctors(fetchedData);
      } catch (error) {
        console.error(error);
      }
    };
  
    getDoctorsList();
  }, []);
  

  return (
    <div className='doc-list'>
      
      {doctors.map((doctor, index) => (
         <DoctorItem key={index} doctor={doctor} />
      ))}
    </div>
  );
};

export default Doctors;
