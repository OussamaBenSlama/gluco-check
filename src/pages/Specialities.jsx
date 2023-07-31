import React, { useEffect, useState } from 'react';
import '../style/DoctorList.css';
import '../style/Specialities.css';
import {
  getDocs,
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faEdit, faCheck } from '@fortawesome/free-solid-svg-icons';
import Navbar from '../components/Navbar';
import Header from '../components/Header';

const Specialities = () => {
  const [specialities, setSpecialities] = useState([]);
  const [referenceInput, setReferenceInput] = useState('');
  const [specialityInput, setSpecialityInput] = useState('');
  const [update, setUpdate] = useState(false);
  const [editedSpecialityId, setEditedSpecialityId] = useState('');
  const [editedSpecialityName, setEditedSpecialityName] = useState('');
  const [doctors, setDoctors] = useState([]);

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

  const handleAddSpeciality = async () => {
    if (referenceInput.trim() === '' || specialityInput.trim() === '') {
      alert('Please fill both reference and speciality fields.');
      return;
    }

    const existingSpeciality = specialities.find((speciality) => speciality.data.reference === referenceInput);
    if (existingSpeciality) {
      alert('Reference must be unique. This reference already exists.');
      return;
    }

    try {
      const newSpecialityRef = await addDoc(collection(db, 'specialities'), {
        reference: referenceInput,
        name: specialityInput,
      });

      setSpecialities([
        ...specialities,
        { id: newSpecialityRef.id, data: { reference: referenceInput, name: specialityInput } },
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
      const specialityToDelete = specialities.find((speciality) => speciality.id === id);
      if (!specialityToDelete) {
        alert('Speciality not found!');
        return;
      }

      await deleteDoc(doc(db, 'specialities', id));

      setSpecialities((prevSpecialities) => prevSpecialities.filter((speciality) => speciality.id !== id));

      const doctorsToUpdate = doctors.filter((doctor) => doctor.data.speciality === specialityToDelete.data.name);

      const updateDoctorPromises = doctorsToUpdate.map(async (doctor) => {
        const doctorRef = doc(db, 'doctors', doctor.id);
        await updateDoc(doctorRef, { speciality: '' });
      });

      await Promise.all(updateDoctorPromises);

      alert('Speciality deleted successfully!');
    } catch (error) {
      console.error(error);
      alert('An error occurred while deleting the speciality.');
    }
  };

  const handleUpdateSpeciality = async (specialityId) => {
    try {
      const specialityToUpdate = specialities.find((speciality) => speciality.id === specialityId);
      if (!specialityToUpdate) {
        alert('Speciality not found!');
        return;
      }

      const specialityRef = doc(db, 'specialities', specialityId);
      await updateDoc(specialityRef, { name: editedSpecialityName });

      setSpecialities((prevSpecialities) =>
        prevSpecialities.map((speciality) =>
          speciality.id === specialityId ? { ...speciality, data: { ...speciality.data, name: editedSpecialityName } } : speciality
        )
      );

      const doctorsToUpdate = doctors.filter((doctor) => doctor.data.speciality === specialityToUpdate.data.name);

      const updateDoctorPromises = doctorsToUpdate.map(async (doctor) => {
        const doctorRef = doc(db, 'doctors', doctor.id);
        await updateDoc(doctorRef, { speciality: editedSpecialityName });
      });

      await Promise.all(updateDoctorPromises);

      setEditedSpecialityName('');
      setEditedSpecialityId('');
      setUpdate(false);

      alert('Speciality name updated successfully!');
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
                <p style={{ color: '#004054', fontWeight: 'bold', width: '33%', textAlign: 'center' }}>Reference</p>
                <p style={{ textTransform: 'capitalize', color: '#004054', fontWeight: 'bold', width: '33%', textAlign: 'center' }}>Speciality</p>
                <p style={{ color: '#004054', fontWeight: 'bold', width: '33%', textAlign: 'center' }}></p>
              </div>
              {specialities.length > 0 ? (
                specialities.map((doc) => (
                  <div className='speciality-item' key={doc.id}>
                    <p style={{ color: '#009197', fontWeight: 'bold', width: '33%', textAlign: 'center' }}>{doc.data.reference}</p>
                    {update && editedSpecialityId === doc.id ? (
                      <input
                        type='text'
                        value={editedSpecialityName}
                        placeholder='new name'
                        onChange={(e) => setEditedSpecialityName(e.target.value)}
                        style={{
                          padding: '0.5rem',
                          border: '1px solid rgb(245,245,245)',
                          backgroundColor: 'rgb(245,245,245)',
                        }}
                      />
                    ) : (
                      <p style={{ textTransform: 'capitalize', width: '33%', textAlign: 'center' }}>{doc.data.name}</p>
                    )}
                    <div style={{ width: '33%', textAlign: 'center' }}>
                      <FontAwesomeIcon
                        icon={faTrashAlt}
                        color='#004054'
                        style={{ cursor: 'pointer', marginRight: '1rem' }}
                        onClick={() => handleDeleteSpeciality(doc.id)}
                      />
                      {update && editedSpecialityId === doc.id ? (
                        <FontAwesomeIcon
                          icon={faCheck}
                          color='#004054'
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleUpdateSpeciality(doc.id)}
                        />
                      ) : (
                        <FontAwesomeIcon
                          icon={faEdit}
                          color='#004054'
                          style={{ cursor: 'pointer' }}
                          onClick={() => {
                            setEditedSpecialityName(doc.data.name);
                            setEditedSpecialityId(doc.id);
                            setUpdate(true);
                          }}
                        />
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <React.Fragment>No specialities, please add one</React.Fragment>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Specialities;
