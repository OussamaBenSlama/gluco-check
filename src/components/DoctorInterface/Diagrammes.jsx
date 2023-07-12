import React from 'react'
import {useLocation } from 'react-router-dom';
// import { Doughnut } from 'react-chartjs-2';
import Navbar from './Navbar';
import Header from './Header';
import '../../style/DoctorList.css'
import '../../style/DoctorInterfaceStyle/Diagrammes.css'
const Diagrammes = () => {
    const location = useLocation();
    const { doctor } = location.state;
    // const data = {
    //     labels: ['Label 1', 'Label 2', 'Label 3'],
    //     datasets: [
    //       {
    //         data: [30, 50, 20],
    //         backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
    //         hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
    //       },
    //     ],
    //   };
      
  return (
    <div className='DoctorList'>
        <div className='left'>
            <Navbar doctor={doctor}/>
        </div>
        <div className='right'>
             <Header/>
             <div className='stats'>
                <div className='stats-card'>
                    <p>Statistics : </p>
                    <h5>number of patients affected</h5>
                </div>
                <div className='stats-card'>
                    <p>Statistics :</p>
                    <h5>number of unaffected patients</h5>
                </div>
                <div className='stats-card'>
                    <p>Statistics :</p>
                    <h5>number of patients with device</h5>
                </div>
                <div className='stats-card'>
                    <p>Statistics :</p>
                    <h5>number of patients without a device</h5>
                </div>
             </div>
             {/* <Doughnut data={data} />; */}
        </div>

    </div>
  )
}

export default Diagrammes