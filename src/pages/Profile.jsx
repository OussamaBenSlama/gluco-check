import React from 'react'
import Navbar from '../components/Navbar'
import Header from '../components/Header'
import DoctorProfile from '../components/DoctorProfile'
import '../style/DoctorList.css'
const Profile = () => {
  return (
    <div className='DoctorList'>
        <div className='left'>
            <Navbar/>
        </div>
        <div className='right'>
            <Header/>
            <DoctorProfile/>
        </div>
    </div>
  )
}

export default Profile