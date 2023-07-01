import React , {useState} from 'react'
import '../style/Header.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faUser } from '@fortawesome/free-solid-svg-icons';
// import { faBars } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const Header = () => {

    // for the search : i will pass the input text to another component
    const [inputValue, setInputValue] = useState('');

    const handlesearch = () => {
        if (inputValue !== '') {
        // Call another component with the inputValue as a parameter
        // <AnotherComponent text={inputValue} />
        }
    };
    const handleInputChange = (e) => {
        setInputValue(e.target.value);
      };
  return (
    <div className='Header'>
        {/* <div className='head'>
            <FontAwesomeIcon icon={faBars} size='2x' cursor='pointer' color='rgba(0, 0, 0, 0.7)'/>
            <FontAwesomeIcon icon={faUser} size='2x' cursor='pointer' color='rgba(0, 0, 0, 0.7)'/>
        </div> */}
        <div className='head-operation'>
        <Link to="/dashboard/addnewdoctor">
            <button>
                <FontAwesomeIcon icon={faPlus} cursor='pointer' color='white' style={{ marginRight: '1rem' }} />
                Add New
            </button>
        </Link>
            <div style={{display: 'flex'}}>
                <input type="text" placeholder='search last name' onChange={handleInputChange}/>
                <div onClick={handlesearch} style={{padding:'0.5rem' , backgroundColor:'grey' , cursor:'pointer'}}><FontAwesomeIcon icon={faSearch} size='1x' cursor='pointer' color='rgba(0, 0, 0, 0.7)'/></div>
            </div>
            <div>
                <label>filter :</label>
                <select>
                    <option value="name" key="">name</option>
                    <option value="adresse" key="">adresse</option>
                    <option value="age" key="">age</option>
                </select>
            </div>

        </div>
    </div>
  )
}

export default Header