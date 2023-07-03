import React from 'react'
import "../style/DoctorList.css"
import Navbar from '../components/Navbar'
import HeaderPatient from '../components/HeaderPatient'
import Patients from '../components/Patients'
const DoctorList = () => {
  return (
    <div className='DoctorList'>
        <div className='left'>
            <Navbar/>
        </div>
        <div className='right'>
            <HeaderPatient/>
            <Patients/>
        </div>
    </div>
  )
}

export default DoctorList