import React, { useEffect, useState } from 'react';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../config/firebase';
import '../style/Doctors.css'
import docImg from '../images/doctor.jpg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';


const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const doctorsRef = collection(db, "doctors");

  useEffect(() => {
    const getDoctorsList = async () => {
      try {
        const response = await getDocs(doctorsRef);
        const fetchedData = response.docs.map((doc) => doc.data());
        setDoctors(fetchedData);
      } catch (error) {
        console.error(error);
      }
    };
  
    getDoctorsList();
  }, []);
  

  return (
    <div className='doc-list'>
      
      {doctors.map((doctor) => (
        <div className='doc-card'>
           <div className='card-head'></div>
           <div className='card-section'>
              <div className='card-pic'>
                 <img src={docImg} alt="" />
              </div>
              <div className='card-content'>
                 <h2>Dr .{doctor.name}</h2>
                 <h3>{doctor.speciality}</h3>
                 <label><FontAwesomeIcon icon={faMapMarkerAlt} style={{marginRight: '0.5rem'}} />Address :</label> <br/>
                 <p>{doctor.address}</p>
                 <label><FontAwesomeIcon icon={faEnvelope} style={{marginRight: '0.5rem'}}/>Email :</label> <br/>
                 <p>{doctor.email}</p>
                 <label><FontAwesomeIcon icon={faPhone} style={{marginRight: '0.5rem'}}/>Phone :</label> <br/>
                 <p>{doctor.phone}</p>
              </div>
           </div>

        </div>
      ))}
    </div>
  );
};

export default Doctors;
