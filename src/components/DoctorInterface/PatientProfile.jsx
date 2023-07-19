import React, { useState, useEffect } from 'react';
import "../../style/DoctorList.css";
import '../../style/Profile.css';
import Navbar from './Navbar';
import Header from './Header';
import { useLocation } from 'react-router-dom';
import myLogo from '../../images/pat.png';
import { Chart, ScatterController, LinearScale, PointElement } from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const PatientPro = () => {
  const location = useLocation();
  const { doctor, patient } = location.state;
  const [history, setHistory] = useState(true);
  const [msg, setMsg] = useState('');
  const [filterOption, setFilterOption] = useState('all');
  

  Chart.register(ScatterController, LinearScale, PointElement);
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

  const [selectedDate, setSelectedDate] = useState(formatDateSys(new Date()));

  const generateData = () => {
    
      if (selectedOption === 'specificDay') {
        // Generate data for the specific selected date
        const filteredHistory = patient.data.history.filter(
          (entry) => formatDate(entry.date) === selectedDate
        );
        if (filteredHistory.length > 0) {
          let index = 1;
          const data = filteredHistory.map((entry) => {
            const yValue = parseFloat(entry.value);
            return {
              x: index++,
              y: yValue || 0,
            };
          });
          return data;
        } else {
          return [];
        }
      } else if (selectedOption === 'lastWeek') {
        // Generate data for the last week
        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);
        const formattedLastWeek = formatDateSys(lastWeek);
        const filteredHistory = patient.data.history.filter(
          (entry) => new Date(entry.date.seconds * 1000) >= new Date(formattedLastWeek)
        );
        if (filteredHistory.length > 0) {
          // Calculate the average value for the last week
          const sum = filteredHistory.reduce((total, entry) => {
            const value = parseFloat(entry.value);
            return total + (isNaN(value) ? 0 : value);
          }, 0);
          const average = sum / filteredHistory.length;
  
          return [
            {
              x: 3,
              y: average || 0,
            },
          ];
        } else {
          return [];
        }
      } else if (selectedOption === 'lastMonth') {
        // Generate data for the last month
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        const formattedLastMonth = formatDateSys(lastMonth);
        const filteredHistory = patient.data.history.filter(
          (entry) => new Date(entry.date.seconds * 1000) >= new Date(formattedLastMonth)
        );
        if (filteredHistory.length > 0) {
          // Calculate the average value for the last month
          const sum = filteredHistory.reduce((total, entry) => {
            const value = parseFloat(entry.value);
            return total + (isNaN(value) ? 0 : value);
          }, 0);
          const average = sum / filteredHistory.length;
          return [
            {
              x: 3,
              y: average || 0,
            },
          ];
        } else {
          return [];
        }
      } else if (selectedOption === 'lastThreeMonths') {
        // Generate data for the last three months
        const lastThreeMonths = new Date();
        lastThreeMonths.setMonth(lastThreeMonths.getMonth() - 3);
        const formattedLastThreeMonths = formatDateSys(lastThreeMonths);
        const filteredHistory = patient.data.history.filter(
          (entry) => new Date(entry.date.seconds * 1000) >= new Date(formattedLastThreeMonths)
        );
        if (filteredHistory.length > 0) {
          // Calculate the average value for the last three months
          const sum = filteredHistory.reduce((total, entry) => {
            const value = parseFloat(entry.value);
            return total + (isNaN(value) ? 0 : value);
          }, 0);
          const average = sum / filteredHistory.length;
  
          return [
            {
              x: 3,
              y: average || 0,
            },
          ];
        } else {
          return [];
        }
      }
    
    return [];
  };
  

  const formattedHistory = patient.data.history.map((entry) => {
    return {
      ...entry,
      formattedDate: formatDate(entry.date),
    };
  });

  const filteredHistory = formattedHistory.filter((entry) => {
    if (filterOption === 'all') {
      return true;
    } else if (filterOption === 'hypoglycemie') {
      return parseFloat(entry.value) < 0.7;
    } else if (filterOption === 'normal') {
      return parseFloat(entry.value) >= 0.7 && parseFloat(entry.value) <= 1.10;
    } else if (filterOption === 'pre_diabete') {
      return parseFloat(entry.value) > 1.10 && parseFloat(entry.value) <= 1.25;
    } else if (filterOption === 'hyperglycemie') {
      return parseFloat(entry.value) > 1.25;
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

  const data = {
    datasets: [
      {
        label: 'Scatter Plot',
        data: generateData(),
        backgroundColor: (context) => {
          if (
            context.dataset.data &&
            context.dataset.data[context.dataIndex]
          ) {
            const value = context.dataset.data[context.dataIndex].y;
            if (value < 0.7) {
              return 'yellow';
            } else if (value >= 0.7 && value <= 1.10) {
              return 'green';
            } else if (value > 1.10 && value <= 1.25) {
              return '#FF6D60';
            } else if (value > 1.25) {
              return 'red';
            }
          }
          return 'rgba(75, 192, 192, 0.8)';
        },
        borderColor: (context) => {
          if (
            context.dataset.data &&
            context.dataset.data[context.dataIndex]
          ) {
            const value = context.dataset.data[context.dataIndex].y;
            if (value < 0.7) {
              return 'yellow';
            } else if (value >= 0.7 && value <= 1.10) {
              return 'green';
            } else if (value > 1.10 && value <= 1.25) {
              return '#FF6D60';
            } else if (value > 1.25) {
              return 'red';
            }
          }
          return 'rgba(75, 192, 192, 1)';
        },
        pointRadius: 6,
        pointHoverRadius : 3,
      },
    ],
  };
  
  const options = {
    responsive: true,
    scales: {
      x: {
        type: 'linear',
        title: {
          display: true,
          text: 'X-axis',
        },
        min: 0,
        max: 7, // Adjust the max value based on the filter option
        ticks: {
          stepSize: 1,
        },
      },
      y: {
        type: 'linear',
        title: {
          display: true,
          text: 'Y-axis',
        },
        min: 0,
        max: 2, // Adjust the max value based on the filter option
        ticks: {
          stepSize: 0.1,
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const dataset = context.dataset;
            const index = context.dataIndex;
            const point = dataset.data[index];
            return `x: ${point.x}, y: ${point.y}`;
          },
        },
      },
      hover: {
        mode: 'nearest',
        intersect: true,
        enable :true
      },
    },
  
    
  };
  
  
  



  
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilterOption(e.target.value);
  };
  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };
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
    }
    setMsg('');
    alert('Message sent successfully');
  };

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
                  <button onClick={() => setHistory(true)}>History</button>
                  <button onClick={() => setHistory(false)}>Message</button>
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
                        if (parseFloat(entry.value) < 0.7) {
                          bgColor = 'yellow-bg';
                        } else if (
                          parseFloat(entry.value) >= 0.7 &&
                          parseFloat(entry.value) <= 1.10
                        ) {
                          bgColor = 'green-bg';
                        } else if (
                          parseFloat(entry.value) > 1.10 &&
                          parseFloat(entry.value) <= 1.25
                        ) {
                          bgColor = 'orange-bg';
                        } else if (parseFloat(entry.value) > 1.25) {
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
                  patient.data.messages &&
                  patient.data.messages.length > 0 ? (
                    patient.data.messages.map((entry, key) => {
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
                <p>{patient.data.height}</p>
              </div>
              <div>
                <label>Weight</label>
                <p>{patient.data.weight}</p>
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
            <div style={{width:'100%', marginBottom:'0.5rem'}}>
              <select style={{width:'100%'}} value={selectedOption} onChange={handleOptionChange}>
                <option value="specificDay">Specific Day</option>
                <option value="lastWeek">Last Week</option>
                <option value="lastMonth">Last Month</option>
                <option value="lastThreeMonths">Last Three Months</option>
              </select>
            </div>

            <div className='diagramme'>
              {selectedOption === "specificDay" ? 
              (
                <div style={{ textAlign: 'right', padding: '1rem' }}>
                <input
                  type='date'
                  value={selectedDate}
                  onChange={handleDateChange}
                  style={{
                    padding: '0.5rem',
                    width: '30%',
                    border: '1px solid white',
                    borderRadius: '1rem',
                  }}
                />
              </div>
              ) :
              (
                null
              )}
              <div className='scatter' style={{ backgroundColor: 'white', padding: '1rem' }}>
                <Scatter data={data} options={options} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientPro;
