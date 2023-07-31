import React, { useState, useEffect } from 'react';
import {doc, updateDoc ,collection , getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import {useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Header from './Header';
import '../../style/DoctorList.css';


const EditProfile = () => {
    const location = useLocation();
    const { doctor } = location.state;
    

  const [name, setName] = useState("");
  const [speciality, setSpeciality] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [matricule, setMatricule] = useState('');
  const [gender, setGender] = useState("");
  const [birth, setBirth] = useState("");
  const [service, setService] = useState("");
  const [nationality, setNationality] = useState("");
  // to make date clear 
  const FormatterDate = (dateTime) => {
    const totalMilliseconds =
    dateTime.seconds * 1000 + dateTime.nanoseconds / 1000000;
    const date2 = new Date(totalMilliseconds);
    const month = String(date2.getMonth() + 1).padStart(2, "0");
    const day = String(date2.getDate()).padStart(2, "0");
    const year = String(date2.getFullYear());

    return `${year}-${month}-${day}`;
  };
  useEffect(() => {
    if (doctor && doctor.data) {
       

      setName(doctor.data.name || "");
      setSpeciality(doctor.data.speciality || "");
      setAddress(doctor.data.address || "");
      setEmail(doctor.data.email || "");
      setPhone(doctor.data.phone || "");
      setMatricule(doctor.data.matricule || "") ;
      setGender(doctor.data.gender || "");
      setBirth(FormatterDate(doctor.data.birth) || ""); // stringify date
      setNationality(doctor.data.nationality || "");
      setService(doctor.data.service || "") ;
    }
  }, [doctor]);
  const [specialities, setSpecialities] = useState([]);

  useEffect(() => {
    const specialityRef = collection(db, 'specialities');
    const getSpecialities = async () => {
      try {
        const response = await getDocs(specialityRef);
        const data = response.docs.map((doc) => doc.data().name);
        setSpecialities(data);
      } catch (error) {
        console.log(error);
      }
    };
    getSpecialities();
  }, []);
  const [services, setServices] = useState([]);

  useEffect(() => {
    const serviceRef = collection(db, 'services'); 
    const getServices = async () => {
      try {
        const response = await getDocs(serviceRef);
        const data = response.docs.map((doc) => doc.data().name);
        setServices(data);
      } catch (error) {
        console.log(error);
      }
    };
    getServices();
  }, []);

  const handleUpdate = async () => {
    const Doctor = doc(db, "doctors", doctor.id);
    await updateDoc(Doctor, {
      name: name,
      email: email,
      // id: id,
      gender: gender,
      nationality: nationality,
      speciality: speciality,
      birth: new Date(birth), // to save date in firebase correctly
      address: address,
      phone: phone,
      service : service,
    });
    alert("update successfully");
  };
  const nations = [
    'Afghane',
    'Sud-africaine',
    'Albanaise',
    'Algérienne',
    'Allemande',
    'Andorrane',
    'Angolaise',
    'Antiguaise-et-barbudienne',
    'Saoudienne',
    'Argentine',
    'Arménienne',
    'Australienne',
    'Autrichienne',
    'Azerbaïdjanaise',
    'Bahamienne',
    'Bahreinienne',
    'Bangladaise',
    'Barbadienne',
    'Biélorusse',
    'Belge',
    'Bélizienne',
    'Béninoise',
    'Bhoutanaise',
    'Bolivienne',
    'Bosnienne',
    'Botswanaise',
    'Brésilienne',
    'Bruneienne',
    'Bulgare',
    'Burkinabé',
    'Burundaise',
    'Caverdienne',
    'Cambodgienne',
    'Camerounaise',
    'Canadienne',
    'Chilienne',
    'Chinoise',
    'Chypriote',
    'Colombienne',
    'Comorienne',
    'Congolaise',
    'Congolaise, (Kinshasa)',
    'Sud-coréenne',
    'Nord-coréenne',
    'Costaricaine',
    'Ivoirienne',
    'Croate',
    'Cubaine',
    'Danoise',
    'Djiboutienne',
    'Dominicaine',
    'Dominiquaise',
    'Egyptienne',
    'Salvadorienne',
    'Emirienne',
    'Equatorienne',
    'Erythréenne',
    'Espagnole',
    'Estonienne',
    'Américaine',
    'Ethiopienne',
    'Fidjienne',
    'Finlandaise',
    'Française',
    'Gabonaise',
    'Gambienne',
    'Georgienne',
    'Ghanéenne',
    'Hellénique',
    'Grenadienne',
    'Guatemaltèque',
    'Guinéenne',
    'Equato-guinéenne',
    'Bissau-Guinéenne',
    'Guyanaise, (Guyana)',
    'Guyanienne',
    'Haïtienne',
    'Hondurienne',
    'Hongroise',
    'Indienne',
    'Indonésienne',
    'Iranienne',
    'Irakienne',
    'Irlandaise',
    'Islandaise',
    'Israélienne',
    'Italienne',
    'Jamaïcaine',
    'Japonaise',
    'Jordanienne',
    'Kazakhstanaise',
    'Kenyane',
    'Kirghize',
    'Kiribatienne',
    'Koweitienne',
    'Laotienne',
    'Lesothane',
    'Lettone',
    'Libanaise',
    'Libérienne',
    'Libyenne',
    'Liechtensteinoise',
    'Lituanienne',
    'Luxembourgeoise',
    'Macédonienne',
    'Malgache',
    'Malaisienne',
    'Malawienne',
    'Maldivienne',
    'Malienne',
    'Maltaise',
    'Marocaine',
    'Marshallaise',
    'Mauricienne',
    'Mauritanienne',
    'Mexicaine',
    'Micronésienne',
    'Moldave',
    'Monégasque',
    'Mongole',
    'Monténégrine',
    'Mozambicaine',
    'Birmane',
    'Namibienne',
    'Nauruane',
    'Népalaise',
    'Nicaraguayenne',
    'Nigérienne',
    'Nigériane',
    'Norvégienne',
    'Neo-zélandaise',
    'Omanaise',
    'Ougandaise',
    'Ouzbeke',
    'Pakistanaise',
    'Palau',
    'Palestinienne',
    'Panaméenne',
    'Papouane-neoguinéenne',
    'Paraguayenne',
    'Néerlandaise',
    'Péruvienne',
    'Philippine',
    'Polonaise',
    'Portoricaine',
    'Portugaise',
    'Qatarienne',
    'Syrienne',
    'Centrafricaine',
    'Roumaine',
    'Britannique',
    '(RU)',
    'Russe',
    'Rwandaise',
    'Saint-Lucienne',
    'Kittitienne-et-névicienne',
    'Saint-Marinaise',
    'Saint-Vincentaise-et-Grenadine',
    'Salomonaise',
    'Samoane',
    'Santoméenne',
    'Sénégalaise',
    'Serbe',
    'Seychelloise',
    'Sierra-leonaise',
    'Singapourienne',
    'Slovaque',
    'Slovène',
    'Somalienne',
    'Soudanaise',
    'Sud',
    'soudanaise',
    'Sri-lankaise',
    'Suédoise',
    'Suisse',
    'Surinamaise',
    'Tadjike',
    'Taiwanaise',
    'Tanzanienne',
    'Tchadienne',
    'Tchèque',
    'Thaïlandaise',
    'Est-timoraise',
    'Togolaise',
    'Tongienne',
    'Trinidadienne',
    'Tunisienne',
    'Turkmène',
    'Turque',
    'Tuvaluane',
    'Ukrainienne',
    'Uruguayenne',
    'Vanuatuane',
    'Vénézuélienne',
    'Vietnamienne',
    'Yéménite',
    'Zambienne',
    'Zimbabwéenne',
  ];
  return (
    <div className="DoctorList">
      <div className="left">
        <Navbar doctor={doctor}/>
      </div>
      <div className="right" style={{ minHeight: "100vh" }}>
      <Header doctor = {doctor}/>
      <div className="edit-doc">
          <div>
            <label>Name:</label> <br />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor='id'>
              Matricule: 
            </label>
            <br />
            <input type='text' id='id' name='id' value={matricule} 
            onChange={(e) => setMatricule(e.target.value)} />
          </div> 

          <div>
            <label>Email:</label> <br />
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label>Phone:</label> <br />
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div>
            <label>Address:</label> <br />
            <textarea
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div>
            <label>Gender:</label> <br />
            <select id='gender' name='gender' value={gender}
              onChange={(e) => setGender(e.target.value)}>
              <option value=''>Select Gender</option> 
              <option value='Male'>Male</option>
              <option value='Female'>Female</option>
            </select>
          </div>
          <div>
            <label>Birth:</label> <br />
            <input
              type="date"
              value={birth}
              onChange={(e) => { 
                setBirth(e.target.value);
              }}
            />
          </div>
          <div>
            <label>Nationality:</label> <br />
            <select
          id='nationality'
          name='nationality'
          value={nationality}
          onChange={(e) => {setNationality(e.target.value)}}
          
        >
          {/* <option value=''>Select Nationality</option> */}
          <option value="Tunisienne" selected>
            Tunisienne
          </option>
          {nations.map((nation, index) => (
            <option key={index} value={nation}>
              {nation}
            </option>
          ))}
        </select>
          </div>
          <div>
            <label>Speciality:</label> <br />
            <select
              id='speciality'
              name='speciality'
              value={speciality}
              onChange={(e) => {setSpeciality(e.target.value)}}
              style={{marginBottom:'2rem'}}
            >
              
              <option value="">select speciality</option>
              {specialities.map((speciality, index) => (
                <option key={index} value={speciality}>
                  {speciality}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor='service'>
              Service: 
            </label>
            <br />
            <select
              id='service'
              name='service'
              value={service}
              onChange={(e) => {setService(e.target.value)}}
              style={{marginBottom:'2rem'}}
            >
              
              <option value= ''>select service</option>
              {services.map((service, index) => (
                <option key={index} value={service}>
                  {service}
                </option>
              ))}
            </select>
          </div>
          <br />
          
        </div>
        <div className='btn-action'>
            <button id="updateDoc" onClick={handleUpdate}>
              Update
            </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
