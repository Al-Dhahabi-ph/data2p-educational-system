import React, { createContext, useContext, useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, Database } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyCCEDd7T9V6zo_fYw_KWD5mW9btLC3o6pQ",
  authDomain: "movie-and-series-b78d0.firebaseapp.com",
  databaseURL: "https://movie-and-series-b78d0-default-rtdb.firebaseio.com",
  projectId: "movie-and-series-b78d0",
  storageBucket: "movie-and-series-b78d0.appspot.com",
  messagingSenderId: "594111766360",
  appId: "1:594111766360:web:39ad09dd2490ff445f0f2d"
};

interface FirebaseContextType {
  database: Database | null;
  isInitialized: boolean;
}

const FirebaseContext = createContext<FirebaseContextType>({
  database: null,
  isInitialized: false,
});

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [database, setDatabase] = useState<Database | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const app = initializeApp(firebaseConfig);
      const db = getDatabase(app);
      setDatabase(db);
      setIsInitialized(true);
    } catch (error) {
      console.error('Firebase initialization error:', error);
    }
  }, []);

  return (
    <FirebaseContext.Provider value={{ database, isInitialized }}>
      {children}
    </FirebaseContext.Provider>
  );
};
