import React from 'react';
import '../style/PatientItem.css';
import patientlogo from '../images/patient.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faEdit } from '@fortawesome/free-solid-svg-icons';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
const PatientItem = ({ patient }) => {
    const deletePatient = async (id) => {
        const patientRef = doc(db, 'users', id);
        await deleteDoc(patientRef);
        alert("docotor deleted successfully ")
     };
  return (
    <div className='Patient-card'>
      <div className='card-header'>
        <h3>Medical ID</h3>
      </div>
      <div className='card-content'>
        <div className='main-content'>
          <div className='card-pic'>
            <img src={patientlogo} alt='' />
            <div className="del-mod">
              <FontAwesomeIcon
                icon={faTrashAlt}
                color="white"
                style={{fontSize: '1rem'}}
                className="del"
                onClick={() => deletePatient(patient.id)}
              />
              <FontAwesomeIcon  color='white' style={{fontSize: '1rem'}} icon={faEdit}  className="mod" />
            </div>
          </div>
          <div className='card-info'>
            <label>Name:</label> <p>{patient.data.name}</p> <br />
            <label>Address:</label> <p>{patient.data.address}</p> <br />
            <label>Phone:</label> <p>{patient.data.phone}</p> <br />
            <label>Email:</label> <p>{patient.data.email}</p> <br />
          </div>
        </div>
        <div className='second-content'>
          <div className='phy-info'>
            <label>Height:</label> <p>{patient.data.height}</p> <br />
            <label>Gender:</label> <p>{patient.data.gender}</p> <br />
            {patient.data.doctor ?(
              <>
                <label>Doctor :</label> <p id='doc-id'>{patient.data.doctor}</p> <br />
                
              </>
            ) : (
              <>
                <label>Doctor :</label> <p>not affected</p> <br />

              </>
            )}
          </div>
          <div className='device-info'>
            <label>Nationality:</label> <p>{patient.data.nationality}</p> <br />
            {patient.data.device && patient.data.device.id && patient.data.device.name? (
              <>
                <label>Device ID:</label> <p>{patient.data.device.id}</p> <br />
                <label>Device name:</label> <p>{patient.data.device.name}</p> <br />
              </>
            ) : (
              <>
                <label>Device ID:</label> <p>not yet</p> <br />
                <label>Device name:</label> <p>not yet</p> <br />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientItem;
