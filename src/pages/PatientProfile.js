import React, { useState, useEffect } from 'react';
import '../style/DoctorProfile.css';
import '../style/DoctorList.css';
import { collection, getDocs, deleteDoc, doc,getDoc,updateDoc,arrayRemove } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar'
import HeaderPatient from '../components/HeaderPatient'
import logo from '../images/doctor.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit,faIdCard,faWeight, faRulerVertical, faTrashAlt, faMapMarkerAlt, faEnvelope, faPhone, faGlobe, faVenusMars, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

const PatientProfile = () => {
  const { text } = useParams();
  const [patients, setPatients] = useState([]);
  const [patient, setPatient] = useState(null);
  const FormatterDate = (dateTime) => {
    const totalMilliseconds =
    dateTime.seconds * 1000 + dateTime.nanoseconds / 1000000;
    const date2 = new Date(totalMilliseconds);
    const month = String(date2.getMonth() + 1).padStart(2, "0");
    const day = String(date2.getDate()).padStart(2, "0");
    const year = String(date2.getFullYear());

    return `${year}-${month}-${day}`;
  };
  useEffect(() => {
    const patientsRef = collection(db, 'users');
    const getPatientsList = async () => {
      try {
        const response = await getDocs(patientsRef);
        const fetchedData = response.docs.map((doc) => {
          return { id: doc.id, data: doc.data() };
        });
        setPatients(fetchedData);
      } catch (error) {
        console.error(error);
      }
    };

    getPatientsList();
  }, []);

  useEffect(() => {
    const selectedPatient = patients.find((item) => item.id === text);
    setPatient(selectedPatient);
  }, [patients, text]);

  const deletePatient = async (id) => {
    const patientRef = doc(db, 'users', id);
    const patientSnapshot = await getDoc(patientRef);
    const doctorID = patientSnapshot.data().doctor;
  
    // Check if doctorID exists
    if (doctorID) {
      const doctorRef = doc(db, 'doctors', doctorID);
      
        // Remove patient from doctor's patients array
        await updateDoc(doctorRef, {
          patients: arrayRemove(patientSnapshot.id)
        });
      
    }
    await deleteDoc(patientRef); // it is working
    alert("Patient deleted successfully");
  };

  const navigate = useNavigate();
  const editPatient = () => {
    navigate(`/dashboard/patient/editpatient/${patient.id}`);
  };
  const godoctorprofile = () => {
    navigate(`/dashboard/${patient.data.doctor }`); 
  };

  if (!patient) {
    // Render loading state or handle the case when patient is null
    return <div>Loading...</div>;
  }

  return (
    <div className="DoctorList">
      <div className="left">
        <Navbar />
      </div>
      <div className="right">
        <HeaderPatient />
        <div className="Profile">
          <div className="profile-card">
            <div className="profile-header">
              <img src={logo} alt="" />
            </div>
            <div className="profile-title">
              <h2>{patient.data.name}</h2>
              {/* <h3>{patient.data.speciality}</h3> */}
            </div>
            <div className="profile-info">
              <div className="main-info">
                <label>
                  <FontAwesomeIcon
                    icon={faIdCard}
                    style={{ marginRight: "0.5rem" }}
                  />
                  ID:
                </label>
                <p>{patient.id}</p> <br />
                <label>
                  <FontAwesomeIcon
                    icon={faMapMarkerAlt}
                    style={{ marginRight: "0.5rem" }}
                  />
                  Address:
                </label>
                <p>{patient.data.address}</p> <br />
                <label>
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    style={{ marginRight: "0.5rem" }}
                  />
                  Email:
                </label>
                <p>{patient.data.email}</p> <br />
                <label>
                  <FontAwesomeIcon
                    icon={faPhone}
                    style={{ marginRight: "0.5rem" }}
                  />
                  Phone:
                </label>
                <p>{patient.data.phone}</p> <br />
                {patient.data.doctor ? (
                  <React.Fragment>
                    <FontAwesomeIcon
                      icon={faIdCard}
                      style={{ marginRight: "0.5rem" }}
                    />
                    <label>Doctor :</label>{" "}
                    <p id="doc-id" onClick={godoctorprofile}>
                      {patient.data.doctor}
                    </p>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <FontAwesomeIcon
                      icon={faIdCard}
                      style={{ marginRight: "0.5rem" }}
                    />
                    <label>Doctor :</label> <p>not affected</p>
                  </React.Fragment>
                )}{" "}
                <br />
                <label>Device ID :</label>
                <p>{patient.data.device.id}</p> <br />
              </div>

              <div className="second-info">
                {/* <label>
              <FontAwesomeIcon icon={faGlobe} style={{ marginRight: '0.5rem' }} />
              Nationality :
            </label>
            <p>{patient.data.nationality}</p> <br /> */}
                <label>
                  <FontAwesomeIcon
                    icon={faRulerVertical}
                    style={{ marginRight: "0.5rem" }}
                  />
                  Height :
                </label>
                <p>{patient.data.height}</p> <br />
                <label>
                  <FontAwesomeIcon
                    icon={faWeight}
                    style={{ marginRight: "0.5rem" }}
                  />
                  Weight :
                </label>
                <p>{patient.data.weight}</p> <br />
                <label>
                  <FontAwesomeIcon
                    icon={faVenusMars}
                    style={{ marginRight: "0.5rem" }}
                  />
                  Gender :
                </label>
                <p>{patient.data.gender}</p> <br />
                <label>
                  <FontAwesomeIcon
                    icon={faCalendarAlt}
                    style={{ marginRight: "0.5rem" }}
                  />
                  Birth-date :
                </label>
                <p>{FormatterDate(patient.data.birth)}</p> <br />
                <label>Service :</label>
                <p>{patient.data.service}</p> <br />
                <label>Device name :</label>
                <p>{patient.data.device.name}</p> <br />
              </div>
            </div>
            <div className="del--mod">
              <FontAwesomeIcon
                icon={faTrashAlt}
                color="white"
                size="1x"
                className="del"
                onClick={() => deletePatient(patient.id)}
              />
              <FontAwesomeIcon
                onClick={editPatient}
                icon={faEdit}
                size="1x"
                className="mod"
                color="white"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
