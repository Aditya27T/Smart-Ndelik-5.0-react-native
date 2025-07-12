import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import SplashScreen from '../screens/SplashScreen';
import AuthScreen from '../screens/AuthScreen';
import DashboardScreen from '../screens/DashboardScreen';
import MonitoringScreen from '../screens/MonitoringScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import BottomNavigation from '../components/BottomNavigation';

const AppNavigator = () => {
  const auth = useAuth();
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState('dashboard');

  const user = auth?.user;
  const initializing = auth?.initializing;
  const logout = auth?.logout || (() => {});

  const handleTabPress = (tabId) => {
    setActiveTab(tabId);
  };

  const renderScreen = () => {
    if (initializing) {
      return <SplashScreen />;
    }

    if (!user) {
      return <AuthScreen />;
    }

    const screenProps = {
      user,
      onLogout: logout,
      onTabPress: handleTabPress
    };

    switch (activeTab) {
      case 'dashboard': return <DashboardScreen {...screenProps} />;
      case 'monitoring': return <MonitoringScreen {...screenProps} />;
      case 'settings': return <SettingsScreen {...screenProps} />;
      case 'profile': return <ProfileScreen {...screenProps} />;
      default: return <DashboardScreen {...screenProps} />;
    }
  };

  return (
    <View style={[
      styles.container, 
      theme.isDarkMode && styles.containerDark
    ]}>
      {renderScreen()}
      
      {user && !initializing && (
        <BottomNavigation 
          activeTab={activeTab} 
          onTabPress={handleTabPress} 
          isDarkMode={theme.isDarkMode}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5E6D3',
  },
  containerDark: {
    backgroundColor: '#121212',
  }
});

export default AppNavigator;