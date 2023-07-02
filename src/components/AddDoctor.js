import React, { useState } from 'react';
import '../style/AddDoctor.css';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../config/firebase';

const AddDoctor = () => {
  const [formData, setFormData] = useState({
    name: '',
    id: '',
    email: '',
    phone: '',
    address: '',
    gender: '',
    birth: '',
    nationality: '',
    speciality: '',
    patients : []
  });
  const doctorsRef = collection(db, 'doctors');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform form submission or validation here
    console.log(formData);
  };

  const addNewDoctor = async () => {
    try {
      await addDoc(doctorsRef, {
        name: formData.name,
        id: formData.id,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        gender: formData.gender,
        birth: formData.birth,
        nationality: formData.nationality,
        speciality: formData.speciality,
        patients : formData.patients,
      });
    } catch (err) {
      console.error(err);
    }
    alert("doctor added successfully")
    setFormData({
      name: '',
      id: '',
      email: '',
      phone: '',
      address: '',
      gender: '',
      birth: '',
      nationality: '',
      speciality: '',
      
    })
  };

  return (
    <form onSubmit={handleSubmit} className='Form'>
      <div>
        <label htmlFor='name'>
          Name: <span>*</span>
        </label>{' '}
        <br />
        <input type='text' id='name' name='name' value={formData.name} onChange={handleChange} />
      </div>
      <div>
        <label htmlFor='id'>
          ID: <span>*</span>
        </label>
        <br />
        <input type='text' id='id' name='id' value={formData.id} onChange={handleChange} />
      </div>
      <div>
        <label htmlFor='email'>
          Email: <span>*</span>
        </label>
        <br />
        <input type='text' id='email' name='email' value={formData.email} onChange={handleChange} />
      </div>
      <div>
        <label htmlFor='phone'>
          Phone: <span>*</span>
        </label>
        <br />
        <input type='text' id='phone' name='phone' value={formData.phone} onChange={handleChange} />
      </div>
      <div>
        <label htmlFor='address'>
          Address: <span>*</span>
        </label>
        <br />
        <input type='text' id='address' name='address' value={formData.address} onChange={handleChange} />
      </div>
      <div>
        <label htmlFor='gender'>
          Gender: <span>*</span>
        </label>
        <br />
        <input type='text' id='gender' name='gender' value={formData.gender} onChange={handleChange} />
      </div>
      <div>
        <label htmlFor='birth'>
          Birth: <span>*</span>
        </label>
        <br />
        <input type='date' id='birth' name='birth' value={formData.birth} onChange={handleChange} />
      </div>
      <div>
        <label htmlFor='nationality'>
          Nationality: <span>*</span>
        </label>
        <br />
        <input
          type='text'
          id='nationality'
          name='nationality'
          value={formData.nationality}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor='speciality'>
          Speciality: <span>*</span>
        </label>
        <br />
        <input
          type='text'
          id='speciality'
          name='speciality'
          value={formData.speciality}
          onChange={handleChange}
        />
      </div>
      <br />
      <button type='submit' id='addDoc' onClick={addNewDoctor}>
        Submit
      </button>
    </form>
  );
};

export default AddDoctor;
