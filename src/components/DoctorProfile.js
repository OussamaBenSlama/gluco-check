import React, { useState, useEffect } from 'react';
import '../style/DoctorProfile.css';
import { collection, getDocs ,deleteDoc ,doc} from 'firebase/firestore';
import { db } from '../config/firebase';
import { useParams , useNavigate} from 'react-router-dom';
import logo from '../images/doctor.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit,faTrashAlt,faMapMarkerAlt, faEnvelope, faPhone, faGlobe, faVenusMars, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

const DoctorProfile = () => {
  const { text } = useParams();
  const [doctors, setDoctors] = useState([]);
  const [doctor, setDoctor] = useState(null);

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
    await deleteDoc(doctorRef);
    alert("docotor deleted successfully ")
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
      <div className='profile-card'>
            <div className='profile-header'>
                <img src={logo} alt='' />
            </div>
            <div className='profile-title'>
                <h2>Dr. {doctor.data.name}</h2>
                <h3>{doctor.data.speciality}</h3>
            </div>
        <div className='profile-info'>
            <div className='main-info'>
                <label>
                <FontAwesomeIcon icon={faMapMarkerAlt} style={{ marginRight: '0.5rem' }} />
                Address:
                </label>
                <p>{doctor.data.address}</p> <br/>

                <label>
                <FontAwesomeIcon icon={faEnvelope} style={{ marginRight: '0.5rem' }} />
                Email:
                </label> 
                <p>{doctor.data.email}</p> <br/>

                <label>
                <FontAwesomeIcon icon={faPhone} style={{ marginRight: '0.5rem' }} />
                Phone:
                </label>
                <p>{doctor.data.phone}</p> <br/>
          </div>
          
          <div className='second-info'>
            <label>
                <FontAwesomeIcon icon={faGlobe} style={{ marginRight: '0.5rem' }} />
                Nationality :
                </label>
                <p>{doctor.data.nationality}</p> <br/>

                <label>
                <FontAwesomeIcon icon={faVenusMars} style={{ marginRight: '0.5rem' }} />
                Gender :
                </label>
                <p>{doctor.data.gender}</p> <br/>

                <label>
                <FontAwesomeIcon icon={faCalendarAlt} style={{ marginRight: '0.5rem' }} />
                Birth-date :
                </label>
                <p>{doctor.data.birth}</p> 
          </div>
          
        </div>
        <div className="del--mod">
              <FontAwesomeIcon
                icon={faTrashAlt}
                color="white"
                size="1x"
                className="del"
                onClick={() => deleteDoctor(doctor.id)}
              />
              <FontAwesomeIcon onClick={editDoctor} icon={faEdit} size="1x" className="mod" color='white'/>
        </div>
      </div>
      
    </div>
  );
};

export default DoctorProfile;
