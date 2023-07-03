import React, { useState } from 'react';
import '../style/AddDoctor.css';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../config/firebase';

const AddPatient = () => {
  const [formData, setFormData] = useState({
    name: '',
    id: '',
    email: '',
    phone: '',
    address: '',
    gender: '',
    birth: '',
    doctor : '' ,
    nationality: '',
    height : 0 ,
    history : [] ,
    messages : [] ,
    device : {id:'', name : ''} ,
    oldDevice : [],
    service : '' ,
  });

  const PatientRef = collection(db, 'users'); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform form submission or validation here
    console.log(formData);
  };

  const addNewPatient = async () => {
    try {
      await addDoc(PatientRef, {
        name: formData.name,
        id: formData.id,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        gender: formData.gender,
        birth: formData.birth,
        doctor : formData.doctor ,
        nationality: formData.nationality,
        height : formData.height,
        history : formData.history ,
        messages : formData.messages,
        device : formData.device ,
        oldDevice : formData.oldDevice,
        service : formData.service,
      });
      alert('Patient added successfully');
      setFormData({
        name: '',
        id: '',
        email: '',
        phone: '',
        address: '',
        gender: '',
        birth: '',
        doctor : '' ,
        nationality: '',
        height : 0 ,
        history : [] ,
        messages : [] ,
        device : {} ,
        oldDevice : {} ,
        service : '' ,
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='Form' style={{padding:'0.5rem 0 0 3rem'}}>
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
          Height: <span>*</span>
        </label>
        <br />
        <input
          type='number'
          id='height'
          name='height'
          value={formData.height}
          onChange={handleChange}
        />
      </div>
      
      <div>
        <label htmlFor='speciality'>
          doctor ID: <span>*</span>
        </label>
        <br />
        <input
          type='text'
          id='doctor'
          name='doctor'
          value={formData.doctor}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor='speciality'>
          Service: <span>*</span>
        </label>
        <br />
        <input
          type='text'
          id='service'
          name='service'
          value={formData.service}
          onChange={handleChange}
        />
      </div>
      <br />
      <button type='submit' id='addDoc' onClick={addNewPatient} style={{left:'41%' , top:'98%'}}>
        Submit
      </button>
    </form>
  );
};

export default AddPatient;
