import React, { useState, useEffect } from 'react';
import '../style/Profile.css';
import { collection, getDocs ,deleteDoc ,doc ,getDoc , updateDoc}  from 'firebase/firestore';
import { db } from '../config/firebase';
import { useParams , useNavigate} from 'react-router-dom';
import myLogo from '../images/patient.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit , faTrashAlt} from '@fortawesome/free-solid-svg-icons';

const DoctorProfile = () => {
  const { text } = useParams();
  const [doctors, setDoctors] = useState([]);
  const [doctor, setDoctor] = useState(null);
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
    const doctorsRef = collection(db, 'doctors');
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
    const selectedDoctor = doctors.find((item) => item.id === text);
    setDoctor(selectedDoctor);
  }, [doctors, text]);
  const deleteDoctor = async (id) => {
    const doctorRef = doc(db, 'doctors', id);
    const doctorSnapshot = await getDoc(doctorRef);
    const doctorData = doctorSnapshot.data();
  
    // Check if the doctor has a "patients" attribute and it is an array
    if (doctorData && Array.isArray(doctorData.patients)) {
      // Iterate through each patient and update the doctor field to null
      doctorData.patients.forEach(async (patientId) => {
        const patientRef = doc(db, 'users', patientId);
        const patientSnapshot = await getDoc(patientRef);
  
        // Check if the patient exists and update the doctor field
        if (patientSnapshot.exists()) {
          await updateDoc(patientRef, {
            doctor: null
          });
        }
      });
    }
  
    // Delete the doctor
    await deleteDoc(doctorRef);
    alert("Doctor deleted successfully");
  };
  
 const navigate = useNavigate();
 const editDoctor = () => {
    navigate(`/dashboard/editdoctor/${doctor.id }`);
    
  };
  if (!doctor) {
    // Render loading state or handle the case when doctor is null
    return <div>Loading...</div>;
  }

  return (
    <div className='Profile'>
      <div className='left-profile'>
        <div className='header-profile'>
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <img src={myLogo} alt='' />
            <h4>{doctor.data.name}</h4>
            <h5>{doctor.data.speciality}</h5>
            
            <div>
              <button onClick={editDoctor}>
                <FontAwesomeIcon icon={faEdit} style={{ marginRight: '0.5rem' }} />
                Edit Profile
              </button>
            </div>
            <div className='delete-icon'>
              <FontAwesomeIcon icon={faTrashAlt} onClick={deleteDoctor}/>
            </div>
          </div>
        </div>
      </div>
      <div className='right-profile'>
        <div className='info-profile'>
          <div>
            <label>ID</label>
            <p>{doctor.data.matricule}</p>
          </div>
          <div>
            <label>Email</label>
            <p>{doctor.data.email}</p>
          </div>
          <div>
            <label>Address</label>
            <p>{doctor.data.address}</p>
          </div>
          <div>
            <label>Phone</label>
            <p>{doctor.data.phone}</p>
          </div>
          <div>
            <label>Birth</label>
            <p>{FormatterDate(doctor.data.birth)}</p>
          </div>
          <div>
            <label>Gender</label>
            <p>{doctor.data.gender}</p>
          </div>
          <div>
            <label>Nationality</label>
            <p>{doctor.data.nationality}</p>
          </div>
          <div>
            <label>Patients</label>
            <p>{doctor.data.patients.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
