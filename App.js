// App.js
import React from 'react';
import { SafeAreaView } from 'react-native';
import AppNavigator from './navigation/AppNavigator';
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import { ThemeProvider } from './context/ThemeContext';

const App = () => {
  return (
    <AuthProvider>
      <SettingsProvider>
        <ThemeProvider>
          <SafeAreaView style={{ flex: 1 }}>
            <AppNavigator />
          </SafeAreaView>
        </ThemeProvider>
      </SettingsProvider>
    </AuthProvider>
  );
};

export default App;