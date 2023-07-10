import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import {useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Header from '../components/Header';
import '../style/DoctorList.css';


const EditDoctor = () => {
  const { text } = useParams();
  const [doctors, setDoctors] = useState([]);
  const [doctor, setDoctor] = useState(null);
  // fetch all data
  useEffect(() => {
    const doctorsRef = collection(db, "doctors");
    const getDoctorsList = async () => {
      try {
        const response = await getDocs(doctorsRef);
        const fetchedData = response.docs.map((doc) => {
          return { id: doc.id, data: doc.data() };
        });
        setDoctors(fetchedData);
      } catch (error) {
        console.error(error);
      }
    };

    getDoctorsList();
  }, []);
  // select the specific doctor
  useEffect(() => {
    const selectedDoctor = doctors.find((item) => item.id === text);
    setDoctor(selectedDoctor);
  }, [doctors, text]);

  const [name, setName] = useState("");
  const [speciality, setSpeciality] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  // const [id, setId] = useState('');
  const [gender, setGender] = useState("");
  const [birth, setBirth] = useState("");
  const [nationality, setNationality] = useState("");
  // to make date clear 
  const FormatterDate = (dateTime) => {
    const totalMilliseconds =
    dateTime.seconds * 1000 + dateTime.nanoseconds / 1000000;
    const date2 = new Date(totalMilliseconds);
    const month = String(date2.getMonth() + 1).padStart(2, "0");
    const day = String(date2.getDate()).padStart(2, "0");
    const year = String(date2.getFullYear());

    return `${year}-${month}-${day}`;
  };
  useEffect(() => {
    if (doctor && doctor.data) {
       

      setName(doctor.data.name || "");
      setSpeciality(doctor.data.speciality || "");
      setAddress(doctor.data.address || "");
      setEmail(doctor.data.email || "");
      setPhone(doctor.data.phone || "");
      // setId(doctor.id || '');
      setGender(doctor.data.gender || "");
      setBirth(FormatterDate(doctor.data.birth) || ""); // stringify date
      setNationality(doctor.data.nationality || "");
    }
  }, [doctor]);

  const handleUpdate = async () => {
    const Doctor = doc(db, "doctors", text);
    await updateDoc(Doctor, {
      name: name,
      email: email,
      // id: id,
      gender: gender,
      nationality: nationality,
      speciality: speciality,
      birth: new Date(birth), // to save date in firebase correctly
      address: address,
      phone: phone,
    });
    alert("update successfully");
  };

  return (
    <div className="DoctorList">
      <div className="left">
        <Navbar />
      </div>
      <div className="right" style={{ minHeight: "100vh" }}>
        <Header />
        <div className="edit-doc">
          <div>
            <label>Name:</label> <br />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label>Email:</label> <br />
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label>Phone:</label> <br />
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div>
            <label>Address:</label> <br />
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div>
            <label>Gender:</label> <br />
            <input
              type="text"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            />
          </div>
          <div>
            <label>Birth:</label> <br />
            <input
              type="date"
              value={birth}
              onChange={(e) => { 
                setBirth(e.target.value);
              }}
            />
          </div>
          <div>
            <label>Nationality:</label> <br />
            <input
              type="text"
              value={nationality}
              onChange={(e) => setNationality(e.target.value)}
            />
          </div>
          <div>
            <label>Speciality:</label> <br />
            <input
              type="text"
              value={speciality}
              onChange={(e) => setSpeciality(e.target.value)}
            />
          </div>
          <br />
          <button id="updateDoc" onClick={handleUpdate}>
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditDoctor;