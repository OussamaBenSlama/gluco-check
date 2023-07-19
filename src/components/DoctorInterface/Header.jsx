import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faEnvelope, faBars } from '@fortawesome/free-solid-svg-icons';
import NavbarSlider from './NavbarSlider';
import { db , auth } from '../../config/firebase';
import { doc, getDoc , collection , getDocs } from 'firebase/firestore';

const Header = ({ doctor }) => {
  const [showButton, setShowButton] = useState(false);
  const [navState, setNavState] = useState(false);
  const [patients, setPatients] = useState([]);
  const [notifList, setNotifList] = useState([]);
  const format_total_Date = (dateTime) => {
    const totalMilliseconds =
    dateTime.seconds * 1000 + dateTime.nanoseconds / 1000000;
    const date2 = new Date(totalMilliseconds);
    const month = String(date2.getMonth() + 1).padStart(2, '0');
    const day = String(date2.getDate()).padStart(2, '0');
    const year = String(date2.getFullYear());
    const hour = String(date2.getHours()).padStart(2, '0');
    const minute = String(date2.getMinutes()).padStart(2, '0');
    const second = String(date2.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const doctorsRef = collection(db, 'doctors');
          const doctorsSnapshot = await getDocs(doctorsRef);
          const doctors = doctorsSnapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }));

          const currentDoctor = doctors.find(
            (doc) => doc.data.id === user.uid
          );
          if (currentDoctor) {
            

            const patientPromises = currentDoctor.data.patients.map(
              async (patientId) => {
                const patientRef = doc(db, 'users', patientId);
                const patientSnapshot = await getDoc(patientRef);
                return { id: patientId, data: patientSnapshot.data() };
              }
            );

            const patientData = await Promise.all(patientPromises);
            setPatients(patientData);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const updatedNotifList = [];

    patients.forEach((patient) => {
      if (patient.data && patient.data.history && patient.data.history.length > 0) {
        patient.data.history.forEach((entry) => {
          
          if (entry.new && entry.new === true) {
            // console.log("hey")
            // console.log(entry)
            updatedNotifList.push({
              patientId: patient.id,
              date: entry.date,
              value: entry.value,
            });
          }
        });
      }
    });

    setNotifList(updatedNotifList);
  }, [patients]);
  
  const trackWindowWidth = () => {
    if (window.innerWidth <= 800) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  };

  window.addEventListener('resize', trackWindowWidth);

  useEffect(() => {
    if (window.innerWidth <= 900) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  }, []);
  console.log("******")
  console.log(doctor)
  return (
    <div className='Header'>
      <div className='head' style={{ backgroundColor: 'rgb(245, 245, 245)', justifyContent: 'space-between' }}>
        {showButton ? (
          <button
            onClick={() => {
              setNavState(!navState);
            }}
          >
            <FontAwesomeIcon icon={faBars} cursor='pointer' color='white' className='Bars' />
          </button>
        ) : null}
        {navState && showButton ? (
          <React.Fragment>
            <div className='show-nav'>
              <NavbarSlider setNavState={setNavState} doctor={doctor} />
            </div>
          </React.Fragment>
        ) : null}
        <div></div>
        <div>
          <div className='notification'>
            <FontAwesomeIcon icon={faBell} style={{ marginRight: '1rem' }} />
            <div className='notification-list'>
               {notifList.map((notif) => (
                <div key={notif.patientId}>
                  Patient ID: {notif.patientId} - Date: {format_total_Date(notif.date)}- Value: {notif.value}
                </div>
              ))} 
            </div>
          </div>
          <FontAwesomeIcon icon={faEnvelope} />
        </div>
      </div>
    </div>
  );
};

export default Header;
