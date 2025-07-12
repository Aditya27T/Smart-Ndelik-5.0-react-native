import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';

const ErrorHandler = ({ error, onClose }) => {
  const { isDarkMode } = React.useContext(ThemeContext);
  
  const userMessage = __DEV__ 
    ? error?.message || 'An error occurred' 
    : 'Maaf, terjadi kesalahan. Silakan coba lagi nanti.';
  
  const contextInfo = __DEV__ 
    ? `[${error?.context || 'Unknown'}]` 
    : '';

  return (
    <Modal
      visible={!!error}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[
          styles.modalContent, 
          isDarkMode && styles.modalContentDark
        ]}>
          <Text style={[styles.errorIcon, isDarkMode && styles.textDark]}>⚠️</Text>
          <Text style={[styles.modalTitle, isDarkMode && styles.textDark]}>
            Terjadi Kesalahan
          </Text>
          
          <Text style={[styles.errorText, isDarkMode && styles.subtextDark]}>
            {userMessage}
          </Text>
          
          {__DEV__ && error?.stack && (
            <View style={styles.stackContainer}>
              <Text style={[styles.stackLabel, isDarkMode && styles.subtextDark]}>
                Stack Trace:
              </Text>
              <Text style={[styles.stackText, isDarkMode && styles.subtextDark]}>
                {contextInfo} {error.stack}
              </Text>
            </View>
          )}
          
          <TouchableOpacity 
            style={[styles.modalButton, styles.confirmButton]} 
            onPress={onClose}
          >
            <Text style={styles.confirmButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '90%',
    maxHeight: '80%',
  },
  errorIcon: {
    fontSize: 48,
    textAlign: 'center',
    marginBottom: 16,
    color: '#D32F2F',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#333',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  stackContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    marginBottom: 20,
  },
  stackLabel: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#666',
  },
  stackText: {
    fontSize: 12,
    color: '#888',
  },
  modalButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: '#8B4513',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  modalContentDark: {
    backgroundColor: '#2C2C2C',
  },
  textDark: {
    color: '#FFFFFF',
  },
  subtextDark: {
    color: '#A0A0A0',
  },
});

export default ErrorHandler;