import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

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
    return await createUserWithEmailAndPassword(getAuth(), email, password).then((result) => {
      return 0;
    }
    );
  } catch (error) {
    return error.code;
  }
};




/*
export function signUpWithEmailPassword(email, password) {
  createUserWithEmailAndPassword(getAuth(), email, password)
    .then((userCredential) => {
      const user = userCredential.user;
    })
    .catch((error) => {
      console.log(error.code)
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
    });
}

export function signInWithEmailPassword(email, password) {
  const auth = getAuth();
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorMessage);
    });
}
*/