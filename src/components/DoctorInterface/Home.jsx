import React, { useEffect } from 'react';
import '../../style/Profile.css';
import myLogo from '../../images/patient.png';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from 'react-router-dom';

const Home = ({ doctor }) => {
  const FormatterDate = (dateTime) => {
    const totalMilliseconds =
      dateTime.seconds * 1000 + dateTime.nanoseconds / 1000000;
    const date2 = new Date(totalMilliseconds);
    const month = String(date2.getMonth() + 1).padStart(2, "0");
    const day = String(date2.getDate()).padStart(2, "0");
    const year = String(date2.getFullYear());

    return `${year}-${month}-${day}`;
  };

  const navigate = useNavigate();



  const goEdit = () => {
    navigate('/doctorspace/editprofile', { state: { doctor } });
  };

  const goAdd = () => {
    navigate('/doctorspace/addpatient', { state: { doctor } });
  };

  if (!doctor || !doctor.data) {
    return null; // Return null or a fallback component if doctor or doctor.data is missing
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
              <button onClick={goAdd} style={{ backgroundColor:'#057be9', color:'white' }}>
                <FontAwesomeIcon icon={faPlus} style={{ marginRight: '0.5rem'}} />
                Add Patient
              </button>
              <button onClick={goEdit}>
                <FontAwesomeIcon icon={faEdit} style={{ marginRight: '0.5rem' }} />
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className='right-profile'>
        <div className='info-profile'>
          <div>
            <label>Matricule</label>
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
            <label>Speciality</label>
            <p>{doctor.data.speciality}</p>
          </div>
          <div>
            <label>Service</label>
            <p>{doctor.data.service}</p>
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

export default Home;
