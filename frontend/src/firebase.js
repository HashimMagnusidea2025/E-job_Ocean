
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// import { getAuth, GoogleAuthProvider,setPersistence,
//   browserLocalPersistence } from "firebase/auth";

// // ✅ Correct Firebase config
// const firebaseConfig = {
//   apiKey: "AIzaSyBbbLrWQfhFuuKW1M_VZferxJ_rjB894p8",
//   authDomain: "ejobocean-14285.firebaseapp.com",
//   projectId: "ejobocean-14285", 
//   storageBucket: "ejobocean-14285.appspot.com", // fixed typo here
//   messagingSenderId: "1027079375779",
//   appId: "1:1027079375779:web:aafbb49a356c3bacbe6816",
//   measurementId: "G-3FL01LRG37",
// };

// // ✅ Initialize Firebase
// const app = initializeApp(firebaseConfig);



// // ✅ Initialize Authentication
// export const auth = getAuth(app);

// setPersistence(auth, browserLocalPersistence);
// export const googleProvider = new GoogleAuthProvider();

// export default app;





import { initializeApp } from "firebase/app";

 import { getAuth, GoogleAuthProvider, } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyBbbLrWQfhFuuKW1M_VZferxJ_rjB894p8",
  authDomain: "ejobocean-14285.firebaseapp.com",
  projectId: "ejobocean-14285",
  storageBucket: "ejobocean-14285.firebasestorage.app",
  messagingSenderId: "1027079375779",
  appId: "1:1027079375779:web:aafbb49a356c3bacbe6816",
  measurementId: "G-3FL01LRG37"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

 export const auth = getAuth(app);


 export const googleProvider = new GoogleAuthProvider();
