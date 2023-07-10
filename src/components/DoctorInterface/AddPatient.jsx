import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Header from './Header';
import patientlogo from '../../images/patient.png';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

const AddPatient = () => {
  const location = useLocation();
  const { doctor } = location.state;
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersRef = collection(db, 'users');
        const userSnapshot = await getDocs(usersRef);
        const users = userSnapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }));

        // Filter patients where doctor field is null
        const filteredPatients = users.filter(
          (user) => user.data.doctor === null
        );

        setPatients(filteredPatients);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const addPatient = async (patientId) => {
    const patientRef = doc(db, 'users', patientId);
    const userRef = doc(db, 'doctors', doctor.id);

    await updateDoc(patientRef, {
      doctor: doctor.id,
    });

    await updateDoc(userRef, {
      patients: [...doctor.data.patients, patientId],
    });

    alert('Patient added successfully');
  };

  return (
    <div className="DoctorList">
      <div className="left">
        <Navbar doctor={doctor} />
      </div>
      <div className="right">
        <Header />
        <div className="doc-list">
          {patients.map((patient) => (
            <div className="Patient-card" key={patient.id}>
              <div className="card-header">
                <h3>Medical ID</h3>
              </div>
              <div className="card-content">
                <div className="main-content">
                  <div className="card-pic">
                    <img src={patientlogo} alt="" />
                    <div className="del-mod">
                      <button
                        style={{
                          backgroundColor: '#004054',
                          border: '1px solid white',
                          padding: '0.5rem',
                          color: 'white',
                          cursor: 'pointer',
                        }}
                        onClick={() => addPatient(patient.id)}
                      >
                        <FontAwesomeIcon
                          icon={faPlus}
                          cursor="pointer"
                          color="white"
                          style={{ marginRight: '1rem' }}
                        />
                        Add New
                      </button>
                    </div>
                  </div>
                  <div className="card-info">
                    <label>Name:</label>
                    <p>{patient.data.name}</p>
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
                      <>
                        <label>Doctor:</label>
                        <p>{patient.data.doctor}</p>
                        <br />
                      </>
                    ) : (
                      <>
                        <label>Doctor:</label>
                        <p>not affected</p>
                        <br />
                      </>
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
                      <>
                        <label>Device ID:</label>
                        <p>{patient.data.device.id}</p>
                        <br />
                      </>
                    ) : (
                      <>
                        <label>Device ID:</label>
                        <p>not yet</p>
                        <br />
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AddPatient;
