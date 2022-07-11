import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyC-tVdtn5AFhMW-4pSSsvp_bIWZf2_ZDl8",
  authDomain: "instagram-mern-66d76.firebaseapp.com",
  projectId: "instagram-mern-66d76",
  storageBucket: "instagram-mern-66d76.appspot.com",
  messagingSenderId: "968001223779",
  appId: "1:968001223779:web:acb72e89b0a4249b530c56"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
