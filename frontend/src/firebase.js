// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyBbbLrWQfhFuuKW1M_VZferxJ_rjB894p8",
//   authDomain: "ejobocean-14285.firebaseapp.com",
//   projectId: "ejobocean-14285",
//   storageBucket: "ejobocean-14285.firebasestorage.app",
//   messagingSenderId: "1027079375779",
//   appId: "1:1027079375779:web:aafbb49a356c3bacbe6816",
//   measurementId: "G-3FL01LRG37"
// };

// // Initialize Firebase
// export const auth = firebase.auth();
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);


// export const googleProvider = new firebase.auth.GoogleAuthProvider();

// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// ✅ Correct Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBbbLrWQfhFuuKW1M_VZferxJ_rjB894p8",
  authDomain: "ejobocean-14285.firebaseapp.com",
  projectId: "ejobocean-14285",
  storageBucket: "ejobocean-14285.appspot.com", // fixed typo here
  messagingSenderId: "1027079375779",
  appId: "1:1027079375779:web:aafbb49a356c3bacbe6816",
  measurementId: "G-3FL01LRG37",
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Initialize Analytics (optional, only in browser)
const analytics = getAnalytics(app);

// ✅ Initialize Authentication
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
