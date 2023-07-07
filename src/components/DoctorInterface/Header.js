import React from 'react'
import myLogo from '../../images/patient.png'
import '../../style/DoctorInterfaceStyle/Header.css'

const Header = () => {
  return (
    <div className='Doctor-header'>
        <div className='Doctor-nav'>
            <img src={myLogo} alt="" />
            <h1>Oussama ben Slama</h1>
            <ul>
                <li>Home</li>
                <li>my Patients</li>
                <li>Add patient</li>
            </ul>
        </div>
    </div>
  )
}

export default Header