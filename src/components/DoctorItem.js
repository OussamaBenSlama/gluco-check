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
      console.log('Doctor deleted');
   };
   const navigate = useNavigate();
   const editDoctor = () => {
      navigate(`/dashboard/editdoctor/${doctor.id }`);
      
    };

  return (
    <div>
      <div className="doc-card">
        <div className="card-head"></div>
        <div className="card-section">
          <div className="card-pic">
            <img src={docImg} alt="" />
            <div className="del-mod">
              <FontAwesomeIcon
                icon={faTrashAlt}
                color="red"
                size="2x"
                className="del"
                onClick={() => deleteDoctor(doctor.id)}
              />
              <FontAwesomeIcon onClick={editDoctor} icon={faEdit} size="2x" className="mod" />
            </div>
          </div>
          <div className="card-content">
            <h2>Dr. {doctor.data.name}</h2>
            <h3>{doctor.data.speciality}</h3>
            <label>
              <FontAwesomeIcon icon={faMapMarkerAlt} style={{ marginRight: '0.5rem' }} />
              Address:
            </label>
            <br />
            <p>{doctor.data.address}</p> 
            <label>
              <FontAwesomeIcon icon={faEnvelope} style={{ marginRight: '0.5rem' }} />
              Email:
            </label>
            <br />
            <p>{doctor.data.email}</p>
            <label>
              <FontAwesomeIcon icon={faPhone} style={{ marginRight: '0.5rem' }} />
              Phone:
            </label>
            <br />
            <p>{doctor.data.phone}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorItem;
