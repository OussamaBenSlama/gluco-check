import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faEnvelope } from '@fortawesome/free-solid-svg-icons';

const Header = () => {
  return (
    <div className='Header'>
        <div className='head' style={{backgroundColor:'rgb(245, 245, 245)' , justifyContent:'start' }}>
        <FontAwesomeIcon icon={faBell} style={{marginRight: '1rem'}}/>
        <FontAwesomeIcon icon={faEnvelope} />
        </div>
        {/* icon notif + message  */ }
        
    </div>
  )
}

export default Header