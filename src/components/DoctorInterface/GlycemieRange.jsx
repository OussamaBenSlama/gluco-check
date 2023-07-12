import React, { useState } from 'react'
import '../../style/DoctorInterfaceStyle/GlycemieRange.css'
import '../../style/DoctorList.css'
import {useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Header from './Header';
const GlycemieRange = () => {
    const location = useLocation();
    const { doctor } = location.state;
    const [minNormal, setMinNormal]  = useState(0)
    const [maxNormal, setMaxNormal]  = useState(0)
    const [minHyper, setMinHyper]  = useState(0)
    
    const [yellow, setyellow]  = useState(false)
    const [green, setgreen]  = useState(false)
    const [orange, setorange]  = useState(false)

    console.log(minNormal,maxNormal,minHyper)
    console.log(yellow,green,orange)
  return (
    <div className='DoctorList'>
        <div className='left'>
            <Navbar doctor={doctor}/>
        </div>
        <div className='right' >
            <Header/>
            {/* inputs to specify the range */}
            <div className='Inputs-range'>
                <div>
                    <label>Min-normal :</label>
                    <input type="number" 
                    onChange={(e)=> {
                        setMinNormal(e.target.value) ;
                        setyellow(true)
                    }}
                    />
                </div>
                <div>
                    <label>Max-normal :</label>
                    <input type="number" 
                    onChange={(e)=> {
                        setMaxNormal(e.target.value) ;
                        setgreen(true) ;
                    }}
                    />
                </div>
                <div>
                    <label>Min-hyperGlycemie :</label>
                    <input type="number" 
                    onChange={(e)=> {
                        setMinHyper(e.target.value) ;
                        setorange(true)
                    }}
                    />
                </div>
                {/* divs to show the range */}
                <div className='show-range'>
                <div className='list-range'>
                            <div className='flesh-left'></div>
                        {yellow ? (
                            <React.Fragment>
                                <div className='hypoglycemie'></div>
                            </React.Fragment>
                            ) : (
                            <React.Fragment>
                                <div className=''></div>
                            </React.Fragment>
                        )}
                        {green ? (
                            <React.Fragment>
                                <div className='normal'></div>
                            </React.Fragment>
                            ) : (
                            <React.Fragment>
                                <div className=''></div>
                            </React.Fragment>
                        )}
                        {orange ? (
                            <React.Fragment>
                                <div className='pre-diabete'></div>
                                <div className='hyperglycemie'></div>
                            </React.Fragment>
                            ) : (
                            <React.Fragment>
                                <div className=''></div>
                                <div className=''></div>
                            </React.Fragment>
                        )}
                            
                            <div className='flesh-right'></div>
                            
                        </div>
                </div>
                </div>
                <div style={{display:'flex', justifyContent:'center', alignItems:'center', position:'relative'}}>
                    <div className='label-range'>
                        <label>0</label>
                        {yellow ? (
                            <React.Fragment>
                                <label>{minNormal}</label>
                            </React.Fragment>
                            ) : (
                            <React.Fragment>
                                <label></label>
                            </React.Fragment>
                        )}
                        {green ? (
                            <React.Fragment>
                                <label>{maxNormal}</label>
                            </React.Fragment>
                            ) : (
                            <React.Fragment>
                                <label></label>
                            </React.Fragment>
                        )}
                        {orange ? (
                            <React.Fragment>
                                <label>{minHyper}</label>
                            </React.Fragment>
                            ) : (
                            <React.Fragment>
                                <label></label>
                            </React.Fragment>
                        )}
                        <label>5</label>
                    </div>
                </div>
                {/* <div className='show-range'>
                    <div>
                        
                        
                    </div>
                </div> */}
        

        </div>
        
    </div>
  )
}

export default GlycemieRange