// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAakvnpb8GyW5VocTYuB-v5Gh4wCxf24JU",
  authDomain: "my-web-chat-app-53bdc.firebaseapp.com",
  projectId: "my-web-chat-app-53bdc",
  storageBucket: "my-web-chat-app-53bdc.firebasestorage.app",
  messagingSenderId: "1004967210826",
  appId: "1:1004967210826:web:197b1f92a82dda01591bb3",
  measurementId: "G-5KNJR1F33Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const storage = getStorage(app);

export { app, analytics, storage };

