const firebaseConfig = {
  apiKey: "AIzaSyDuE1UaiP6x4qIdl4JIDxV_M_CMCPY_36Y" ,
  authDomain: "tchop-ngoa.firebaseapp.com",
  projectId: "tchop-ngoa",
  storageBucket: "tchop-ngoa.firebasestorage.app",
  messagingSenderId: "568989458709",
  appId: "1:568989458709 : web: 3d313782a 5ba8d31f5891c"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();