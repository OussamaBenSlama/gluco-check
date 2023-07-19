import React from 'react';
import '../../style/PatientItem.css';
import patientlogo from '../../images/patient.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

import {
  doc,
  getDoc,
  updateDoc,
  arrayRemove,
} from "firebase/firestore";
import { db } from "../../config/firebase";

const PatientCard= ({ patient , doctor}) => {
    const deletePatient = async (id) => {
        const patientRef = doc(db, "users", id);
        const patientSnapshot = await getDoc(patientRef);
        const doctorID = patientSnapshot.data().doctor;
    
        if (doctorID) {
          const doctorRef = doc(db, "doctors", doctorID);
    
          await updateDoc(doctorRef, {
            patients: arrayRemove(patientSnapshot.id),
          });
        }
        await updateDoc(patientRef, {
            doctor: null,
          });
        alert("Patient deleted successfully");
      };
      
    const navigate = useNavigate();
    const goProfile = () => {
      navigate(`/doctorspace/patient`, { state: { doctor , patient } });
    };
    

  
  

  if (!patient || !patient.data) {
    return null;
  }

  return (
    <div className="Patient-card">
      <div className="card-header">
        <h3>Medical ID</h3>
      </div>
      <div className="card-content">
        <div className="main-content">
          <div className="card-pic">
            <img src={patientlogo} alt="" />
            <div className="del-mod">
              <FontAwesomeIcon
                icon={faTrashAlt}
                color="white"
                style={{ fontSize: "1rem" }}
                className="del"
                onClick={() => deletePatient(patient.id)}
              />
              {/* <FontAwesomeIcon
                onClick={editPatient}
                color="white"
                style={{ fontSize: "1rem" }}
                icon={faEdit}
                className="mod"
              /> */}
            </div>
          </div>
          <div className="card-info">
            <label>Name:</label>
            <p id='go-profile' onClick={goProfile}>
              {patient.data.name}
            </p>
            <br />
            <label>ID:</label>
            <p>{patient.id}</p>
            <br />
            <label>Address:</label>
            <p>{patient.data.address}</p>
            <br />
            <label>Email:</label>
            <p>{patient.data.email}</p>
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
                <p>
                  {patient.data.doctor}
                </p>
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
            {patient.data.device &&
            patient.data.device.id &&
            patient.data.device.name ? (
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

export default PatientCard;
