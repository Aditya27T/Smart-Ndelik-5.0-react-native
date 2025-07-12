import React, { useState } from 'react';  
import {  
  View,  
  Text,  
  TextInput,  
  TouchableOpacity,  
  ScrollView,  
  StyleSheet,  
  SafeAreaView,  
  Alert,  
} from 'react-native';  

import { createUserWithEmailAndPassword } from 'firebase/auth';  
import { doc, setDoc } from 'firebase/firestore';  
import { auth, db } from '../firebase/config';  

const RegisterScreen = ({ onRegister, onNavigateToLogin, loading }) => {  
  const [email, setEmail] = useState('');  
  const [username, setUsername] = useState('');  
  const [password, setPassword] = useState('');  

  const handleRegister = async () => {  
    if (!email || !username || !password) {  
      Alert.alert('Error', 'Please fill in all fields');  
      return;  
    }  

    try {  
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);  
      const user = userCredential.user;  

      await setDoc(doc(db, "profiles", user.uid), {  
        username: username,  
        email: email,  
        createdAt: new Date()  
      });  

      Alert.alert(  
        "Registrasi Berhasil",   
        "Akun Anda telah dibuat. Silakan login."  
      );  
      
      onNavigateToLogin();  
    } catch (error) {  
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
          Alert.alert("Error", error.message || "Terjadi kesalahan yang tidak terduga");  
      }  
    }  
  };  

  return (  
    <SafeAreaView style={styles.container}>  
      <ScrollView contentContainerStyle={styles.scrollContainer}>  
        <View style={styles.registerContainer}>  
          <View style={styles.avatarContainer}>  
            <Text style={styles.avatarIcon}>👤</Text>  
          </View>  
          
          <Text style={styles.title}>REGISTER</Text>  
          
          <View style={styles.inputContainer}>  
            <Text style={styles.label}>Email</Text>  
            <View style={styles.inputWrapper}>  
              <Text style={styles.inputIcon}>✉️</Text>  
              <TextInput  
                style={styles.textInput}  
                placeholder="Enter your email"  
                placeholderTextColor="#543310"  
                value={email}  
                onChangeText={setEmail}  
                keyboardType="email-address"  
                autoCapitalize="none"  
              />  
            </View>  
          </View>  

          <View style={styles.inputContainer}>  
            <Text style={styles.label}>Username</Text>  
            <View style={styles.inputWrapper}>  
              <Text style={styles.inputIcon}>👤</Text>  
              <TextInput  
                style={styles.textInput}  
                placeholder="Enter your username"  
                placeholderTextColor="#543310"  
                value={username}  
                onChangeText={setUsername}  
                autoCapitalize="none"  
              />  
            </View>  
          </View>  

          <View style={styles.inputContainer}>  
            <Text style={styles.label}>Password</Text>  
            <View style={styles.inputWrapper}>  
              <Text style={styles.inputIcon}>🔒</Text>  
              <TextInput  
                style={styles.textInput}  
                placeholder="Enter your password"  
                placeholderTextColor="#543310"  
                value={password}  
                onChangeText={setPassword}  
                secureTextEntry  
              />  
            </View>  
          </View>  

          <TouchableOpacity   
            style={styles.primaryButton}   
            onPress={handleRegister}  
            disabled={loading}  
          >  
            <Text style={styles.primaryButtonText}>  
              {loading ? 'Loading...' : 'Sign Up'}  
            </Text>  
          </TouchableOpacity>  

          <TouchableOpacity   
            style={styles.linkButton}  
            onPress={onNavigateToLogin}  
          >  
            <Text style={styles.linkText}>Have an account? Login here!</Text>  
          </TouchableOpacity>  
        </View>  
      </ScrollView>  
    </SafeAreaView>  
  );  
};  

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  registerContainer: {
    backgroundColor: '#AF8F6F',
    borderRadius: 24,
    padding: 40,
    justifyContent: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarIcon: {
    fontSize: 48,
    backgroundColor: 'white',
    width: 80,
    height: 80,
    textAlign: 'center',
    lineHeight: 80,
    borderRadius: 40,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#543310',
    textAlign: 'center',
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    color: '#543310',
    marginBottom: 8,
    fontWeight: '500',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F4E1',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
  },
  inputIcon: {
    marginRight: 12,
    fontSize: 16,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#543310',
  },
  primaryButton: {
    backgroundColor: '#543310',
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  linkText: {
    color: '#543310',
    textDecorationLine: 'underline',
  },
});

export default RegisterScreen;
