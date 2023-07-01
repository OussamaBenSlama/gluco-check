import React from 'react'
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';


const SpecificDoctor = ({name}) => {
    const [doctor, setDoctor] = useState(null);

  useEffect(() => {
    const getDoctorByName = async () => {
      const doctorsRef = collection(db, 'doctors');
      const q = query(doctorsRef, where('name', '==', name));
      
      try {
        const response = await getDocs(q);
        if (!response.empty) {
          const fetchedDoctor = response.docs[0].data();
          setDoctor(fetchedDoctor);
        } else {
          setDoctor(null);
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (name) {
      getDoctorByName();
    }
  }, [name]);

  return (
    <div>
      {doctor ? (
        <div>
          <h2>Doctor Details</h2>
          <p>Name: {doctor.name}</p>
          <p>ID: {doctor.id}</p>
          <p>Email: {doctor.email}</p>
          {/* Add other doctor details here */}
        </div>
      ) : (
        <p>No doctor found with the name {name}</p>
      )}
    </div>
  )
}

export default SpecificDoctor