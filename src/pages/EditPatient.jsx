import React, { useState, useEffect, useRef } from 'react';
import { collection, getDocs, doc, updateDoc, arrayUnion,getDoc,arrayRemove } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import HeaderPatient from '../components/HeaderPatient';
import '../style/DoctorList.css';

const EditPatient = () => {
  const { text } = useParams();
  const [patients, setPatients] = useState([]);
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    const patientRef = collection(db, "users");
    const getPatientList = async () => {
      try {
        const response = await getDocs(patientRef);
        const fetchedData = response.docs.map((doc) => {
          return { id: doc.id, data: doc.data() };
        });
        setPatients(fetchedData);
      } catch (error) {
        console.error(error);
      }
    };

    getPatientList();
  }, []);

  useEffect(() => {
    const selectedPatient = patients.find((item) => item.id === text);
    setPatient(selectedPatient);
  }, [patients, text]);

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');
  const [birth, setBirth] = useState('');
  const [weight, setweight] = useState(0);
  const [height, setHeight] = useState(0);
  const [service, setService] = useState('');
  const [doctorID, setDoctorID] = useState('');
  
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
    if (patient && patient.data) {
      setName(patient.data.name || '');
      setAddress(patient.data.address || '');
      setEmail(patient.data.email || '');
      setPhone(patient.data.phone || '');
      setGender(patient.data.gender || '');
      setBirth(FormatterDate(patient.data.birth) || '');
      setweight(patient.data.weight || 0);
      setHeight(patient.data.height || 0);
      setService(patient.data.service || '');
      setDoctorID(patient.data.doctor || ''); // Updated from 'doctor'
    }
  }, [patient]);

  const handleUpdate = async () => {
    const patientRef = doc(db, "users", text);
    const patientSnapshot = await getDoc(patientRef);
    const previousDoctorID = patientSnapshot.data().doctor;
  
    if (previousDoctorID && previousDoctorID !== doctorID) {
      const previousDoctorRef = doc(db, "doctors", previousDoctorID);
      const previousDoctorSnapshot = await getDoc(previousDoctorRef);
  
      if (previousDoctorSnapshot.exists()) {
        await updateDoc(previousDoctorRef, {
          patients: arrayRemove(patientSnapshot.id),
        }
        );
       
      console.log("suppression terminé") }
      else {
        console.log("Previous doctor document not found.");
      }
    }
  
    await updateDoc(patientRef, {
      name: name,
      email: email,
      gender: gender,
      weight: weight,
      birth: new Date(birth),
      address: address,
      phone: phone,
      height: height,
      service: service,
      doctor: doctorID || null // Set the doctorID to null if it's empty
    });
  
    if (doctorID !== '') {
      const doctorRef = doc(db, "doctors", doctorID);
      const doctorSnapshot = await getDoc(doctorRef);
  
      if (doctorSnapshot.exists()) {
        await updateDoc(doctorRef, {
          patients: arrayUnion(patientSnapshot.id)
        });
      } else {
        console.log("Doctor document not found.");
      }
    }
  
    alert("Update successful");
  };
  
  
  
  // Fetch doctors for autocomplete in doctor ID:
  const [doctors, setDoctors] = useState([]);
  const suggestionsRef = useRef(null);
  const [filteredDoctors, setFilteredDoctors] = useState([]);

  useEffect(() => {
    const doctorsRef = collection(db, "doctors");
    const getDoctorsList = async () => {
      try {
        const response = await getDocs(doctorsRef);
        const fetchedData = response.docs.map((doc) => {
          return { id: doc.id, data: doc.data() };
        });
        setDoctors(fetchedData);
      } catch (error) {
        console.error(error);
      }
    };

    getDoctorsList();
  }, []);

  useEffect(() => {
    const filtered = doctors.filter((doctor) =>
      doctor.data.name.toLowerCase().includes(doctorID.toLowerCase())
    );
    setFilteredDoctors(filtered);
  }, [doctors, doctorID]);

  const handleSelectDoctor = (event, selectedDoctorID) => {
    event.stopPropagation();
    setDoctorID(selectedDoctorID);
  };
  

  return (
    <div className="DoctorList">
      <div className="left">
        <Navbar />
      </div>
      <div className="right">
        <HeaderPatient />
        <div className="edit-doc">
          <div>
            <label>Name:</label> <br />
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div>
            <label>Email:</label> <br />
            <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label>Phone:</label> <br />
            <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div>
            <label>Address:</label> <br />
            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>
          <div>
            <label>Gender:</label> <br />
            <input type="text" value={gender} onChange={(e) => setGender(e.target.value)} />
          </div>
          <div>
            <label>Birth:</label> <br />
            <input type="text" value={birth} onChange={(e) => setBirth(e.target.value)} />
          </div>
          <div>
            <label>Weight:</label> <br />
            <input type="text" value={weight} onChange={(e) => setweight(e.target.value)} />
          </div>
          <div>
            <label>Height:</label> <br />
            <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
          </div>
          <div>
            <label>Service:</label> <br />
            <input type="text" value={service} onChange={(e) => setService(e.target.value)} />
          </div>
          <div className="doctorID-container">
            <label>doctorID:</label> <br />
            <input
              type="text"
              value={doctorID}
              onChange={(e) => setDoctorID(e.target.value)}
            />
            {filteredDoctors.length > 0 && (
              <ul className="doctor-suggestions" ref={suggestionsRef} style={{top:'100%'}}>
                {filteredDoctors.map((doctor) => (
                  <li
                    key={doctor.id}
                    onClick={(e) => handleSelectDoctor(e, doctor.id)}
                    className="doctor-suggestion"
                  >
                    {doctor.data.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <br />
          <button id="updatePat" onClick={handleUpdate} >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPatient;