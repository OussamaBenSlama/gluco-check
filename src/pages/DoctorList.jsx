import React from 'react'
import "../style/DoctorList.css"
import Navbar from '../components/Navbar'
import Header from '../components/Header'
import Doctors from '../components/Doctors'

const DoctorList = () => {
  return (
    <div className='DoctorList'>
        <div className='left'>
            <Navbar/>
        </div>
        <div className='right'>
            <Header/>
            <Doctors/>
        </div>
    </div>
  )
}

export default DoctorList