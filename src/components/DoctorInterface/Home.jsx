import React from 'react'
import '../../style/DoctorInterfaceStyle/Home.css';
import myLogo from '../../images/patient.png';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faPlus , faEdit} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from 'react-router-dom';

const Home = ({doctor}) => {
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
      const goedit = () => {
        navigate('/doctorspace/editprofile', { state: { doctor } });
      }
  return (
    <div className='Home'>
        <div className='title'>
            <div>
                <img src={myLogo} alt="" />
                <div>
                    <h2>{doctor ? doctor.data.name : 'Guest'}</h2> 
                    <p>{doctor ? doctor.data.patients.length : 0} patient</p>
                </div>
            </div>
            <div>
                <button id='addPatient'>
                    <FontAwesomeIcon
                        icon={faPlus}
                        cursor="pointer"
                        color="white"
                        style={{ marginRight: "1rem", fontSize: "1rem" }}
                    />
                    Add patient</button>
                <button id='editProfile'  onClick={goedit}>
                    <FontAwesomeIcon
                        icon={faEdit}
                        cursor="pointer"
                        color="white"
                        style={{ marginRight: "1rem", fontSize: "1rem" }}
                       
                    />
                    edit profile</button>
            </div>
        </div>
        <div className='doc-content'>
            <div className='basic-info'>
                <label>Speciality : </label><p>{doctor ? doctor.data.speciality : ''}</p> <br/>
                <label>Email : </label><p>{doctor ? doctor.data.email : ''}</p> <br/>
                <label>Address :</label><p>{doctor ? doctor.data.address : ''}</p> <br/>
                <label>Phone : </label><p>{doctor ? doctor.data.phone : ''}</p> <br/>
            </div>
            <div className='second-info'>
                <label>Birth : </label><p>{doctor ? FormatterDate(doctor.data.birth) : ''}</p> <br/>
                <label>Gender : </label><p>{doctor ? doctor.data.gender : ''}</p> <br/>
                <label>Nationality :</label><p>{doctor ? doctor.data.nationality : ''}</p> <br/>
            </div>
        </div>
    </div>
  )
}

export default Home