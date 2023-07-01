import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore';
import {getAuth} from 'firebase/auth';
import {getStorage} from 'firebase/storage';

// Firebase config
const firebaseConfig = {
  apiKey: 'AIzaSyC0I5shtVQZcTimIu_Hr0GvO4wvGJHzPVk',
  authDomain: 'gluco-chek.firebaseapp.com',
  projectId: 'gluco-chek',
  storageBucket: 'gluco-chek.appspot.com',
  messagingSenderId: '1026703254091',
  appId: '1:1026703254091:web:2bb752d8dd0abc3a58a3ce',
};
// initialize firebase

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export {app, db, auth, storage};