import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  initializeAuth, 
  getAuth, 
  getReactNativePersistence 
} from "firebase/auth";
import { 
  initializeFirestore, 
  getFirestore,
  memoryLocalCache 
} from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",  
  measurementId: ""
};

// Gunakan singleton pattern
let app, auth, db;

if (!getApps().length) {
  // Inisialisasi Firebase App
  app = initializeApp(firebaseConfig);
  
  // Inisialisasi Auth dengan persistence
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
  
  // Inisialisasi Firestore dengan konfigurasi khusus untuk React Native
  db = initializeFirestore(app, {
    localCache: memoryLocalCache(), // Gunakan in-memory cache
    experimentalForceLongPolling: true // Penting untuk React Native
  });
} else {
  // Gunakan instance yang sudah ada
  app = getApp();
  auth = getAuth(app);
  db = getFirestore(app);
}

export { auth, db };