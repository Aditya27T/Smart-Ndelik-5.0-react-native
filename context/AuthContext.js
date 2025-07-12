import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth } from '../firebase/config';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut
} from 'firebase/auth';
import { Alert } from 'react-native';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setInitializing(false);
    });
    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (e) {
      Alert.alert("Login Gagal", e.message);
    }
  };

  const register = async (email, password, username) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (e) {
      Alert.alert("Registrasi Gagal", e.message);
      return null;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      Alert.alert("Logout Gagal", e.message);
    }
  };
  
  const value = {
    user,
    initializing,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};