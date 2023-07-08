import React from 'react'
import "../style/DoctorList.css"
import Navbar from '../components/Navbar'
import HeaderPatient from '../components/HeaderPatient'
import AddPatient from '../components/AddPatient'
const NewPatient = () => {
  return (
    <div className='DoctorList'>
        <div className='left'>
            <Navbar/>
        </div>
        <div className='right'>
            <HeaderPatient/>
            <AddPatient/>
        </div>
    </div>
  )
}

export default NewPatient ;