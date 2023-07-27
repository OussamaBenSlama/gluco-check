import React, { useEffect, useState } from 'react';
import '../style/DoctorList.css'
import '../style/Specialities.css'
import { getDocs, collection, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import Navbar from '../components/Navbar';
import Header from '../components/Header';

const Service = () => {
  const [services, setServices] = useState([]);
  const [referenceInput, setReferenceInput] = useState('');
  const [servicesInput, setServicesInput] = useState('');

  useEffect(() => {
    const servicesRef = collection(db, 'services');
    const getServices = async () => {
      try {
        const response = await getDocs(servicesRef);
        const data = response.docs.map((doc) => ({ id: doc.id, data: doc.data() }));
        setServices(data);
      } catch (error) {
        console.log(error);
      }
    };
    getServices();
  }, []);

  const handleAddServices = async () => {
    if (referenceInput.trim() === '' || servicesInput.trim() === '') {
      alert('Please fill both reference and service fields.');
      return;
    }
    const existingServices = services.find((service) => service.data.reference === referenceInput);
    if (existingServices) {
      alert('Reference must be unique. This reference already exists.');
      return;
    }

    try {
      const newServiceRef = await addDoc(collection(db, 'services'), {
        reference: referenceInput,
        name: servicesInput,
      });

      setServices([...services, { id: newServiceRef.id, data: { reference: referenceInput, name: servicesInput } }]);
      setReferenceInput('');
      setServicesInput('');

      alert('service added successfully!');
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteServices = async (id) => {
    try {
      
      await deleteDoc(doc(db, 'services', id));

      
      setServices(services.filter((service) => service.id !== id));

      alert('service deleted successfully!');
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
              <input type='text' placeholder='reference' value={referenceInput} onChange={(e) => setReferenceInput(e.target.value)} />
              <input type='text' placeholder='Service' value={servicesInput} onChange={(e) => setServicesInput(e.target.value)} />
              <button onClick={handleAddServices}>Add</button>
            </div>
            <div className='Speciality-items'>
              <div className='speciality-item'>
                <p style={{ color: '#004054', fontWeight: 'bold', width: '3rem' }}>Reference</p>
                <p style={{ textTransform: 'capitalize', color: '#004054', fontWeight: 'bold', width: '5rem' }}>Speciality</p>
                <p style={{ color: '#004054', fontWeight: 'bold', width: '1rem' }}>Delete</p>
              </div>
              {services.length > 0 ? (
                services.map((doc) => (
                  <div className='speciality-item' key={doc.id}>
                    <p style={{ color: '#009197', fontWeight: 'bold', width: '3rem' }}>{doc.data.reference}</p>
                    <p style={{ textTransform: 'capitalize', width: '5rem' }}>{doc.data.name}</p>
                    <FontAwesomeIcon
                      icon={faTrashAlt}
                      color='#004054'
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleDeleteServices(doc.id)}
                    />
                  </div>
                ))
              ) : (
                <React.Fragment>
                  No specialities , please add one
                </React.Fragment>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Service;
