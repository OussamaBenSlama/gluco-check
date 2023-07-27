import React, { useEffect, useState } from 'react';
import '../style/DoctorList.css';
import '../style/Specialities.css';
import {
  getDocs,
  collection,
  addDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import Navbar from '../components/Navbar';
import Header from '../components/Header';

const Specialities = () => {
  const [specialities, setSpecialities] = useState([]);
  const [referenceInput, setReferenceInput] = useState('');
  const [specialityInput, setSpecialityInput] = useState('');
  const [service, setService] = useState(''); // Initialize the 'service' state

  useEffect(() => {
    const specialityRef = collection(db, 'specialities');
    const getSpecialities = async () => {
      try {
        const response = await getDocs(specialityRef);
        const data = response.docs.map((doc) => ({ id: doc.id, data: doc.data() }));
        setSpecialities(data);
      } catch (error) {
        console.log(error);
      }
    };
    getSpecialities();
  }, []);

  const [services, setServices] = useState([]);

  useEffect(() => {
    const serviceRef = collection(db, 'services'); // Correct the reference to fetch services data
    const getServices = async () => {
      try {
        const response = await getDocs(serviceRef);
        const data = response.docs.map((doc) => doc.data().name);
        setServices(data);
      } catch (error) {
        console.log(error);
      }
    };
    getServices();
  }, []);

  const handleAddSpeciality = async () => {
    if (referenceInput.trim() === '' || specialityInput.trim() === '') {
      alert('Please fill both reference and speciality fields.');
      return;
    }
    const existingSpeciality = specialities.find(
      (speciality) => speciality.data.reference === referenceInput
    );
    if (existingSpeciality) {
      alert('Reference must be unique. This reference already exists.');
      return;
    }

    try {
      const newSpecialityRef = await addDoc(collection(db, 'specialities'), {
        reference: referenceInput,
        name: specialityInput,
        service: service, // Correctly set the 'service' field in the new speciality document
      });

      setSpecialities([
        ...specialities,
        { id: newSpecialityRef.id, data: { reference: referenceInput, name: specialityInput , service :service } },
      ]);
      setReferenceInput('');
      setSpecialityInput('');

      alert('Speciality added successfully!');
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteSpeciality = async (id) => {
    try {
      // Remove the speciality from Firebase
      await deleteDoc(doc(db, 'specialities', id));

      // Update the state by filtering out the deleted speciality
      setSpecialities(specialities.filter((speciality) => speciality.id !== id));

      alert('Speciality deleted successfully!');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='DoctorList'>
      <div className='left'>
        <Navbar />
      </div>
      <div className='right'>
        <Header />
        <div className='Speciality-container'>
          <div className='Speciality'>
            <div className='add-speciality'>
              <select
                id='service'
                name='service'
                value={service}
                onChange={(e) => setService(e.target.value)}
                
              >
                <option value=''>Select Service</option> 
                {services.map((service, index) => (
                  <option key={index} value={service}>
                    {service}
                  </option>
                ))}
              </select>
              <input
                type='text'
                placeholder='reference'
                value={referenceInput}
                onChange={(e) => setReferenceInput(e.target.value)}
              />
              <input
                type='text'
                placeholder='Speciality'
                value={specialityInput}
                onChange={(e) => setSpecialityInput(e.target.value)}
              />
              <button onClick={handleAddSpeciality}>Add</button>
            </div>
            <div className='Speciality-items'>
              <div className='speciality-item'>
              <p style={{ color: '#004054', fontWeight: 'bold', width: '10rem' }}>Service</p>
                <p style={{ color: '#004054', fontWeight: 'bold', width: '3rem' }}>Reference</p>
                <p style={{ textTransform: 'capitalize', color: '#004054', fontWeight: 'bold', width: '5rem' }}>Speciality</p>
                <p style={{ color: '#004054', fontWeight: 'bold', width: '1rem' }}>Delete</p>
              </div>
              {specialities.length > 0 ? (
                specialities.map((doc) => (
                  <div className='speciality-item' key={doc.id}>
                    <p style={{ width: '10rem' }}>{doc.data.service}</p>
                    <p style={{ color: '#009197', fontWeight: 'bold', width: '3rem' }}>{doc.data.reference}</p>
                    <p style={{ textTransform: 'capitalize', width: '5rem' }}>{doc.data.name}</p>
                    <FontAwesomeIcon
                      icon={faTrashAlt}
                      color='#004054'
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleDeleteSpeciality(doc.id)}
                    />
                  </div>
                ))
              ) : (
                <React.Fragment>
                  No specialities, please add one
                </React.Fragment>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Specialities;
