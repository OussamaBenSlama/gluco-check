import React, { useState, useEffect, useRef } from 'react';
import { collection, getDocs, doc, updateDoc, arrayUnion, getDoc, arrayRemove } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useParams ,useNavigate} from 'react-router-dom';
import Navbar from '../components/Navbar';
import HeaderPatient from '../components/HeaderPatient';
import '../style/DoctorList.css';

const EditPatient = () => {
  const { text } = useParams();
  const [patients, setPatients] = useState([]);
  const [patient, setPatient] = useState(null);
  const naviagte = useNavigate()

  useEffect(() => {
    const patientRef = collection(db, "users");
    const getPatientList = async () => {
      try {
        const response = await getDocs(patientRef);
        const fetchedData = response.docs.map((doc) => {
          return { id: doc.id, data: doc.data() };
        });
        setPatients(fetchedData);
      } catch (error) {
        console.error(error);
      }
    };

    getPatientList();
  }, []);

  useEffect(() => {
    const selectedPatient = patients.find((item) => item.id === text);
    setPatient(selectedPatient);
  }, [patients, text]);

  const [name, setName] = useState('');
  const [matricule, setMatricule] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');
  const [birth, setBirth] = useState('');
  const [weight, setWeight] = useState(0);
  const [height, setHeight] = useState(0);
  const [selectedService, setSelectedService] = useState(''); 
  const [doctorID, setDoctorID] = useState('');

  const [doctorName, setDoctorName] = useState('');
  const [doctorMatricule, setDoctorMatricule] = useState(''); 
  const [filteredDoctors, setFilteredDoctors] = useState([]); 

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
    if (patient && patient.data) {
      setName(patient.data.name || '');
      setMatricule(patient.data.matricule || '');
      setAddress(patient.data.address || '');
      setEmail(patient.data.email || '');
      setPhone(patient.data.phone || '');
      setGender(patient.data.gender || '');
      setBirth(FormatterDate(patient.data.birth) || '');
      setWeight(patient.data.weight || 0);
      setHeight(patient.data.height || 0);
      setSelectedService(patient.data.service || ''); 
      setDoctorID(patient.data.doctor || '');
    }
  }, [patient]);

  useEffect(() => {
    const fetchDoctorName = async () => {
      if (doctorID) {
        const doctorRef = doc(db, "doctors", doctorID);
        const doctorSnapshot = await getDoc(doctorRef);

        if (doctorSnapshot.exists()) {
          const doctorData = doctorSnapshot.data();
          setDoctorName(doctorData.name || '');
          setDoctorMatricule(doctorData.matricule || '') ;
        } else {
          setDoctorName(''); 
          setDoctorMatricule('')
        }
      } else {
        setDoctorName(''); 
        setDoctorMatricule('')
      }
    };

    fetchDoctorName();
  }, [doctorID]);

  const handleUpdate = async () => {
    const patientRef = doc(db, "users", text);
    const patientSnapshot = await getDoc(patientRef);
    const previousDoctorID = patientSnapshot.data().doctor;

    if (previousDoctorID && previousDoctorID !== doctorID) {
      const previousDoctorRef = doc(db, "doctors", previousDoctorID);
      const previousDoctorSnapshot = await getDoc(previousDoctorRef);

      if (previousDoctorSnapshot.exists()) {
        await updateDoc(previousDoctorRef, {
          patients: arrayRemove(patientSnapshot.id),
        });
      } else {
        console.log("Previous doctor document not found.");
      }
    }

    await updateDoc(patientRef, {
      name: name,
      matricule : matricule ,
      email: email,
      gender: gender,
      weight: weight,
      birth: new Date(birth),
      address: address,
      phone: phone,
      height: height,
      service: selectedService,
      doctor: doctorID || null, // Set the doctorID to null if it's empty
    });

    if (doctorID !== '') {
      const doctorRef = doc(db, "doctors", doctorID);
      const doctorSnapshot = await getDoc(doctorRef);

      if (doctorSnapshot.exists()) {
        await updateDoc(doctorRef, {
          patients: arrayUnion(patientSnapshot.id),
        });
      } else {
        console.log("Doctor document not found.");
      }
    }

    alert("Update successful");
    naviagte('/dashboard/patients')
  };

  // Fetch services for autocomplete in service input:
  const [services, setServices] = useState([]);

  useEffect(() => {
    const servicesRef = collection(db, 'services');
    const getServicesList = async () => {
      try {
        const response = await getDocs(servicesRef);
        const fetchedData = response.docs.map((doc) => {
          return { id: doc.id, data: doc.data() };
        });
        setServices(fetchedData);
      } catch (error) {
        console.error(error);
      }
    };

    getServicesList();
  }, []);

  

  // Fetch doctors for autocomplete in doctor name input:
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const doctorsRef = collection(db, 'doctors');
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

  useEffect(() => {
    const filtered = doctors.filter((doctor) =>
      doctor.data.name.toLowerCase().includes(doctorName.toLowerCase())
    );
    setFilteredDoctors(filtered);
  }, [doctors, doctorName]);

  return (
    <div className="DoctorList">
      <div className="left">
        <Navbar />
      </div>
      <div className="right">
        <HeaderPatient />
        <div className="edit-doc">
          <div>
            <label>Name:</label> <br />
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label>Medical ID:</label> <br />
            <input type="text" value={matricule} onChange={(e) => setMatricule(e.target.value)} />
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
            <textarea type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>
          <div>
            <label>Gender:</label> <br />
            <select
              id='gender'
              name='gender'
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value=''>Select Gender</option>
              <option value='Male'>Male</option>
              <option value='Female'>Female</option>
            </select>
          </div>
          <div>
            <label>Birth:</label> <br />
            <input type="date" value={birth} onChange={(e) => setBirth(e.target.value)} />
          </div>
          <div>
            <label>Weight (kg):</label> <br />
            <input type="text" value={weight} onChange={(e) => setWeight(e.target.value)} />
          </div>
          <div>
            <label>Height (cm):</label> <br />
            <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
          </div>
          <div className="doctorName-container">
            <label>Doctor Name:</label> <br />
            <input
              type="text"
              value={doctorName }
              onChange={(e) => {
                setDoctorName(e.target.value);
                setFilteredDoctors(
                  doctors.filter((doctor) =>
                    doctor.data.name.toLowerCase().includes(e.target.value.toLowerCase())
                  )
                );
              }}
            />
            {filteredDoctors.length > 0 &&(
              <ul className="doctor-suggestions">
                {filteredDoctors.map((doctor) => (
                  <li className='doctor-suggestion'
                    key={doctor.id}
                    onClick={() => {
                      setDoctorName(doctor.data.name);
                      setDoctorID(doctor.id); 
                      setFilteredDoctors([]); 
                    }}
                  >
                    {doctor.data.name} -
                    {doctor.data.matricule}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <label>Service:</label> <br />
            <select
              id='service'
              name='service'
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              style={{ marginBottom: '2rem' }}
            >
              <option value=''>Select a Service</option>
              {services.map((service) => (
                <option key={service.id} value={service.data.name}>
                  {service.data.name}
                </option>
              ))}
            </select>
          </div>
          <br />
          
        </div>
        
        <div className='btn-action'>
          <button id="updatePat" onClick={handleUpdate}>
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPatient;
