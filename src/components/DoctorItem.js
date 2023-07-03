import React from 'react';
import '../style/DoctorItem.css';
import docImg from '../images/doctor.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';
import { faTrashAlt, faEdit } from '@fortawesome/free-solid-svg-icons';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useNavigate } from 'react-router-dom';

const DoctorItem = ({ doctor }) => {
   const deleteDoctor = async (id) => {
      const doctorRef = doc(db, 'doctors', id);
      await deleteDoc(doctorRef);
      alert("docotor deleted successfully ")
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
      <div className="doc-card">
        <div className="card-head"></div>
        <div className="card-section">
          <div className="card-pic">
            <div className='personal-img'><img src={docImg} alt="" /></div>
            <div className="personal-info">
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
                color="#009197"
                size="2x"
                className="del"
                onClick={() => deleteDoctor(doctor.id)}
              />
              <FontAwesomeIcon onClick={editDoctor} icon={faEdit} size="2x" className="mod" />
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorItem;
