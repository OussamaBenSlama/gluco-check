import React, { useState } from 'react'
import "../../style/DoctorList.css"
import '../../style/DoctorInterfaceStyle/PatientProfile.css'
import Navbar from './Navbar'
import Header from './Header'
import { useLocation} from 'react-router-dom';
import myLogo from '../../images/pat.png';
import { Chart, ScatterController, LinearScale, PointElement } from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import { doc, updateDoc, arrayUnion} from 'firebase/firestore';
import { db } from '../../config/firebase';
const PatientPro = () => {
    const location = useLocation();
    const { doctor , patient} = location.state;
    const [history , setHistory] = useState(true)
    const [msg, setMsg] = useState('')
    Chart.register(ScatterController, LinearScale, PointElement);
    const FormatterDate = (dateTime) => {
        const totalMilliseconds =
        dateTime.seconds * 1000 + dateTime.nanoseconds / 1000000;
        const date2 = new Date(totalMilliseconds);
        const month = String(date2.getMonth() + 1).padStart(2, "0");
        const day = String(date2.getDate()).padStart(2, "0");
        const year = String(date2.getFullYear());
    
        return `${year}-${month}-${day}`;
      };
      const FormatterDateSys = (dateTime) => {
        const date = new Date(dateTime);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
      
        return `${year}-${month}-${day}`;
      };
      // data and options for the scatter 
      const [selectedDate, setSelectedDate] = useState(FormatterDateSys(new Date()));

      // Function to generate data for scatter plot based on selected date
      const generateData = () => {
        if (selectedDate) {
          const filteredHistory = patient.data.history.filter(
            (entry) => FormatterDate(entry.date) === selectedDate
          );
          if (filteredHistory.length > 0) {
            let index = 1;
            const data = filteredHistory.map((entry) => {
              const yValue = parseFloat(entry.value);
              const backgroundColor = yValue < 0.7 ? 'yellow' : 'rgba(75, 192, 192, 0.8)';
              return {
                x: index++,
                y: yValue || 0, // Assign 0 if entry.value is undefined or NaN
                backgroundColor: backgroundColor,
              };
            });
            return data;
          } else {
            return []; // Return empty data if no history for selected date
          }
        }
        return []; // Return empty data if no selected date
      };
      
      
      
    
      const data = {
        datasets: [
          {
            label: 'Scatter Plot',
            data: generateData(),
            backgroundColor: (context) => {
              if (context.dataset.data && context.dataset.data[context.dataIndex]) {
                const value = context.dataset.data[context.dataIndex].y;
                if (value < 0.7) {
                  return 'yellow';
                } else if (value >= 0.7 && value <= 1.10) {
                  return 'green';
                } else if (value > 1.10 && value <= 1.25) {
                  return 'orange';
                } else if (value > 1.25) {
                  return 'red';
                }
              }
              return 'rgba(75, 192, 192, 0.8)';
            },
            borderColor: (context) => {
              if (context.dataset.data && context.dataset.data[context.dataIndex]) {
                const value = context.dataset.data[context.dataIndex].y;
                if (value < 0.7) {
                  return 'yellow';
                } else if (value >= 0.7 && value <= 1.10) {
                  return 'green';
                } else if (value > 1.10 && value <= 1.25) {
                  return 'orange';
                } else if (value > 1.25) {
                  return 'red';
                }
              }
              return 'rgba(75, 192, 192, 1)';
            },
            pointRadius: 6, // Set the size of the points
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
            max: 7,
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
            max: 2,
            ticks: {
              stepSize: 0.2,
            },
          },
        },
      };
    
      const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
      };
    const sendMsg = async () => {
        const patientRef = doc(db , 'users' , patient.id)
        if(msg !== ''){
            await updateDoc ( patientRef , {
                messages : arrayUnion( {
                    date : new Date() ,
                    doctor : doctor.id ,
                    doctorName : doctor.data.name ,
                    message : msg ,
                    read : false ,
                })
            }
            
            )
        }
        sendMsg('')

        alert("message sent successfully")
    }
  return (
    <div className='DoctorList'>
        <div className='left'>
            <Navbar doctor={doctor}/>
        </div>
        <div className='right' >
            <Header doctor = {doctor}/>
            <div className='patient-profile'>
                <div className='left-profile'>
                    <div className='header-profile'>
                        <div style={{textAlign:'center' , padding:'1rem'}}>
                            <img src={myLogo} alt="" />
                            <h4>{patient.data.name}</h4>
                            <div >
                                <button onClick={()=> setHistory(true) }>History</button>
                                <button onClick={()=> setHistory(false) }>Message</button>
                            </div>
                        </div>
                    </div>
                    {history ?(
                        <React.Fragment>
                            <div className='History'>
                                <div style={{display:'flex' , justifyContent:'space-around', alignItems:'center',
                                            backgroundColor:'white', width:'100%', padding:'0.5rem'}}>
                                    <label>Date :</label>
                                    <label>Value</label>
                                </div>
                                {patient.data && patient.data.history && patient.data.history.length > 0 ? (
                                    patient.data.history.map((entry, index) => {
                                    if (entry.value !== '') {
                                        if (parseFloat(entry.value) < 0.7)
                                        {
                                            return (
                                                <div key={index} className='yellow-bg'>
                                                    <p>{FormatterDate(entry.date)}</p>
                                                    <p>{entry.value}</p>
                                                </div>
                                            );
                                        }
                                        else if (parseFloat(entry.value) >= 0.7 && parseFloat(entry.value) <= 1.10)
                                        {
                                            return (
                                                <div key={index} className='green-bg'>
                                                    <p>{FormatterDate(entry.date)}</p>
                                                    <p>{entry.value}</p>
                                                </div>
                                            );
                                        }
                                        else if (parseFloat(entry.value) > 1.10 && parseFloat(entry.value) <= 1.25)
                                        {
                                            return (
                                                <div key={index} className='orange-bg'>
                                                    <p>{FormatterDate(entry.date)}</p>
                                                    <p>{entry.value}</p>
                                                </div>
                                            );
                                        }
                                        else if (parseFloat(entry.value) > 1.25 )
                                        {
                                            return (
                                                <div key={index} className='red-bg'>
                                                    <p>{FormatterDate(entry.date)}</p>
                                                    <p>{entry.value}</p>
                                                </div>
                                            );
                                        }
                                        
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
                            {/* <div className='Messages'>
                                {patient.data && patient.data.messages && patient.data.messages.length > 0 ?
                                (
                                    patient.data.messages.map((entry , key) => {
                                        return (
                                            <div key={key} className='msg'>
                                            {entry.message}
                                            </div>
                                        )
                                    })
                                ) : 
                                (
                                    
                                        <p>No messages sent before</p>
                                    
                                )}
                            </div> */}
                            <div className='send-msg'>
                                <input type="text" value={msg} onChange={(e)=>setMsg(e.target.value)}/>
                                <button onClick={sendMsg}>Sent</button>
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
                            <p>{FormatterDate(patient.data.birth)}</p>
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
                                <p>not yet</p>
                                <br />
                            </React.Fragment>
                            )}
                        </div>
                    </div>
                    <div style={{textAlign:'right', padding:'1rem'}}>
                        <input type="date" value={selectedDate} onChange={handleDateChange}  style={{padding:'0.5rem' , width:'30%' , border:'1px solid white' , borderRadius: '1rem'}}/>
                    </div>
                    <div style={{backgroundColor:'white' , padding:'1rem' }}>
                        <Scatter data={data} options={options} />
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default PatientPro ;