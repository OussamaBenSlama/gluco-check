import React from 'react';
import '../style/PatientItem.css';
import patientlogo from '../images/patient.png';

const PatientItem = ({ patient }) => {
  return (
    <div className='Patient-card'>
      <div className='card-header'>
        <h3>Medical ID</h3>
      </div>
      <div className='card-content'>
        <div className='main-content'>
          <div className='card-pic'>
            <img src={patientlogo} alt='' />
          </div>
          <div className='card-info'>
            <label>Name:</label> <p>{patient.data.name}</p> <br />
            <label>Address:</label> <p>{patient.data.address}</p> <br />
            <label>Phone:</label> <p>{patient.data.phone}</p> <br />
            <label>Email:</label> <p>{patient.data.email}</p> <br />
          </div>
        </div>
        <div className='second-content'>
          <div>
            <label>Height:</label> <p>{patient.data.height}</p> <br />
            <label>Gender:</label> <p>{patient.data.gender}</p> <br />
          </div>
          <div>
            <label>Nationality:</label> <p>{patient.data.nationality}</p> <br />
            {patient.data.device && patient.data.device.id ? (
              <>
                <label>Device ID:</label> <p>{patient.data.device.id}</p> <br />
              </>
            ) : (
              <>
                <label>Device ID:</label> <p>not yet</p> <br />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientItem;
