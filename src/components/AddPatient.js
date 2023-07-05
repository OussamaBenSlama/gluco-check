import React, { useState, useEffect, useRef } from 'react';
import '../style/AddDoctor.css';
import { addDoc, collection ,getDocs,getDoc,updateDoc,doc,arrayUnion} from 'firebase/firestore';
import { db } from '../config/firebase';

const AddPatient = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    gender: '',
    birth: '',
    doctor: '',
    nationality: '',
    height: 0,
    history: [],
    messages: [],
    device: { id: '', name: '' },
    oldDevice: [],
    service: '',
  });

  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [doctorID, setDoctorID] = useState('');

  const PatientRef = collection(db, 'users');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform form submission or validation here
    console.log(formData);
  };

  

  const suggestionsRef = useRef(null);

  useEffect(() => {
    const getDoctorsList = async () => {
      try {
        const doctorsRef = collection(db, 'doctors');
        const response = await getDocs(doctorsRef);
        const fetchedData = response.docs.map((doc) => {
          return { id: doc.id, data: doc.data() };
        });
        setFilteredDoctors(fetchedData);
      } catch (error) {
        console.error(error);
      }
    };

    getDoctorsList();
  }, []);

  const handleSelectDoctor = (selectedDoctorID) => {
    setDoctorID(selectedDoctorID);
  };

  useEffect(() => {
    const filtered = filteredDoctors.filter((doctor) =>
      doctor.data.name.toLowerCase().includes(doctorID.toLowerCase())
    );
    setFilteredDoctors(filtered);
  }, [doctorID]);
  const addNewPatient = async () => {
    try {
      await addDoc(PatientRef, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        gender: formData.gender,
        birth: formData.birth,
        doctor: doctorID,
        nationality: formData.nationality,
        height: formData.height,
        history: formData.history,
        messages: formData.messages,
        device: formData.device,
        oldDevice: formData.oldDevice,
        service: formData.service,
      });
      if (doctorID !== '') {
        const doctorRef = doc(db, "doctors", doctorID);
        const doctorSnapshot = await getDoc(doctorRef);
        
        if (doctorSnapshot.exists()) {
          await updateDoc(doctorRef, {
            patients: arrayUnion({
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
              address: formData.address,
              gender: formData.gender,
              birth: formData.birth,
              doctor: doctorID,
              nationality: formData.nationality,
              height: formData.height,
              history: formData.history,
              messages: formData.messages,
              device: formData.device,
              oldDevice: formData.oldDevice,
              service: formData.service,
            })
          });
        } else {
          console.log("Doctor document not found.");
        }
      }
      alert('Patient added successfully');
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        gender: '',
        birth: '',
        doctor: '',
        nationality: '',
        height: 0,
        history: [],
        messages: [],
        device: {},
        oldDevice: {},
        service: '',
      });
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="Form" style={{ padding: '0.5rem 0 0 3rem' }}>
      <div>
        <label htmlFor="name">
          Name: <span>*</span>
        </label>{' '}
        <br />
        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} />
      </div>
      {/* <div>
        <label htmlFor="id">
          ID: <span>*</span>
        </label>
        <br />
        <input type="text" id="id" name="id" value={formData.id} onChange={handleChange} />
      </div> */}
      <div>
        <label htmlFor="email">
          Email: <span>*</span>
        </label>
        <br />
        <input type="text" id="email" name="email" value={formData.email} onChange={handleChange} />
      </div>
      <div>
        <label htmlFor="phone">
          Phone: <span>*</span>
        </label>
        <br />
        <input type="text" id="phone" name="phone" value={formData.phone} onChange={handleChange} />
      </div>
      <div>
        <label htmlFor="address">
          Address: <span>*</span>
        </label>
        <br />
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="gender">
          Gender: <span>*</span>
        </label>
        <br />
        <input type="text" id="gender" name="gender" value={formData.gender} onChange={handleChange} />
      </div>
      <div>
        <label htmlFor="birth">
          Birth: <span>*</span>
        </label>
        <br />
        <input type="date" id="birth" name="birth" value={formData.birth} onChange={handleChange} />
      </div>
      <div>
        <label htmlFor="nationality">
          Nationality: <span>*</span>
        </label>
        <br />
        <input
          type="text"
          id="nationality"
          name="nationality"
          value={formData.nationality}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="height">
          Height: <span>*</span>
        </label>
        <br />
        <input type="number" id="height" name="height" value={formData.height} onChange={handleChange} />
      </div>
      
      <div>
        <label htmlFor="service">
          Service: <span>*</span>
        </label>
        <br />
        <input
          type="text"
          id="service"
          name="service"
          value={formData.service}
          onChange={handleChange}
        />
      </div>
      <div className="doctorID-container">
        <label>doctorID:</label> <br />
        <input
          type="text"
          value={doctorID}
          onChange={(e) => setDoctorID(e.target.value)}
        />
        {filteredDoctors.length > 0 && (
          <ul className="doctor-suggestions" ref={suggestionsRef}>
            {filteredDoctors.map((doctor) => (
              <li
                key={doctor.id}
                onClick={() => handleSelectDoctor(doctor.id)}
                className="doctor-suggestion"
              >
                {doctor.data.name}
              </li>
            ))}
          </ul>
        )}
      </div>
      <br />
      <button type="submit" id="addPat" onClick={addNewPatient}>
        Submit
      </button>
    </form>
  );
};

export default AddPatient;
