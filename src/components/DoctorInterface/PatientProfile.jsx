import React, { useState, useEffect } from 'react';
import "../../style/DoctorList.css";
import '../../style/Profile.css';
import Navbar from './Navbar';
import Header from './Header';
import { useLocation , useNavigate } from 'react-router-dom';
import myLogo from '../../images/pat.png';
import { doc, updateDoc, arrayUnion , collection,getDocs,getDoc} from 'firebase/firestore';
import { db } from '../../config/firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash ,faShare } from '@fortawesome/free-solid-svg-icons';

const PatientPro = () => {
  const location = useLocation();
  const { doctor, patient } = location.state;
  const navigate = useNavigate()
  const [history, setHistory] = useState(true);
  const [msg, setMsg] = useState('');
  const [filterOption, setFilterOption] = useState('all');
  


  const [selectedOption, setSelectedOption] = useState('specificDay');

  const formatDate = (dateTime) => {
    const totalMilliseconds =
      dateTime.seconds * 1000 + dateTime.nanoseconds / 1000000;
    const date2 = new Date(totalMilliseconds);
    const month = String(date2.getMonth() + 1).padStart(2, '0');
    const day = String(date2.getDate()).padStart(2, '0');
    const year = String(date2.getFullYear());

    return `${year}-${month}-${day}`;
  };

  const formatDateSys = (dateTime) => {
    const date = new Date(dateTime);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };
  const format_time = (dateTime) => {
    const totalMilliseconds =
      dateTime.seconds * 1000 + dateTime.nanoseconds / 1000000;
    const date2 = new Date(totalMilliseconds);
    const hour = String(date2.getHours()).padStart(2, '0');
    const minute = String(date2.getMinutes()).padStart(2, '0');
    const second = String(date2.getSeconds()).padStart(2, '0');

    return `${hour}:${minute}:${second}`;
  };
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

  const formattedHistory = patient.data.history.map((entry) => {
    return {
      ...entry,
      formattedDate: formatDate(entry.date),
    };
  });
  // diabete range configuration 
  const [diabetesRanges, setDiabetesRanges] = useState(null);
  const [normalMin, setNormalMin] = useState(0);
  const [normalMax, setNormalMax] = useState(0);
  const [preDiabeteMax, setPreDiabeteMax] = useState(0)

  useEffect(() => {
    const fetchDiabetesRanges = async () => {
      try {
        const diabetesRangesRef = collection(db, 'diabeteRange');
        const diabetesRangesSnapshot = await getDocs(diabetesRangesRef);
        const diabetesRangesData = diabetesRangesSnapshot.docs[0].data();
        setDiabetesRanges(diabetesRangesData);
        
        if (diabetesRangesData && diabetesRangesData.normal && diabetesRangesData.prediabete) {
          setNormalMin(diabetesRangesData.normal.min);
          setNormalMax(diabetesRangesData.normal.max);
          setPreDiabeteMax(diabetesRangesData.prediabete.max);
        }
      } catch (error) {
        console.error('Error fetching diabetes ranges:', error);
      }
    };
  
    fetchDiabetesRanges();
  }, []);

  const filteredHistory = formattedHistory.filter((entry) => {
    if (filterOption === 'all') {
      return true;
    } else if (filterOption === 'hypoglycemie') {
      return parseFloat(entry.value) < normalMin;
    } else if (filterOption === 'normal') {
      return parseFloat(entry.value) >= normalMin && parseFloat(entry.value) <= normalMax;
    } else if (filterOption === 'pre_diabete') {
      return parseFloat(entry.value) > normalMax && parseFloat(entry.value) <= preDiabeteMax;
    } else if (filterOption === 'hyperglycemie') {
      return parseFloat(entry.value) > preDiabeteMax;
    } else if (filterOption === 'today') {
      return formatDate(entry.date) === formatDateSys(new Date());
    } else if (filterOption === 'last_day') {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const formattedYesterday = formatDateSys(yesterday);
      return formatDate(entry.date) === formattedYesterday;
    } else if (filterOption === 'last_week') {
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);
      const formattedLastWeek = formatDateSys(lastWeek);
      return (
        new Date(entry.date.seconds * 1000) >= new Date(formattedLastWeek)
      );
    } else if (filterOption === 'last_month') {
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      const formattedLastMonth = formatDateSys(lastMonth);
      return (
        new Date(entry.date.seconds * 1000) >= new Date(formattedLastMonth)
      );
    } else if (filterOption === 'last_three_month') {
      const lastThreeMonth = new Date();
      lastThreeMonth.setMonth(lastThreeMonth.getMonth() - 3);
      const formattedLastThreeMonth = formatDateSys(lastThreeMonth);
      return (
        new Date(entry.date.seconds * 1000) >= new Date(formattedLastThreeMonth)
      );
    } else if (filterOption === 'last_six_month') {
      const lastSixMonth = new Date();
      lastSixMonth.setMonth(lastSixMonth.getMonth() - 6);
      const formattedLastSixMonth = formatDateSys(lastSixMonth);
      return (
        new Date(entry.date.seconds * 1000) >= new Date(formattedLastSixMonth)
      );
    }
  });

  const sortedHistory = [...filteredHistory].sort(
    (a, b) => new Date(a.formattedDate) - new Date(b.formattedDate)
  );
  const reversedHistory = [...sortedHistory].reverse();

  

  const handleFilterChange = (e) => {
    setFilterOption(e.target.value);
  };
  // Step 1: Create a state to keep track of the messages
  const [messages, setMessages] = useState([]);

  // Step 2: Fetch and set the messages from the database when the component mounts
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const patientRef = doc(db, 'users', patient.id);
        const patientSnapshot = await getDoc(patientRef);
        const patientData = patientSnapshot.data();
        
        if (patientData && patientData.messages) {
          setMessages(patientData.messages);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [patient.id]);
  
  
  const sendMsg = async () => {
    const patientRef = doc(db, 'users', patient.id);
    if (msg !== '') {
      await updateDoc(patientRef, {
        messages: arrayUnion({
          date: new Date(),
          doctor: doctor.id,
          doctorName: doctor.data.name,
          message: msg,
          read: false,
        }),
      });
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          date: {
            nanoseconds: new Date().getMilliseconds() * 1000000,
            seconds: Math.floor(new Date().getTime() / 1000),
          },
          doctor: doctor.id,
          doctorName: doctor.data.name,
          message: msg,
          read: false,
        },
      ]);
      
    }
    setMsg('');
    alert('Message sent successfully');
    
  };
  
  const updateHistory = async () => {
    try {
      // Create a copy of the patient's history list
      const updatedHistory = patient.data.history.map((entry) => ({
        ...entry,
        new: false, // Set 'new' to false for all entries
      }));

      // Update the patient's history in the database
      const patientRef = doc(db, 'users', patient.id);
      await updateDoc(patientRef, { history: updatedHistory });

      // Update the local state with the updated history
      setHistory(updatedHistory);
    } catch (error) {
      console.error('Error updating history:', error);
    }
  };

  useEffect(() => {
    // Call the updateHistory function when the component is rendered
    const updatePatientHistory = async () => {
      await updateHistory();
    };
    updatePatientHistory();
  }, []);

  const goGraphic = () => {
    navigate('/doctorspace/patient/graphic' , { state: { doctor, patient }})
  }
  
  return (
    <div className='DoctorList'>
      <div className='left'>
        <Navbar doctor={doctor} />
      </div>
      <div className='right'>
        <Header doctor={doctor} />
        <div className='Profile'>
          <div className='left-profile'>
            <div className='header-profile'>
              <div style={{ textAlign: 'center', padding: '1rem' }}>
                <img src={myLogo} alt='' />
                <h4>{patient.data.name}</h4>
                <div>
                  <button
                    onClick={() => setHistory(true)}
                    style={{ backgroundColor: history ? '#057be9' : 'transparent' ,
                             color: history ? 'white' : '#057be9' }}
                  >
                    History
                  </button>
                  <button
                    onClick={() => setHistory(false)}
                    style={{ backgroundColor: history ? 'transparent' : '#057be9' ,
                              color: history ? '#057be9' : 'white'}}
                  >
                    Message
                  </button>
                </div>

              </div>
            </div>
            {history ? (
              <React.Fragment>
                <div className='filter-options' style={{width:'100%'}}>
                  <select style={{width:'95%'}} value={filterOption} onChange={handleFilterChange}>
                    <option value='all'>All</option>
                    <option value='hypoglycemie'>Hypoglycemie</option>
                    <option value='normal'>Normal</option>
                    <option value='pre_diabete'>Pre-diabete</option>
                    <option value='hyperglycemie'>Hyperglycemie</option>
                    <option value='today'>Today</option>
                    <option value='last_day'>Last Day</option>
                    <option value='last_week'>Last Week</option>
                    <option value='last_month'>Last Month</option>
                    <option value='last_three_month'>Last 3 Months</option>
                    <option value='last_six_month'>Last 6 Months</option>
                  </select>
                </div>
                <div className='History'>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-around',
                      alignItems: 'center',
                      backgroundColor: 'white',
                      width: '100%',
                      padding: '0.5rem',
                    }}
                  >
                    <label>Date :</label>
                    <label>Time :</label>
                    <label>Value :</label>
                  </div>
                  {filteredHistory.length > 0 ? (
                    reversedHistory.map((entry, index) => {
                      if (entry.value !== '') {
                        let bgColor = '';
                        if (parseFloat(entry.value) < normalMin) {
                          bgColor = 'yellow-bg';
                        } else if (
                          parseFloat(entry.value) >= normalMin &&
                          parseFloat(entry.value) <= normalMax
                        ) {
                          bgColor = 'green-bg';
                        } else if (
                          parseFloat(entry.value) > normalMax &&
                          parseFloat(entry.value) <= preDiabeteMax
                        ) {
                          bgColor = 'orange-bg';
                        } else if (parseFloat(entry.value) > preDiabeteMax) {
                          bgColor = 'red-bg';
                        }
                        return (
                          <div key={index} className={bgColor}>
                            <p>{formatDate(entry.date)}</p>
                            <p>{format_time(entry.date)}</p>
                            <p>{entry.value}</p>
                          </div>
                        );
                      } else {
                        return null;
                      }
                    })
                  ) : (
                    <p>No history available.</p>
                  )}
                </div>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <div className='Messages'>
                  {patient.data &&
                  messages &&
                  messages.length > 0 ? (
                    messages.map((entry, key) => {
                      if(entry.doctor == doctor.id)
                      {
                        return (
                          <div key={key} className='msg'>
                            <div className='msg-date'>
                              {format_total_Date(entry.date)}
                              {entry.read ? 
                                (
                                  <>
                                    <div>
                                      <FontAwesomeIcon icon={faEye} color='green'/>
                                      <br/>
                                      
                                      </div>
                                  </>
                                ) :
                                (
                                  <>
                                    <div>
                                      <FontAwesomeIcon icon={faEyeSlash} color='orangered'/>
                                    </div>
                                      
                                  </>
                                )}
                            </div>
                            <div className='msg-content'>
                                {entry.message}
                                
                            </div>
                          </div> 
                        );
                      }
                    })
                  ) : (
                    <p>No messages sent before</p>
                  )}
                </div> 
                <div className='send-msg'>
                  <input
                    type='text'
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                  />
                  <button onClick={sendMsg}>Send</button>
                </div>
              </React.Fragment>
            )}
          </div>
          <div className='right-profile'>
            <div className='info-profile'>
              <div>
                <label>Medical ID</label>
                {patient.data.matricule ? 
                (
                  <p>{patient.data.matricule}</p>
                ) :
                (
                  <p></p>
                )}
              </div>
              <div>
                <label>Email</label>
                <p>{patient.data.email}</p>
              </div>
              <div>
                <label>Address</label>
                <p>{patient.data.address}</p>
              </div>
              <div>
                <label>Phone</label>
                <p>{patient.data.phone}</p>
              </div>
              <div>
                <label>Service</label> 
                <p>{patient.data.service}</p>
              </div>
              <div>
                <label>Birth</label>
                <p>{formatDate(patient.data.birth)}</p>
              </div>
              <div>
                <label>Gender</label>
                <p>{patient.data.gender}</p>
              </div>
              <div>
                <label>Nationality</label>
                <p>{patient.data.nationality}</p>
              </div>
              <div>
                <label>Height</label>
                <p>{patient.data.height} cm</p>
              </div>
              <div>
                <label>Weight</label>
                <p>{patient.data.weight} kg</p>
              </div>
              <div>
                {patient.data.device &&
                patient.data.device.id &&
                patient.data.device.name ? (
                  <React.Fragment>
                    <label>Device ID:</label>
                    <p>{patient.data.device.id}</p>
                    <br />
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <label>Device ID:</label>
                    <p>Not yet</p>
                    <br />
                  </React.Fragment>
                )}
              </div>
            </div>
            <div>
              <button className='btn-graphic' onClick={goGraphic}>
                view graphic
                <FontAwesomeIcon icon={faShare} style={{marginLeft:'0.5rem'}} />
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientPro;
