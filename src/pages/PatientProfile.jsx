import React, { useState, useEffect } from 'react';
import '../style/Profile.css';
import '../style/DoctorList.css';
import { collection, getDocs, deleteDoc, doc, getDoc, updateDoc, arrayRemove } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import HeaderPatient from '../components/HeaderPatient';
import myLogo from '../images/patient.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const PatientProfile = () => {
  const { text } = useParams();
  const [patients, setPatients] = useState([]);
  const [patient, setPatient] = useState(null);
  const FormatterDate = (dateTime) => {
    const totalMilliseconds =
      dateTime.seconds * 1000 + dateTime.nanoseconds / 1000000;
    const date2 = new Date(totalMilliseconds);
    const month = String(date2.getMonth() + 1).padStart(2, '0');
    const day = String(date2.getDate()).padStart(2, '0');
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
        patients: arrayRemove(patientSnapshot.id),
      });
    }
    await deleteDoc(patientRef); // it is working
    alert('Patient deleted successfully');
  };

  const navigate = useNavigate();
  const editPatient = () => {
    navigate(`/dashboard/patient/editpatient/${patient.id}`);
  };
  const godoctorprofile = () => {
    navigate(`/dashboard/${patient.data.doctor}`);
  };

  const [doctor, setDoctor] = useState(null);

  useEffect(() => {
    const fetchDoctorData = async () => {
      if (patient && patient.data.doctor) {
        const doctorRef = doc(db, 'doctors', patient.data.doctor);
        try {
          const doctorSnapshot = await getDoc(doctorRef);
          if (doctorSnapshot.exists()) {
            const doctorData = doctorSnapshot.data();
            setDoctor(doctorData);
          } else {
            // Handle the case when the doctor document doesn't exist
            setDoctor(null);
          }
        } catch (error) {
          console.error('Error fetching doctor data:', error);
          // Handle the error if necessary
        }
      }
    };

    fetchDoctorData();
  }, [patient]);

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
          <div className="left-profile">
            <div className="header-profile">
              <div style={{ textAlign: 'center', padding: '1rem' }}>
                <img src={myLogo} alt="" />
                <h4>{patient.data.name}</h4>
                <div>
                  <button onClick={editPatient}>
                    <FontAwesomeIcon
                      icon={faEdit}
                      color="white"
                      style={{ marginRight: '0.5rem' }}
                    />
                    Edit Patient
                  </button>
                  <button onClick={godoctorprofile}>Doctor Profile</button>
                </div>
                <div className="delete-icon">
                  <FontAwesomeIcon
                    icon={faTrashAlt}
                    onClick={() => deletePatient(patient.id)}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="right-profile">
            <div className="info-profile">
              <div>
                <label>ID</label>
                <p>{patient.id}</p>
              </div>
              <div>
                <label>Doctor Matricule: </label>
                {doctor ? (
                  <React.Fragment>
                    
                    <p>{doctor.matricule}</p>
                    
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <p>not affected</p>
                  </React.Fragment>
                )}
              </div>
              <div>
                <label>Email</label>
                <p>{patient.data.email}</p>
              </div>
              <div>
                <label>Address</label>
                <p>{patient.data.address}</p>
              </div>
              <div>
                <label>Service:</label>
                <p>{patient.data.service}</p>
              </div>
              <div>
                <label>Phone</label>
                <p>{patient.data.phone}</p>
              </div>
              <div>
                <label>Birth</label>
                <p>{FormatterDate(patient.data.birth)}</p>
              </div>
              <div>
                <label>Gender</label>
                <p>{patient.data.gender}</p>
              </div>
              <div>
                <label>Nationality</label>
                <p>{patient.data.nationality}</p>
              </div>
              <div>
                <label>Height</label>
                <p>{patient.data.height}</p>
              </div>
              <div>
                <label>Weight</label>
                <p>{patient.data.weight}</p>
              </div>
              <div>
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
      </div>
    </div>
  );
};

export default PatientProfile;
