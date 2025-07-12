import React, { useState } from 'react';
import { Alert } from 'react-native';
import { auth } from '../firebase/config';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  sendEmailVerification 
} from 'firebase/auth';
import useErrorHandler from '../hooks/useErrorHandler';
import ErrorHandler from '../components/ErrorHandler';

import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';

const AuthScreen = () => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [loading, setLoading] = useState(false);
  
  const { error, handleError, clearError } = useErrorHandler();

  const handleLogin = async (email, password) => {
    try {
      setLoading(true);      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        Alert.alert(
          "Verifikasi Email", 
          "Silakan verifikasi email Anda terlebih dahulu."
        );
        return;
      }

      if (__DEV__) {
        console.log('Login successful:', user);
      }
    } catch (error) {
      handleError(error, 'handleLogin');
      
      switch (error.code) {
        case 'auth/user-not-found':
          Alert.alert("Login Gagal", "Pengguna tidak ditemukan.");
          break;
        case 'auth/wrong-password':
          Alert.alert("Login Gagal", "Password salah.");
          break;
        case 'auth/network-request-failed':
          Alert.alert(
            "Koneksi Bermasalah", 
            "Tidak dapat terhubung ke server. Pastikan:\n• Internet aktif\n• Tidak ada firewall yang memblokir\n• Coba restart aplikasi"
          );
          break;
        default:
          Alert.alert("Login Gagal", "Terjadi kesalahan saat login. Silakan coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  };
 
  const handleRegister = async (email, password, username) => {
    try {
      setLoading(true);      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await sendEmailVerification(user);

      Alert.alert(
        "Registrasi Berhasil", 
        "Silakan periksa email Anda untuk verifikasi dan kemudian login."
      );
      
      setIsLoginView(true);
    } catch (error) {
      handleError(error, 'handleRegister');
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          Alert.alert("Registrasi Gagal", "Email sudah terdaftar.");
          break;
        case 'auth/invalid-email':
          Alert.alert("Registrasi Gagal", "Format email tidak valid.");
          break;
        case 'auth/weak-password':
          Alert.alert("Registrasi Gagal", "Password terlalu lemah. Gunakan minimal 6 karakter.");
          break;
        case 'auth/network-request-failed':
          Alert.alert(
            "Koneksi Bermasalah", 
            "Tidak dapat terhubung ke server. Pastikan internet aktif dan coba lagi."
          );
          break;
        default:
          Alert.alert("Registrasi Gagal", "Terjadi kesalahan saat registrasi. Silakan coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Error Handler Component */}
      <ErrorHandler error={error} onClose={clearError} />
      
      {isLoginView ? (
        <LoginScreen 
          onLogin={handleLogin} 
          onNavigateToRegister={() => setIsLoginView(false)}
          loading={loading}
        />
      ) : (
        <RegisterScreen 
          onRegister={handleRegister} 
          onNavigateToLogin={() => setIsLoginView(true)}
          loading={loading}
        />
      )}
    </>
  );
};

export default AuthScreen;