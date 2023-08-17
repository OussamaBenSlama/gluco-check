import React, { useState , useEffect} from 'react'
import '../../style/DoctorInterfaceStyle/GlycemieRange.css'
import '../../style/DoctorList.css'
import {useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Header from './Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfinity } from '@fortawesome/free-solid-svg-icons';
import { doc, getDocs , collection, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

const GlycemieRange = () => {
    const location = useLocation();
    const { doctor } = location.state;
    const [minNormal, setMinNormal]  = useState(0)
    const [maxNormal, setMaxNormal]  = useState(0)
    const [minHyper, setMinHyper]  = useState(0)
    
    const [yellow, setyellow]  = useState(true)
    const [green, setgreen]  = useState(true)
    const [orange, setorange]  = useState(true)
    const [range, setRange]  = useState({})

    // Function to fetch the diabeteRange document
    const fetchDiabeteRange = async () => {
    const querySnapshot = await getDocs(collection(db, 'diabeteRange'));
    
    if (!querySnapshot.empty) {
        const docRef = querySnapshot.docs[0].ref;
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            const rangeData = docSnap.data();
            setRange({ id: docSnap.id, data: rangeData });
            setMinNormal(rangeData.normal.min);
            setMaxNormal(rangeData.normal.max);
            setMinHyper(rangeData.prediabete.max);
        // Use the diabeteRangeData object as needed
        } else {
         console.log("range doesn't exist")
        }
    } else {
        console.log("collection doesn't exist")
    }
    };

    
    useEffect(() => {
    fetchDiabeteRange();
    }, []);

    const handleUpdate = async () => {
        const glycemieRef = doc(db, "diabeteRange", range.id);
        await updateDoc(glycemieRef, {
          diabete: {
            min: parseFloat(parseFloat(minHyper) + 0.01),
          },
          normal: {
            max: parseFloat(maxNormal),
            min: parseFloat(minNormal),
          },
          prediabete: {
            max: parseFloat(minHyper),
            min: parseFloat(parseFloat(maxNormal) + 0.01),
          },
        });
        alert("Update successful");
      };
      
  return (
    <div className='DoctorList'>
        <div className='left'>
            <Navbar doctor={doctor}/>
        </div>
        <div className='right' >
            <Header doctor = {doctor}/>
            <div className='Inputs-range'>
                <div style={{width:'100%', textAlign:'center'}}>
                        <div>
                            <label>Min :</label><br />
                            <input type="number" value={minNormal}
                            onChange={(e)=> {
                                setMinNormal(e.target.value) ;
                                
                            }}
                            />
                        </div>
                        <div>
                            <label>Moyenne :</label> <br />
                            <input type="number" value={maxNormal}
                            onChange={(e)=> {
                                setMaxNormal(e.target.value) ;
                                
                            }}
                            />
                        </div>
                        <div>
                            <label>Max :</label><br />
                            <input type="number" value={minHyper}
                            onChange={(e)=> {
                                setMinHyper(e.target.value) ;
                                
                            }}
                            />
                        </div>
                    <button onClick={handleUpdate}>validate</button>
                </div>
            
                {/* divs to show the range */}
                <div className='show-range'>
                    <div className='list-range'>
                                <div className='flesh-left'></div>
                                <div className='hypoglycemie'>hypoglycemie</div>
                                <div className='normal'>normal</div>
                                <div className='pre-diabete'>pre diabete</div>
                                <div className='hyperglycemie'>hyperglycemie</div>
                                
                                <div className='flesh-right'></div>
                                
                    </div>
                </div>
            </div>
                <div className='label-list'>
                        <div className='label-range'>
                        
                            {yellow ? (
                                <React.Fragment>
                                    <label>0</label>
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
                                    <label><FontAwesomeIcon icon={faInfinity} /></label>
                                </React.Fragment>
                                ) : (
                                <React.Fragment>
                                    <label></label>
                                    
                                </React.Fragment>
                            )}
                            
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