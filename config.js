import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAZI91UTWGLscobx_KcsDSkgME5x5YNTIo",
    authDomain: "drp42-f265c.firebaseapp.com",
    databaseURL: "https://drp42-f265c-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "drp42-f265c",
    storageBucket: "drp42-f265c.appspot.com",
    messagingSenderId: "504929802315",
    appId: "1:504929802315:web:6e92115630aed7e98c95ce",
    measurementId: "G-VHSZ659ZJX"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
}

export { firebase };