import React from 'react'
import "../style/DoctorList.css"
import Navbar from '../components/Navbar'
import Header from '../components/Header'
import AddDoctor from '../components/AddDoctor'
const NewDoctor = () => {
  return (
    <div className='DoctorList'>
        <div className='left'>
            <Navbar/>
        </div>
        <div className='right'>
            <Header/>
            <AddDoctor/>
        </div>
    </div>
  )
}

export default NewDoctor