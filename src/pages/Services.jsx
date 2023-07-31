import React, { useEffect, useState } from 'react';
import '../style/DoctorList.css';
import '../style/Specialities.css';
import { getDocs, collection, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faCheck } from '@fortawesome/free-solid-svg-icons';
import Navbar from '../components/Navbar';
import Header from '../components/Header';

const Service = () => {
  const [services, setServices] = useState([]);
  const [referenceInput, setReferenceInput] = useState('');
  const [servicesInput, setServicesInput] = useState('');
  const [chief, setChief] = useState('');
  const [update, setUpdate] = useState(false);
  const [isEditing, setIsEditing] = useState(null);
  const [editedServiceName, setEditedServiceName] = useState('');

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

  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const doctorsRef = collection(db, 'doctors');
    const getDoctorsList = async () => {
      try {
        const response = await getDocs(doctorsRef);
        const fetchedData = response.docs.map((doc) => ({ id: doc.id, data: doc.data() }));
        setDoctors(fetchedData);
      } catch (error) {
        console.error(error);
      }
    };

    getDoctorsList();
  }, []);

  const [patients, setpatients] = useState([]);

  useEffect(() => {
    const patientsRef = collection(db, 'users');
    const getPatientsList = async () => {
      try {
        const response = await getDocs(patientsRef);
        const fetchedData = response.docs.map((doc) => ({ id: doc.id, data: doc.data() }));
        setpatients(fetchedData);
      } catch (error) {
        console.error(error);
      }
    };

    getPatientsList();
  }, []);

  const handleAddServices = async () => {
    if (referenceInput.trim() === '' || servicesInput.trim() === '' || chief.trim() === '') {
      alert('Please fill all fields.');
      return;
    }

    const existingServices = services.find((service) => service.data.reference === referenceInput);
    if (existingServices) {
      alert('Reference must be unique. This reference already exists.');
      return;
    }

    const chiefDoctor = doctors.find((doctor) => doctor.id === chief);
    if (!chiefDoctor) {
      alert('Chief doctor not found. Please select a valid chief.');
      return;
    }

    try {
      const newServiceRef = await addDoc(collection(db, 'services'), {
        reference: referenceInput,
        name: servicesInput,
        chiefId: chief,
        chiefName: chiefDoctor.data.name,
      });
      const doctorRef = doc(db, 'doctors', chiefDoctor.id);
      await updateDoc(doctorRef, { chief: true });

      setServices((prevServices) => [
        ...prevServices,
        {
          id: newServiceRef.id,
          data: {
            reference: referenceInput,
            name: servicesInput,
            chiefId: chief,
            chiefName: chiefDoctor.data.name,
          },
        },
      ]);

      setReferenceInput('');
      setServicesInput('');
      setChief('');

      alert('Service added successfully!');
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteServices = async (id) => {
    try {
      const serviceToDelete = services.find((service) => service.id === id);
      if (!serviceToDelete) {
        alert('Service not found!');
        return;
      }

      await deleteDoc(doc(db, 'services', id));

      setServices((prevServices) => prevServices.filter((service) => service.id !== id));

      const serviceName = serviceToDelete.data.name;
      const doctorsToUpdate = doctors.filter((doctor) => doctor.data.service === serviceName);
      const usersToUpdate = patients.filter((patient) => patient.data.service === serviceName);

      const updateDoctorPromises = doctorsToUpdate.map(async (doctor) => {
        const doctorRef = doc(db, 'doctors', doctor.id);
        await updateDoc(doctorRef, { service: '' });
      });

      const updateUserPromises = usersToUpdate.map(async (user) => {
        const userRef = doc(db, 'users', user.id);
        await updateDoc(userRef, { service: '' });
      });

      await Promise.all([...updateDoctorPromises, ...updateUserPromises]);

      alert('Service deleted successfully!');
    } catch (error) {
      console.error(error);
      alert('An error occurred while deleting the service.');
    }
  };

  const handleUpdateService = async (serviceId) => {
    try {
      const serviceToUpdate = services.find((service) => service.id === serviceId);
      if (!serviceToUpdate) {
        alert('Service not found!');
        return;
      }

      const previousServiceName = serviceToUpdate.data.name;

      const serviceRef = doc(db, 'services', serviceId);
      await updateDoc(serviceRef, { name: editedServiceName });

      setServices((prevServices) =>
        prevServices.map((service) =>
          service.id === serviceId ? { ...service, data: { ...service.data, name: editedServiceName } } : service
        )
      );

      const usersToUpdate = patients.filter((user) => user.data.service === previousServiceName);
      const doctorsToUpdate = doctors.filter((doctor) => doctor.data.service === previousServiceName);

      const updateUserPromises = usersToUpdate.map(async (user) => {
        const userRef = doc(db, 'users', user.id);
        await updateDoc(userRef, { service: editedServiceName });
      });

      const updateDoctorPromises = doctorsToUpdate.map(async (doctor) => {
        const doctorRef = doc(db, 'doctors', doctor.id);
        await updateDoc(doctorRef, { service: editedServiceName });
      });

      await Promise.all([...updateUserPromises, ...updateDoctorPromises]);

      setIsEditing(null);
      setEditedServiceName('');

      alert('Service name updated successfully!');
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
              <select id='chief' name='chief' value={chief} onChange={(e) => setChief(e.target.value)}>
                <option value=''>Select Chief service</option>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.data.name}
                  </option>
                ))}
              </select>
              <input type='text' placeholder='reference' value={referenceInput} onChange={(e) => setReferenceInput(e.target.value)} />
              <input type='text' placeholder='Service' value={servicesInput} onChange={(e) => setServicesInput(e.target.value)} />
              <button onClick={handleAddServices}>Add</button>
            </div>
            <div className='Speciality-items'>
              <div className='speciality-item'>
                <p style={{ textAlign: 'center', color: '#004054', fontWeight: 'bold', width: '25%' }}>Chief service</p>
                <p style={{ textAlign: 'center', color: '#004054', fontWeight: 'bold', width: '25%' }}>Reference</p>
                <p style={{ textAlign: 'center', textTransform: 'capitalize', color: '#004054', fontWeight: 'bold', width: '25%' }}>Service</p>
                <p style={{ textAlign: 'center', color: '#004054', fontWeight: 'bold', width: '25%' }}></p>
              </div>
              {services.length > 0 ? (
                services.map((service) => (
                  <div className='speciality-item' key={service.id}>
                    <p style={{ width: '25%', textAlign: 'center' }}>{service.data.chiefName}</p>
                    <p style={{ color: '#009197', fontWeight: 'bold', width: '25%', textAlign: 'center' }}>{service.data.reference}</p>
                    {isEditing === service.id ? (
                      <input
                        type='text'
                        value={editedServiceName}
                        placeholder='new name'
                        onChange={(e) => setEditedServiceName(e.target.value)}
                        style={{
                          padding: '0.5rem',
                          border: '1px solid rgb(245,245,245)',
                          backgroundColor: 'rgb(245,245,245)',
                        }}
                      />
                    ) : (
                      <p style={{ textTransform: 'capitalize', width: '25%', textAlign: 'center' }}>{service.data.name}</p>
                    )}
                    <div style={{ width: '25%', textAlign: 'center' }}>
                      <FontAwesomeIcon
                        icon={faTrashAlt}
                        color='#004054'
                        style={{ cursor: 'pointer', marginRight: '1rem' }}
                        onClick={() => handleDeleteServices(service.id)}
                      />
                      {isEditing === service.id ? (
                        <FontAwesomeIcon
                          icon={faCheck}
                          color='#004054'
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleUpdateService(service.id)}
                        />
                      ) : (
                        <FontAwesomeIcon
                          icon={faEdit}
                          color='#004054'
                          style={{ cursor: 'pointer' }}
                          onClick={() => setIsEditing(service.id)}
                        />
                      )}
                      
                    </div>
                  </div>
                ))
              ) : (
                <React.Fragment>No services, please add one</React.Fragment>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Service;
