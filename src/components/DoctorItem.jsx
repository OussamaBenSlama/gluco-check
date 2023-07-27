import React from 'react';
import '../style/DoctorItem.css';
import myLogo from '../images/patient.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faEnvelope, faPhone,faIdCard } from '@fortawesome/free-solid-svg-icons';
import { faTrashAlt, faEdit } from '@fortawesome/free-solid-svg-icons';
import { doc, deleteDoc ,getDoc ,updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useNavigate } from 'react-router-dom';

const DoctorItem = ({ doctor }) => {
  const deleteDoctor = async (id) => {
    const doctorRef = doc(db, 'doctors', id);
    const doctorSnapshot = await getDoc(doctorRef);
    const doctorData = doctorSnapshot.data();
  
    // Check if the doctor has a "patients" attribute and it is an array
    if (doctorData && Array.isArray(doctorData.patients)) {
      // Iterate through each patient and update the doctor field to null
      doctorData.patients.forEach(async (patientId) => {
        const patientRef = doc(db, 'users', patientId);
        const patientSnapshot = await getDoc(patientRef);
  
        // Check if the patient exists and update the doctor field
        if (patientSnapshot.exists()) {
          await updateDoc(patientRef, {
            doctor: null
          });
        }
      });
    }
  
    // Delete the doctor
    await deleteDoc(doctorRef);
    alert("Doctor deleted successfully");
  };
  
  
   const navigate = useNavigate();
   const editDoctor = () => {
      navigate(`/dashboard/editdoctor/${doctor.id }`);
      
    };
    const gotoprofile = ()=>{
      navigate(`/dashboard/${doctor.id}`) ;
    }

  return (
    <div>
      <div className="doc-card" >
        <div className="card-head"></div>
        <div className="card-section">
          <div className="card-pic">
            <div className='personal-img'><img src={myLogo} alt="" /></div>
            <div className="personal-info" onClick={gotoprofile} style={{cursor:'pointer'}}>
            <div>
                  <label style={{fontWeight:'bold'}}>
                  <FontAwesomeIcon icon={faIdCard} style={{ marginRight: '0.5rem' }} />
                  Matricule :
                  </label>
                
                 <p>{doctor.data.matricule}</p> 
              </div>
              <div>
                  <label>
                  <FontAwesomeIcon icon={faMapMarkerAlt} style={{ marginRight: '0.5rem' }} />
                  Address:
                  </label>
                
                 <p>{doctor.data.address}</p> 
              </div>
              <div>
                <label>
                <FontAwesomeIcon icon={faEnvelope} style={{ marginRight: '0.5rem' }} />
                  Email:
                </label>
                
                <p>{doctor.data.email}</p>
              </div>
              <div>
                <label>
                <FontAwesomeIcon icon={faPhone} style={{ marginRight: '0.5rem' }} />
                Phone:
                </label>
                
                <p>{doctor.data.phone}</p>
              </div>
            </div>
          </div>
          <div className="card-content">
            <h2 onClick={gotoprofile}>Dr. {doctor.data.name}</h2>
            <h3>{doctor.data.speciality}</h3>
            <div className="del-mod">
              <FontAwesomeIcon
                icon={faTrashAlt}
                color="white"
                style={{fontSize: '1rem'}}
                className="del"
                onClick={() => deleteDoctor(doctor.id)}
              />
              <FontAwesomeIcon onClick={editDoctor} color='white' style={{fontSize: '1rem'}} icon={faEdit}  className="mod" />
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorItem;
