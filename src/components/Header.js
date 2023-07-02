import React, { useState } from 'react';
import '../style/Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSearch, faBars } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const [inputValue, setInputValue] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (inputValue !== '') {
      navigate(`/dashboard/searchdoctor/${inputValue}`);
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  return (
    <div className="Header">
      <div className="head" >
        <FontAwesomeIcon icon={faBars} cursor="pointer" color="white" style={{ marginRight: '1rem', fontSize: '1.5rem' }} />
      </div>
      <div className="head-operation" >
        <Link to="/dashboard/addnewdoctor">
          <button>
            <FontAwesomeIcon icon={faPlus} cursor="pointer" color="white" style={{ marginRight: '1rem' }} />
            Add New
          </button>
        </Link>
        <div style={{ display: 'flex' }}>
          <input type="text" placeholder="search by full name" onChange={handleInputChange} />
          <div onClick={handleSearch} style={{ padding: '0.5rem', backgroundColor: 'grey', cursor: 'pointer' }}>
            <FontAwesomeIcon icon={faSearch} size="1x" cursor="pointer" color="rgba(0, 0, 0, 0.7)" />
          </div>
        </div>
        <div>
          <label>filter :</label>
          <select>
            <option value="name">name</option>
            <option value="adresse">adresse</option>
            <option value="age">age</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default Header;
