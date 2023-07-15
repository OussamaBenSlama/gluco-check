import React, {useState , useEffect} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faEnvelope , faBars } from '@fortawesome/free-solid-svg-icons';
import NavbarSlider from './NavbarSlider'
const Header = ({doctor}) => {
  const [showButton, setShowButton] = useState(false);
  const [navState , setNavState] = useState(false)
  const trackWindowWidth = () => {
    if (window.innerWidth <= 800) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  };

  window.addEventListener("resize", trackWindowWidth);
  useEffect(() => {
    if (window.innerWidth <= 900) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  }, []);
  return (
    <div className='Header'>
        <div className='head' style={{backgroundColor:'rgb(245, 245, 245)' , justifyContent:'space-between' }}>
            {showButton ? (
              <button style={{zIndex : '16'}}
                onClick={() => {
                  setNavState(!navState);
                  
                }}
              >
                <FontAwesomeIcon
                  icon={faBars}
                  cursor="pointer"
                  color="white"
                  className="Bars"
                />
              </button>
            ) : (
              null
            )}
            { navState && showButton ? (
              <React.Fragment>
                <div className="show-nav">
                  <NavbarSlider doctor = {doctor}/>
                </div>
              </React.Fragment>
            ) : 
            (
              null 
            )}
        <div>
          <FontAwesomeIcon icon={faBell} style={{marginRight: '1rem'}}/>
          <FontAwesomeIcon icon={faEnvelope} />
        </div>
        </div>
        {/* icon notif + message  */ }
        
    </div>
  )
}

export default Header