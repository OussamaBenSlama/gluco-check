import React, { useEffect, useState } from 'react';
import '../style/PatientItem.css';
import patientlogo from '../images/patient.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faEdit } from '@fortawesome/free-solid-svg-icons';
import {
  doc,
  deleteDoc,
  getDoc,
  updateDoc,
  arrayRemove,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { useNavigate } from 'react-router-dom';

const PatientItem = ({ patient }) => {
  const deletePatient = async (id) => {
    const patientRef = doc(db, 'users', id);
    const patientSnapshot = await getDoc(patientRef);
    const doctorID = patientSnapshot.data().doctor;

    if (doctorID) {
      const doctorRef = doc(db, 'doctors', doctorID);

      await updateDoc(doctorRef, {
        patients: arrayRemove(patientSnapshot.id),
      });
    }
    await deleteDoc(patientRef);
    alert('Patient deleted successfully');
  };

  const navigate = useNavigate();
  const editPatient = () => {
    navigate(`/dashboard/patient/editpatient/${patient.id}`);
  };
  const gotoprofile = () => {
    navigate(`/dashboard/patient/profile/${patient.id}`);
  };
  const godoctorprofile = () => {
    navigate(`/dashboard/${patient.data.doctor}`);
  };

  const [doctorMatricule, setDoctorMatricule] = useState(null);

  useEffect(() => {
    const fetchDoctorMatricule = async () => {
      if (patient?.data?.doctor) {
        try {
          const doctorRef = doc(db, 'doctors', patient.data.doctor);
          const doctorSnapshot = await getDoc(doctorRef);
          if (doctorSnapshot.exists()) {
            const matricule = doctorSnapshot.data().matricule;
            setDoctorMatricule(matricule);
          }
        } catch (error) {
          console.error(error);
        }
      }
    };
    fetchDoctorMatricule();
  }, [patient]);

  if (!patient || !patient.data) {
    return null;
  }

  return (
    <div className="Patient-card" >
      <div className="card-header">
        <div style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
          <h3 style={{marginRight:'1rem'}}>Medical ID : </h3>
            <div>
                      
            {patient.data.matricule ? 
            (
                <h3>{patient.data.matricule}</h3>
            ) :
            (
                <p></p>
            )}
            </div>
          </div>
        <div className="del-mod">
              <FontAwesomeIcon
                icon={faTrashAlt}
                color="white"
                style={{ fontSize: '1rem' }}
                className="del"
                onClick={() => deletePatient(patient.id)}
              />
              <FontAwesomeIcon
                onClick={editPatient}
                color="white"
                style={{ fontSize: '1rem' }}
                icon={faEdit}
                className="mod"
              />
            </div>
      </div>
      <div className="card-content" onClick={gotoprofile} style={{cursor:'pointer'}}>
        <div className="main-content">
          <div className="card-pic">
            <img src={patientlogo} alt="" />
            
          </div>
          <div className="card-info">
            <label>Name:</label>
            <p id="go-profile" onClick={gotoprofile}>
              {patient.data.name}
            </p>

            <br />
            <label>Address:</label>
            <p>{patient.data.address}</p>
            <br />
            <label>Email:</label>
            <p>{patient.data.email}</p>
            <br />
            <label>Service:</label>
            <p>{patient.data.service}</p>
            <br />
          </div>
        </div>
        <div className="second-content">
          <div className="phy-info">
            <label>Height:</label>
            <p>{patient.data.height} cm</p>
            <br />
            <label>Gender:</label>
            <p>{patient.data.gender}</p>
            <br />
            {patient.data.doctor ? (
              <React.Fragment>
                <label>Doctor:</label>
                {doctorMatricule ? (
                  <p id="doc-id" onClick={godoctorprofile}>
                    {doctorMatricule}
                  </p>
                ) : (
                  <p>Loading...</p>
                )}
                <br />
              </React.Fragment>
            ) : (
              <React.Fragment>
                <label>Doctor:</label>
                <p>not affected</p>
                <br />
              </React.Fragment>
            )}
          </div>
          <div className="device-info">
            <label>Weight:</label>
            <p>{patient.data.weight} KG</p>
            <br />
            <label>Phone:</label>
            <p>{patient.data.phone}</p>
            <br />
            {patient.data.device && patient.data.device.id && patient.data.device.name ? (
              <React.Fragment>
                <label>Device ID:</label>
                <p>{patient.data.device.id}</p>
                <br />
              </React.Fragment>
            ) : (
              <React.Fragment>
                <label>Device ID:</label>
                <p>not yet</p>
                <br />
              </React.Fragment>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientItem;
