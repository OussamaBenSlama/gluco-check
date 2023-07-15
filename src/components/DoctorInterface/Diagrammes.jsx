import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Chart, CategoryScale, LinearScale, BarElement, Title, ArcElement, Legend } from 'chart.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faMobileAlt } from '@fortawesome/free-solid-svg-icons';
import { Pie } from 'react-chartjs-2';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

import Navbar from './Navbar';
import Header from './Header';
import '../../style/DoctorList.css';
import '../../style/DoctorInterfaceStyle/Diagrammes.css';

const Diagrammes = () => {
  const location = useLocation();
  const { doctor } = location.state;
  Chart.register(CategoryScale, LinearScale, BarElement, Title, ArcElement, Legend);
  const [nbpersonaff, setnbpersonaff] = useState(0);
  const [nbpersonUnaffected, setnbpersonUnaffected] = useState(0);
  const [nbpersonWithDevice, setnbpersonWithDevice] = useState(0);
  const [nbpersonWithoutDevice, setnbpersonWithoutDevice] = useState(0);
  const [patients, setPatients] = useState([]);
  const [hypo, setHypo] = useState(0);
  const [normal, setNormal] = useState(0);
  const [pre_diabete, setPreDiabete] = useState(0);
  const [hyper, setHyper] = useState(0);
  const [emptyHistoryCount, setEmptyHistoryCount] = useState(0);

  useEffect(() => {
    const fetchUsersData = async () => {
      const usersRef = collection(db, 'users');
      const usersSnapshot = await getDocs(usersRef);
      const usersData = usersSnapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }));

      const unaffectedUsersCount = usersData.filter((user) => !user.data.doctor).length;
      const withDeviceCount = usersData.filter((user) => user.data.device && user.data.device.id !== '').length;
      const withoutDeviceCount = usersData.filter((user) => user.data.device && user.data.device.id === '').length;

      setnbpersonaff(doctor.data.patients.length);
      setnbpersonUnaffected(unaffectedUsersCount);
      setnbpersonWithDevice(withDeviceCount);
      setnbpersonWithoutDevice(withoutDeviceCount);

      if (doctor) {
        const patientPromises = doctor.data.patients.map(async (patientId) => {
          const patientRef = doc(db, 'users', patientId);
          const patientSnapshot = await getDoc(patientRef);
          return { id: patientId, data: patientSnapshot.data() };
        });

        const patientData = await Promise.all(patientPromises);
        setPatients(patientData);
      }
    };

    fetchUsersData();
  }, []);
  const totalPatients = nbpersonWithDevice + nbpersonWithoutDevice;
  useEffect(() => {
    let hypoCount = 0;
    let normalCount = 0;
    let preDiabeteCount = 0;
    let hyperCount = 0;
    let emptyCount = 0;

    patients.forEach((patient) => {
      let sum = 0;
      if (patient.data && patient.data.history && patient.data.history.length > 0) {
        patient.data.history.forEach((entry) => {
          if (entry.value !== '' || entry.value !== '0') {
            sum += parseInt(entry.value);
          }
        });

        const average = sum / patient.data.history.length;

        if (average < 0.7) {
          hypoCount += 1;
        } else if (average >= 0.7 && average <= 1.10) {
          normalCount += 1;
        } else if (average > 1.10 && average <= 1.25) {
          preDiabeteCount += 1;
        } else {
          hyperCount += 1;
        }
      } else {
        emptyCount += 1;
      }
    });

    setHypo(hypoCount);
    setNormal(normalCount);
    setPreDiabete(preDiabeteCount);
    setHyper(hyperCount);
    setEmptyHistoryCount(emptyCount);
  }, [patients]);

  
 
  const pieData = {
    labels: ['Hypo', 'Normal', 'Pre-diabete', 'Hyper', 'Empty History'],
    datasets: [
      {
        label: 'Patient Distribution',
        data: [hypo, normal, pre_diabete, hyper, emptyHistoryCount],
        backgroundColor: [
          '#F2BE22',
          '#54B435',
          '#FF6D60',
          '#DC0000' ,
          'gray',
        ],
        borderColor: [
          '#F2BE22',
          '#54B435',
          '#FF6D60',
          '#DC0000' ,
          'gray',
        ],
        borderWidth: 1,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          color: '#000000',
          font: {
            size: 12,
          },
        },
      },
    },
    layout: {
      padding: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      },
      
    },
    elements: {
      arc: {
        borderWidth: 1,
      },
    },
    width: 0, // Adjust the width of the pie chart
    height: 0, // Adjust the height of the pie chart
  
  };

  return (
    <div className='DoctorList'>
      <div className='left'>
        <Navbar doctor={doctor} />
      </div>
      <div className='right'>
        <Header doctor = {doctor}/>
         <div className='stats-content'>
              <div className='doc-list'>
                <div className='stats-card'>
                  <div>
                    <h5>Total number of patients</h5>
                    <p>{totalPatients}</p>
                  </div>
                  <FontAwesomeIcon icon={faUsers} size='2x' color='#004054' />
                </div>
                <div className='stats-card'>
                  <div>
                    <h5>Number of patients affected</h5>
                    <p>{nbpersonaff}</p>
                  </div>
                  <FontAwesomeIcon icon={faUsers} size='2x' color='green' />
                </div>
                <div className='stats-card'>
                  <div>
                    <h5>Number of unaffected patients</h5>
                    <p>{nbpersonUnaffected}</p>
                  </div>
                  <FontAwesomeIcon icon={faUsers} size='2x' color='red' />
                </div>
                <div className='stats-card'>
                  <div>
                    <h5>Number of patients with device</h5>
                    <p>{nbpersonWithDevice}</p>
                  </div>
                  <FontAwesomeIcon icon={faMobileAlt} size='2x' color='green' />
                </div>
                <div className='stats-card'>
                  <div>
                    <h5>Number of patients without a device</h5>
                    <p>{nbpersonWithoutDevice}</p>
                  </div>
                  <FontAwesomeIcon icon={faMobileAlt} size='2x' color='red' />
                </div>
              </div>
              
              <div style={{width:'100%'}}>
                  {doctor && doctor.data&& doctor.data.patients && doctor.data.patients.length > 0 ?
                  (
                    <React.Fragment>
                      <div className='chart-container' style={{width:'90%', height:'50vh' , paddingTop:'1rem'}}>
                        <Pie data={pieData} options={pieOptions} />
                      </div>
                      <div className='chart-legend' style={{display:'flex' , width:'100%', justifyContent:'center'}}>
                          {pieData.labels.map((label, index) => (
                            <div key={index} className='legend-item' style={{display:'flex'}}>
                              <span className='legend-color' style={{ backgroundColor: pieData.datasets[0].backgroundColor[index]  , fontSize:'1rem'}} />
                              <span className='legend-label' style={{marginRight:'3.5rem'}}>{` ${((pieData.datasets[0].data[index] / nbpersonaff) * 100).toFixed(2)}%`}</span>
                            </div>
                          ))}
                        </div>
                    </React.Fragment>

                  ) :
                  (
                    <React.Fragment>
                        <p>no statistics availaible now !!!</p>
                    </React.Fragment>

                  ) }
              </div>
         </div>
      </div>
    </div>
  );
};

export default Diagrammes;
