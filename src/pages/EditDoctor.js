import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Header from '../components/Header';
import '../style/DoctorList.css';

const EditDoctor = () => {
  const { text } = useParams();
  const [doctor, setDoctor] = useState({});

  useEffect(() => {
    const getDoctorsByName = async () => {
      if (text) {
        const doctorsRef = collection(db, 'doctors');
        const q = query(doctorsRef, where('id', '==', text));

        try {
          const response = await getDocs(q);
          if (!response.empty) {
            const fetchedDoctor = response.docs[0].data();
            setDoctor(fetchedDoctor);
          } else {
            setDoctor({});
          }
        } catch (error) {
          console.error(error);
        }
      }
    };

    getDoctorsByName();
  }, [text]);

  const [name, setName] = useState('');
  const [speciality, setSpeciality] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [id, setId] = useState('');
  const [gender, setGender] = useState('');
  const [birth, setBirth] = useState('');
  const [nationality, setNationality] = useState('');

  useEffect(() => {
    setName(doctor.name || '');
    setSpeciality(doctor.speciality || '');
    setAddress(doctor.address || '');
    setEmail(doctor.email || '');
    setPhone(doctor.phone || '');
    setId(doctor.id || '');
    setGender(doctor.gender || '');
    setBirth(doctor.birth || '');
    setNationality(doctor.nationality || '');
  }, [doctor]);

  const handleUpdate = async () => {
    const Doctor = doc(db, "doctors", text);
    await updateDoc(Doctor, { name : name , email : email ,
                              id:id , gender:gender , nationality : nationality,
                              speciality  : speciality , birth : birth ,
                              address : address , phone : phone });
  };

  return (
    <div className="DoctorList">
      <div className="left">
        <Navbar />
      </div>
      <div className="right">
        <Header />
        <div className="edit-doc">
          <div>
            <label>Name:</label> <br />
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label>ID:</label> <br />
            <input type="text" value={id} onChange={(e) => setId(e.target.value)} />
          </div>
          <div>
            <label>Email:</label> <br />
            <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label>Phone:</label> <br />
            <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div>
            <label>Address:</label> <br />
            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>
          <div>
            <label>Gender:</label> <br />
            <input type="text" value={gender} onChange={(e) => setGender(e.target.value)} />
          </div>
          <div>
            <label>Birth:</label> <br />
            <input type="text" value={birth} onChange={(e) => setBirth(e.target.value)} />
          </div>
          <div>
            <label>Nationality:</label> <br />
            <input type="text" value={nationality} onChange={(e) => setNationality(e.target.value)} />
          </div>
          <div>
            <label>Speciality:</label> <br />
            <input type="text" value={speciality} onChange={(e) => setSpeciality(e.target.value)} />
          </div>
          <br />
          <button onClick={handleUpdate}>Update</button>
        </div>
      </div>
    </div>
  );
};

export default EditDoctor;
