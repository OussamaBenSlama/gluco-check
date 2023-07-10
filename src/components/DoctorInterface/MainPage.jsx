import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Header from './Header';
import Home from './Home';
import '../../style/DoctorList.css';
import { auth, db } from '../../config/firebase';
import { collection, getDocs } from 'firebase/firestore';

const MainPage = () => {
  const [doctor, setDoctor] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const usersRef = collection(db, 'doctors');
        const userSnapshot = await getDocs(usersRef);
        const users = userSnapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }));

        const doctor = users.find((doc) => doc.data.id === user.uid);
        if (doctor) {
          setDoctor(doctor);
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="DoctorList" style={{ display: 'flex' }}>
      <div className="left">
        <Navbar doctor={doctor} />
      </div>
      <div className="right">
        <Header/>
        <Home doctor={doctor} />
      </div>
    </div>
  );
};

export default MainPage;
