import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

// Configure Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCCg-DmPpUbAPHSnIQjsJvo_BqoHzJ5hv0",
  authDomain: "farmlink-7f1a3.firebaseapp.com",
  projectId: "farmlink-7f1a3",
  storageBucket: "farmlink-7f1a3.appspot.com",
  messagingSenderId: "76032833877",
  appId: "1:76032833877:web:aa94ad142cd9215ee817dc"
};
const app = initializeApp(firebaseConfig);

export const signUpWithEmailPassword = async function (email, password) {
  try {
    return await createUserWithEmailAndPassword(getAuth(), email, password);
  } catch (error) {
    if(error.code == 'auth/weak-password'){
      return 1;
    }
    else if(error.code == 'auth/email-already-in-use'){
      return 2;
    }
    else{
      return "ERROR";
    }
  }
};

export const signInWithEmailPassword = async function (email, password){
  try {
    return await signInWithEmailAndPassword(getAuth(), email, password);
  } catch (error) {
    if(error.code == 'auth/wrong-password'){
      return 1;
    }
    else if(error.code == 'auth/user-not-found'){
      return 2;
    }
    else{
      return "ERROR";
    }
  }
};

export const endSession = async function () {
  try {
    return await signOut(getAuth());
  } catch (error) {
    return "ERROR";
  }
};