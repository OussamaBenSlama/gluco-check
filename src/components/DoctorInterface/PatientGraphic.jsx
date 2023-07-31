import React, { useState ,useEffect } from 'react';
import Header from './Header';
import Navbar from './Navbar';
import '../../style/DoctorList.css';
import { useLocation } from 'react-router-dom';
import { Chart, ScatterController, LinearScale, PointElement } from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import {collection,getDocs} from 'firebase/firestore';
import { db } from '../../config/firebase';

const PatientGraphic = () => {
    const location = useLocation();
    const { doctor, patient } = location.state;
  Chart.register(ScatterController, LinearScale, PointElement);
  const [selectedOption, setSelectedOption] = useState('specificDay');
  
  // diabete range configuration :
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
  

  const formatDate = (dateTime) => {
    const totalMilliseconds = dateTime.seconds * 1000 + dateTime.nanoseconds / 1000000;
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
  const [selectedDate, setSelectedDate] = useState(formatDateSys(new Date()));
  const [maxY , setMaxY] = useState(1.5) ;
  const generateData = () => {
    if (selectedOption === 'specificDay') {
        // Generate data for the specific selected date
        const filteredHistory = patient.data.history.filter((entry) => formatDate(entry.date) === selectedDate);
        if (filteredHistory.length > 0) {
            
          let index = 1;
          const data = filteredHistory.map((entry) => {
            const yValue = parseFloat(entry.value);
            if(yValue > maxY){setMaxY(yValue)}
            return {
              x: index++,
              y: yValue || 0,
            };
          });
          return data;
        } else {
          return [];
        }
    } else {
      // Generate data for the selected date range (lastWeek, lastMonth, lastThreeMonths)
      const currentDate = new Date();
      const filteredHistory = patient.data.history.filter((entry) => {
        const entryDate = new Date(entry.date.seconds * 1000);
        if (selectedOption === 'lastWeek') {
          const daysDifference = Math.floor((currentDate - entryDate) / (1000 * 60 * 60 * 24));
          return daysDifference >= 0 && daysDifference <= 6;
        } else if (selectedOption === 'lastMonth') {
          const daysDifference = Math.floor((currentDate - entryDate) / (1000 * 60 * 60 * 24));
          return daysDifference >= 0 && daysDifference <= 30;
        } else if (selectedOption === 'lastThreeMonths') {
          const daysDifference = Math.floor((currentDate - entryDate) / (1000 * 60 * 60 * 24));
          return daysDifference >= 0 && daysDifference <= 89;
        }
        return false;
      });

      if (filteredHistory.length > 0) {
        // Generate the data for the scatter plot
        const data = filteredHistory.map((entry, index) => {
          const entryDate = new Date(entry.date.seconds * 1000);
          const xValue = calculateXValue(selectedOption, currentDate, entryDate);
          const yValue = parseFloat(entry.value) || 0;
          if(yValue > maxY){setMaxY(yValue)}
          return {
            x: xValue,
            y: yValue,
          };
        });
        return data;
      }
    }

    return [];
  };

  const calculateXValue = (selectedOption, currentDate, entryDate) => {
    if (selectedOption === 'lastWeek') {
      const daysDifference = Math.floor((currentDate - entryDate) / (1000 * 60 * 60 * 24));
      return 7 - daysDifference;
    } 
    else if (selectedOption === 'specificDay') {
        const filteredHistory = patient.data.history.filter((entry) => formatDate(entry.date) === selectedDate);
        return filteredHistory.length; 
    }
    else if (selectedOption === 'lastMonth') {
      const daysDifference = Math.floor((currentDate - entryDate) / (1000 * 60 * 60 * 24));
      return 30 - daysDifference;
    } else if (selectedOption === 'lastThreeMonths') {
      const daysDifference = Math.floor((currentDate - entryDate) / (1000 * 60 * 60 * 24));
      return 90 - daysDifference;
    }
    return 0;
  };

  const calculateXMaxValue = (selectedOption) => {
    if (selectedOption === 'lastWeek') {
      return 7;
    }
    else if (selectedOption === 'specificDay') {
        const filteredHistory = patient.data.history.filter((entry) => formatDate(entry.date) === selectedDate);
        
        return filteredHistory.length +2; // X-axis max value is based on the number of data points for specificDay
    } else if (selectedOption === 'lastMonth') {
      return 30;
    } else if (selectedOption === 'lastThreeMonths') {
      return 90;
    }
    return 0;
  };

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const data = {
    datasets: [
      {
        label: 'glucose chart',
        data: generateData(),
        backgroundColor: (context) => {
          if (context.dataset.data && context.dataset.data[context.dataIndex]) {
            const value = context.dataset.data[context.dataIndex].y;
            if (value < normalMin) {
              return 'yellow';
            } else if (value >= normalMin && value <= normalMax) {
              return 'green';
            } else if (value > normalMax && value <= preDiabeteMax) {
              return '#FF6D60';
            } else if (value > preDiabeteMax) {
              return 'red';
            }
          }
          return 'rgba(75, 192, 192, 0.8)';
        },
        borderColor: (context) => {
          if (context.dataset.data && context.dataset.data[context.dataIndex]) {
            const value = context.dataset.data[context.dataIndex].y;
            if (value < normalMin) {
              return 'yellow';
            } else if (value >= normalMin && value <= normalMax) {
              return 'green';
            } else if (value > normalMax && value <= preDiabeteMax) {
              return '#FF6D60';
            } else if (value > preDiabeteMax) {
              return 'red';
            }
          }
          return 'rgba(75, 192, 192, 1)';
        },
        pointRadius: 6,
        pointHoverRadius: 3,
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
          text: 'Days',
        },
        min: 0,
        max: calculateXMaxValue(selectedOption), 
        ticks: {
          stepSize: 1,
        },
      },
      y: {
        type: 'linear',
        title: {
          display: true,
          text: 'Glucose',
        },
        min: 0,
        max: maxY + 0.2, // Adjust the max value based on the filter option
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
        enable: true,
      },
    },
  };

  return (
    <div className='DoctorList'>
      <div className='left'>
        <Navbar doctor={doctor}/>
      </div>
      <div className='right'>
        <Header doctor={doctor}/>
        <div style={{width:'90%'}} >
            <div style={{ width: '30%', margin: '1rem' , textAlign:'right'}}>
            <select style={{ width: '100%' }} value={selectedOption} onChange={handleOptionChange}>
                <option value='specificDay'>Specific Day</option>
                <option value='lastWeek'>Last Week</option>
                <option value='lastMonth'>Last Month</option>
                <option value='lastThreeMonths'>Last Three Months</option>
            </select>
            </div>

            <div className='diagramme' style={{width:'100%'}}>
            {selectedOption === 'specificDay' ? (
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
            ) : null}
            <div className='scatter' style={{ backgroundColor: 'white', padding: '1rem', width:'100%' }}>
                <Scatter data={data} options={options} />
            </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PatientGraphic;
