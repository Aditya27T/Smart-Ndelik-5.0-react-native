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

import { signInWithEmailAndPassword } from 'firebase/auth';  
import { auth } from '../firebase/config';  

const LoginScreen = ({ onLogin, onNavigateToRegister, loading }) => {  
  const [email, setEmail] = useState('');  
  const [password, setPassword] = useState('');  

  const handleLogin = async () => {  
    if (!email || !password) {  
      Alert.alert('Error', 'Please fill in all fields');  
      return;  
    }  

    try {  
      await signInWithEmailAndPassword(auth, email, password);  
      
    } catch (error) {  
      switch (error.code) {  
        case 'auth/user-not-found':  
          Alert.alert("Login Gagal", "Pengguna tidak ditemukan.");  
          break;  
        case 'auth/wrong-password':  
          Alert.alert("Login Gagal", "Password salah.");  
          break;  
        case 'auth/invalid-email':  
          Alert.alert("Login Gagal", "Format email tidak valid.");  
          break;  
        case 'auth/network-request-failed':  
          Alert.alert("Koneksi Bermasalah", "Tidak dapat terhubung ke server.");  
          break;  
        default:  
          Alert.alert("Login Gagal", error.message);  
      }  
    }  
  };  

  return (  
    <SafeAreaView style={styles.container}>  
      <ScrollView contentContainerStyle={styles.scrollContainer}>  
        <View style={styles.loginContainer}>  
          <View style={styles.avatarContainer}>  
            <Text style={styles.avatarIcon}>👤</Text>  
          </View>  
          <Text style={styles.title}>LOGIN</Text>  
          
          <View style={styles.inputContainer}>  
            <Text style={styles.label}>Email</Text>  
            <View style={styles.inputWrapper}>  
              <Text style={styles.inputIcon}>👤</Text>  
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
            onPress={handleLogin}  
            disabled={loading}  
          >  
            <Text style={styles.primaryButtonText}>  
              {loading ? 'Loading...' : 'Login'}  
            </Text>  
          </TouchableOpacity>  

          <TouchableOpacity style={styles.linkButton}>  
            <Text style={styles.forgotText}>Forgot Password?</Text>  
          </TouchableOpacity>  

          <TouchableOpacity   
            style={styles.linkButton}  
            onPress={onNavigateToRegister}  
          >  
            <Text style={styles.linkText}>Don't have an account yet? Register here!</Text>  
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
    loginContainer: {
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
        color: '#78350F',
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
    forgotText: {
      color: '#302315',
      alignItems: 'right',
    },
    linkText: {
        color: '#302315',
        textDecorationLine: 'underline',
    },
});

export default LoginScreen;
