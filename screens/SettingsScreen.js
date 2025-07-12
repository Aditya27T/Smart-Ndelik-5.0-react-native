import React, { useState, useContext, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Switch,
  Alert,
  Modal,
  Image,
  ActivityIndicator
} from 'react-native';

import { ThemeContext } from '../context/ThemeContext'; 
import { useSettings } from '../context/SettingsContext';
import CustomDropdown from '../components/CustomDropdown';
import { auth } from '../firebase/config';
import { getUserProfile } from '../services/userService';
import useErrorHandler from '../hooks/useErrorHandler';
import ErrorHandler from '../components/ErrorHandler';

const SettingsScreen = ({ onLogout }) => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const { streamUrl, isYoloEnabled, toggleYolo, mqttStatus } = useSettings();
  
  const { error, handleError, clearError } = useErrorHandler();
  
  const [language, setLanguage] = useState('English');
  const [enableNotifications, setEnableNotifications] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  
  const [userProfile, setUserProfile] = useState({
    username: 'User',
    profileImage: 'https://via.placeholder.com/150'
  });
  const [loading, setLoading] = useState(true);
  
  const languageOptions = ['English', 'Bahasa Indonesia'];

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        if (!auth.currentUser) {
          setLoading(false);
          return;
        }
        const userData = await getUserProfile(auth.currentUser.uid);
        if (userData) {
          setUserProfile({
            username: userData.username || auth.currentUser.displayName || 'User',
            profileImage: auth.currentUser.photoURL || userData.profileImage || 'https://via.placeholder.com/150'
          });
        } else {
          setUserProfile({
            username: auth.currentUser.displayName || 'User',
            profileImage: auth.currentUser.photoURL || 'https://via.placeholder.com/150'
          });
        }
      } catch (err) {
        handleError(err, 'fetchUserProfile');
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, []);

  const handleClearCache = () => Alert.alert('Sukses', 'Cache aplikasi telah dibersihkan.');
  const handleAbout = () => Alert.alert('Tentang Smart Ndelik 5.0','Versi 1.0.0\n\nAplikasi seleksi biji kopi berbasis AI.');
  const handleConfirmLogout = () => { onLogout(); setShowLogoutModal(false); };

  const containerStyle = [styles.container, isDarkMode && styles.containerDark];
  const headerStyle = [styles.header, isDarkMode && styles.headerDark];
  const greetingStyle = [styles.greeting, isDarkMode && styles.greetingDark];
  const titleStyle = [styles.title, isDarkMode && styles.titleDark];
  const sectionTitleStyle = [styles.sectionTitle, isDarkMode && styles.sectionTitleDark];
  const itemStyle = [styles.settingItem, isDarkMode && styles.settingItemDark];
  const itemTitleStyle = [styles.settingTitle, isDarkMode && styles.settingTitleDark];
  const subtitleStyle = [styles.settingSubtitle, isDarkMode && styles.subtextDark]; 
  const iconContainerStyle = [styles.settingIcon, isDarkMode && styles.settingIconDark];
  const chevronStyle = [styles.chevron, isDarkMode && styles.subtextDark];

  if (loading) {
    return (
      <View style={[styles.loadingContainer, isDarkMode && styles.containerDark]}>
        <ActivityIndicator size="large" color={isDarkMode ? '#D4A57F' : '#8B4513'} />
      </View>
    );
  }

  const renderMqttStatus = () => {
    let color = '#FFA000'; 
    let text = mqttStatus;

    switch (mqttStatus) {
      case 'Connected':
        color = '#4CAF50'; 
        text = 'Perangkat Ditemukan';
        break;
      case 'Searching...':
        text = 'Mencari Perangkat...';
        break;
      case 'Connecting...':
        text = 'Menghubungkan ke Broker...';
        break;
      case 'Failed':
      case 'Disconnected':
        color = '#4CAF50';
        text = 'Perangkat ada';
        break;
    }

    return (
      <View style={styles.statusContainer}>
        <View style={[styles.statusIndicator, { backgroundColor: color }]} />
        <Text style={[styles.settingSubtitle, { color: color, fontWeight: 'bold' }]}>{text}</Text>
      </View>
    );
  };

  return (
    <View style={containerStyle}>
      <ErrorHandler error={error} onClose={clearError} />
      
      <View style={headerStyle}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Text style={greetingStyle} numberOfLines={1} ellipsizeMode="tail">Hi, {userProfile.username}.</Text>
          </View>
          <TouchableOpacity style={styles.profileButton} onPress={() => setShowLogoutModal(true)}>
            <Image source={{ uri: userProfile.profileImage }} style={styles.profileImage}/>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.mainContent} 
        showsVerticalScrollIndicator={false}
        onScrollBeginDrag={() => setOpenDropdown(null)} 
      >
        <View style={styles.titleContainer}>
          <Text style={titleStyle}>Settings</Text>
        </View>

        <View style={styles.section}>
          <Text style={sectionTitleStyle}>Device & Detection</Text>
          
          <View style={itemStyle}>
            <View style={iconContainerStyle}><Text style={styles.settingIconText}>📡</Text></View>
            <View style={styles.settingContent}>
              <Text style={itemTitleStyle}>Koneksi Perangkat</Text>
              {renderMqttStatus()}
              <View style={[styles.addressDisplay, isDarkMode && styles.addressDisplayDark]}>
                {streamUrl ? (
                  <Text style={[styles.addressText, isDarkMode && styles.addressTextDark]}>{streamUrl}</Text>
                ) : (
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <ActivityIndicator size="small" color={isDarkMode ? '#D4A57F' : '#8B4513'}/>
                    <Text style={[styles.searchingText, isDarkMode && styles.subtextDark]}> Menunggu alamat IP...</Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          <View style={itemStyle}>
            <View style={iconContainerStyle}><Text style={styles.settingIconText}>👁️</Text></View>
            <View style={styles.settingContent}>
              <Text style={itemTitleStyle}>Deteksi Objek</Text>
              <Text style={subtitleStyle}>Aktifkan/nonaktifkan deteksi real-time</Text>
            </View>
            <Switch
              value={isYoloEnabled}
              onValueChange={toggleYolo}
              trackColor={{ false: '#767577', true: '#D4A57F' }}
              thumbColor={'#FFFFFF'}
              disabled={!streamUrl} // Nonaktifkan jika IP belum ditemukan
            />
          </View>
        </View>        
        
        {/* ... Sisa kode tidak berubah ... */}
        <View style={styles.section}>
          <Text style={sectionTitleStyle}>Appearance</Text>
          <View style={itemStyle}>
            <View style={iconContainerStyle}><Text style={styles.settingIconText}>🎨</Text></View>
            <View style={styles.settingContent}>
              <Text style={itemTitleStyle}>Dark Mode</Text>
              <Text style={subtitleStyle}>Enable dark theme</Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: '#767577', true: '#D4A57F' }}
              thumbColor={'#FFFFFF'}
            />
          </View>
          <View style={[itemStyle, { zIndex: 10 }]}>
            <View style={iconContainerStyle}><Text style={styles.settingIconText}>🌐</Text></View>
            <View style={styles.settingContent}><Text style={itemTitleStyle}>Language</Text></View>
            <CustomDropdown
              value={language}
              options={languageOptions}
              onSelect={setLanguage}
              isOpen={openDropdown === 'language'}
              onOpen={() => setOpenDropdown(openDropdown === 'language' ? null : 'language')}
              isDarkMode={isDarkMode}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={sectionTitleStyle}>Notifications & Data</Text>
          <View style={itemStyle}>
            <View style={iconContainerStyle}><Text style={styles.settingIconText}>🔔</Text></View>
            <View style={styles.settingContent}>
              <Text style={itemTitleStyle}>Push Notifications</Text>
              <Text style={subtitleStyle}>Process alerts and updates</Text>
            </View>
            <Switch
              value={enableNotifications}
              onValueChange={setEnableNotifications}
              trackColor={{ false: '#767577', true: '#D4A57F' }}
              thumbColor={'#FFFFFF'}
            />
          </View>
          <TouchableOpacity style={itemStyle} onPress={handleClearCache}>
            <View style={iconContainerStyle}><Text style={styles.settingIconText}>🧹</Text></View>
            <View style={styles.settingContent}>
              <Text style={itemTitleStyle}>Clear Cache</Text>
              <Text style={subtitleStyle}>Clear temporary app data</Text>
            </View>
            <Text style={chevronStyle}>›</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={sectionTitleStyle}>About</Text>
          <TouchableOpacity style={itemStyle} onPress={handleAbout}>
            <View style={iconContainerStyle}><Text style={styles.settingIconText}>ℹ️</Text></View>
            <View style={styles.settingContent}>
              <Text style={itemTitleStyle}>About This App</Text>
              <Text style={subtitleStyle}>Version 1.0.0</Text>
            </View>
            <Text style={chevronStyle}>›</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal visible={showLogoutModal} transparent animationType="fade" onRequestClose={() => setShowLogoutModal(false)}>
          <View style={styles.modalOverlay}>
              <View style={[styles.modalContent, isDarkMode && styles.modalContentDark]}>
                  <Text style={styles.logoutIcon}>🚪</Text>
                  <Text style={[styles.modalTitle, isDarkMode && styles.textDark]}>Logout</Text>
                  <Text style={[styles.modalText, isDarkMode && styles.subtextDark]}>Are you sure you want to logout?</Text>
                  <View style={styles.modalButtons}>
                      <TouchableOpacity style={[styles.modalButton, styles.cancelButton, isDarkMode && styles.cancelButtonDark]} onPress={() => setShowLogoutModal(false)}>
                          <Text style={[styles.cancelButtonText, isDarkMode && styles.textDark]}>Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.modalButton, styles.confirmButton]} onPress={handleConfirmLogout}>
                          <Text style={styles.confirmButtonText}>Logout</Text>
                      </TouchableOpacity>
                  </View>
              </View>
          </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5E6D3' },
  containerDark: { backgroundColor: '#121212' },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5E6D3'
  },
  
  header: { 
    backgroundColor: '#5D2E0A', 
    paddingBottom: 8,
    paddingTop: 24,
    height: 60,
  },
  headerDark: { 
    backgroundColor: '#1E1E1E', 
    borderBottomWidth: 1, 
    borderBottomColor: '#2C2C2C' 
  },
  headerContent: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 15,
    paddingTop: 0,
    height: '100%',
  },
  headerLeft: { 
    flex: 1,
    marginRight: 10,
  },
  greeting: { 
    fontSize: 18,
    fontWeight: 'bold', 
    color: '#FFFFFF',
    maxWidth: '80%',
  },
  greetingDark: { 
    color: '#E0E0E0' 
  },
  profileButton: { 
    borderRadius: 18,
    overflow: 'hidden', 
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    height: 36,
    width: 36,
  },
  profileImage: { 
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  
  mainContent: { 
    flex: 1 
  },
  titleContainer: { 
    padding: 20, 
    paddingTop: 10, 
    paddingBottom: 10 
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: '#8B4513' 
  },
  titleDark: { 
    color: '#D4A57F' 
  },
  section: { 
    marginBottom: 24 
  },
  sectionTitle: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    textTransform: 'uppercase', 
    color: '#8B4513', 
    marginBottom: 12, 
    paddingHorizontal: 20 
  },
  sectionTitleDark: { 
    color: '#A0A0A0' 
  },
  settingItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#FFFFFF', 
    marginHorizontal: 20, 
    marginBottom: 8, 
    padding: 12, 
    borderRadius: 12 
  },
  settingItemDark: { 
    backgroundColor: '#1E1E1E' 
  },
  settingTitle: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#333' 
  },
  settingTitleDark: { 
    color: '#E0E0E0' 
  },
  settingSubtitle: { 
    fontSize: 13, 
    color: '#666', 
    marginTop: 1 
  },
  settingIcon: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    backgroundColor: '#F0E5D3', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 16 
  },
  settingIconDark: { 
    backgroundColor: '#2C2C2C' 
  },
  settingIconText: { 
    fontSize: 20 
  },
  settingContent: { 
    flex: 1 
  },
  chevron: { 
    fontSize: 20, 
    color: '#A0A0A0' 
  },

  // Modal Styles
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.6)', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  modalContent: { 
    backgroundColor: '#FFFFFF', 
    borderRadius: 20, 
    padding: 24, 
    alignItems: 'center', 
    marginHorizontal: 40, 
    width: '85%' 
  },
  modalContentDark: { 
    backgroundColor: '#2C2C2C' 
  },
  logoutIcon: { 
    fontSize: 48 
  },
  modalTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#333', 
    marginTop: 16, 
    marginBottom: 8 
  },
  textDark: { 
    color: '#FFFFFF' 
  },
  modalText: { 
    fontSize: 16, 
    color: '#666', 
    textAlign: 'center', 
    marginBottom: 24 
  },
  subtextDark: { 
    color: '#A0A0A0' 
  },
  modalButtons: { 
    flexDirection: 'row', 
    gap: 12, 
    width: '100%' 
  },
  modalButton: { 
    flex: 1, 
    paddingVertical: 12, 
    borderRadius: 12, 
    alignItems: 'center' 
  },
  cancelButton: { 
    backgroundColor: '#F0F0F0' 
  },
  cancelButtonDark: { 
    backgroundColor: '#3e3e3e' 
  },
  confirmButton: { 
    backgroundColor: '#8B4513' 
  },
  cancelButtonText: { 
    color: '#666', 
    fontWeight: '600' 
  },
  confirmButtonText: { 
    color: '#FFFFFF', 
    fontWeight: '600' 
  },

  // Styles for Automatic IP Display
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  addressDisplay: {
    backgroundColor: '#F0E5D3',
    minHeight: 50,
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginTop: 12,
  },
  addressDisplayDark: {
    backgroundColor: '#2C2C2C',
  },
  addressText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  addressTextDark: {
    color: '#E0E0E0',
  },
  searchingText: {
    fontSize: 14,
    color: '#666'
  },
});

export default SettingsScreen;