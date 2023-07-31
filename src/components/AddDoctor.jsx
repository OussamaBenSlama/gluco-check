import React, { useState , useEffect} from 'react';
import '../style/AddDoctor.css';
import { addDoc, collection , getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

const AddDoctor = () => {
  const [formData, setFormData] = useState({
    name: '',
    matricule: '',
    email: '',
    phone: '',
    address: '',
    gender: '',
    birth: '',
    nationality: '',
    speciality: '',
    service : '',
    patients: [],
  });

  const doctorsRef = collection(db, 'doctors'); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isDateValid = (inputDate) => {
    const systemDate = new Date();
    const birthDate = new Date(inputDate);
    return birthDate < systemDate;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    
    
  };
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


  const addNewDoctor = async () => {
    try {
      if(isDateValid(formData.birth))
      {
        await addDoc(doctorsRef, {
          name: formData.name,
          matricule: formData.matricule,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          gender: formData.gender,
          birth: new Date(formData.birth), // to save date in firebase correctly
          nationality: formData.nationality,
          speciality: formData.speciality,
          service : formData.service,
          chief :false ,
          patients: formData.patients,
        });
        alert('Doctor added successfully');

      }
      else {
        alert('Birth date invalid.');
      }
      setFormData({
        name: '',
        matricule: '',
        email: '',
        phone: '',
        address: '',
        gender: '',
        birth: '',
        nationality: '',
        speciality: '',
        service:'',
        patients: [],
      });
    } catch (err) {
      console.error(err);
    }
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
    <form onSubmit={handleSubmit} className='Form'>
      <div>
        <label htmlFor='name'>
          Name: <span>*</span>
        </label>{' '}
        <br />
        <input type='text' id='name' name='name' value={formData.name} onChange={handleChange} />
      </div>
      <div>
        <label htmlFor='id'>
          Matricule: <span>*</span>
        </label>
        <br />
        <input type='text' id='id' name='id' value={formData.matricule} onChange={handleChange} />
      </div> 
      <div>
        <label htmlFor='email'>
          Email: <span>*</span>
        </label>
        <br />
        <input type='text' id='email' name='email' value={formData.email} onChange={handleChange} />
      </div>
      <div>
        <label htmlFor='phone'>
          Phone: <span>*</span>
        </label>
        <br />
        <input type='text' id='phone' name='phone' value={formData.phone} onChange={handleChange} />
      </div>
      <div>
        <label htmlFor='address'>
          Address: <span>*</span>
        </label>
        <br />
        <textarea id='address' name='address' rows="1" value={formData.address} onChange={handleChange} />
      </div>
      <div>
        <label htmlFor='gender'>
          Gender: <span>*</span>
        </label>
        <br />
        <select id='gender' name='gender' value={formData.gender} onChange={handleChange}>
          <option value=''>Select Gender</option> 
          <option value='Male' selected >Male</option>
          <option value='Female'>Female</option>
        </select>
      </div>
      <div>
        <label htmlFor='birth'>
          Birth: <span>*</span>
        </label>
        <br />
        <input type='date' id='birth' name='birth' value={formData.birth} onChange={handleChange} />
      </div>
      <div>
        <label htmlFor='nationality'>
          Nationality: <span>*</span>
        </label>
        <br />
        <select
          id='nationality'
          name='nationality'
          value={formData.nationality}
          onChange={handleChange}
          
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
        <label htmlFor='speciality'>
          Speciality: <span>*</span>
        </label>
        <br />
        <select
          id='speciality'
          name='speciality'
          value={formData.speciality}
          onChange={handleChange}
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
          Service: <span>*</span>
        </label>
        <br />
        <select
          id='service'
          name='service'
          value={formData.service}
          onChange={handleChange}
          style={{marginBottom:'2rem'}}
        >
          
          <option value="">select service</option>
          {services.map((service, index) => (
            <option key={index} value={service}>
              {service}
            </option>
          ))}
        </select>
      </div>
      <br />
      <button  type='submit' id='addDoc' onClick={addNewDoctor}>
        Submit
      </button>
    </form>
  );
};

export default AddDoctor;
