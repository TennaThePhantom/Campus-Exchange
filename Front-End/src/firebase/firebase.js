// going to modify this later don't touch at the moment
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Firebase configuration - going to move in .env file soon
const firebaseConfig = {
	apiKey: "AIzaSyBfP2yN7rjf_pggWQqup6VP_kT3zMmSQFk",
	authDomain: "campus-exchange-d47f4.firebaseapp.com",
	projectId: "campus-exchange-d47f4",
	storageBucket: "campus-exchange-d47f4.firebasestorage.app",
	messagingSenderId: "452783530182",
	appId: "1:452783530182:web:4647cbdb49173928f6b7c7",
	measurementId: "G-70FC399WZK",
};

// start up Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


// Initialize the Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;