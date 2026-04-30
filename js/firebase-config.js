// Configuration Firebase - TCHOP-NGOA
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDuE1UaiP6x4qIdl4JIDxV_M_CMCPY_36Y",
  authDomain: "tchop-ngoa.firebaseapp.com",
  projectId: "tchop-ngoa",
  storageBucket: "tchop-ngoa.firebasestorage . app" ,
  messagingSenderId: "568989458709",
  appId: "1:568989458709 : web: 3d313782a 5ba8d31f5891c"
};

// Initialisation Firebase
const app = initializeApp(firebaseConfig);

// Services disponibles
const db = getFirestore(app);
const auth = getAuth(app);

// Export pour utilisation dans les autres fichiers
export { db, auth };