import React, { useState, useEffect, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  Alert,
  Modal,
  TextInput,
  ActivityIndicator
} from 'react-native';
import { auth } from '../firebase/config';
import { 
  getUserProfile, 
  updateUserProfile,
  updateProfilePhoto
} from '../services/userService';
import { updateProfile as updateAuthProfile } from 'firebase/auth';
import { ThemeContext } from '../context/ThemeContext';

const ProfileScreen = ({ onLogout, onUpdateUser }) => {
  const { isDarkMode } = useContext(ThemeContext);
  const [profile, setProfile] = useState(null);
  const [editedUsername, setEditedUsername] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        
        if (!auth.currentUser) {
          setLoading(false);
          return;
        }
        
        const userData = await getUserProfile(auth.currentUser.uid);
        
        if (userData) {
          setProfile(userData);
          setEditedUsername(userData.username || '');
        } else {
          setProfile({
            username: auth.currentUser.displayName || 'User',
            email: auth.currentUser.email
          });
          setEditedUsername(auth.currentUser.displayName || '');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSaveProfile = async () => {
    if (!auth.currentUser) return;
    
    try {
      await updateUserProfile(auth.currentUser.uid, {
        username: editedUsername
      });
      
      await updateAuthProfile(auth.currentUser, {
        displayName: editedUsername
      });
      
      setProfile({...profile, username: editedUsername});
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully!');
      
      if (onUpdateUser) {
        onUpdateUser({ username: editedUsername });
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    
    try {
      await updateAuthProfile(auth.currentUser, {
        password: newPassword
      });
      
      Alert.alert('Success', 'Password changed successfully!');
      setShowPasswordModal(false);
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleChangeProfilePhoto = async () => {
    const newPhotoURL = 'https://example.com/new-profile-photo.jpg';
    
    try {
      await updateAuthProfile(auth.currentUser, {
        photoURL: newPhotoURL
      });
      
      await updateProfilePhoto(auth.currentUser.uid, newPhotoURL);
      setProfile({...profile, profileImage: newPhotoURL});
      Alert.alert('Success', 'Profile photo updated!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile photo');
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            console.log("Account deletion requested");
            await onLogout();
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    onLogout();
    setShowLogoutModal(false);
  };

  const containerStyle = [styles.container, isDarkMode && styles.containerDark];
  const headerStyle = [styles.header, isDarkMode && styles.headerDark];
  const greetingStyle = [styles.greeting, isDarkMode && styles.greetingDark];
  const titleStyle = [styles.title, isDarkMode && styles.titleDark];
  const profileCardStyle = [styles.profileCard, isDarkMode && styles.profileCardDark];
  const profileNameStyle = [styles.profileName, isDarkMode && styles.profileNameDark];
  const profileEmailStyle = [styles.profileEmail, isDarkMode && styles.profileEmailDark];
  const editProfileButtonStyle = [styles.editProfileButton, isDarkMode && styles.editProfileButtonDark];
  const editProfileTextStyle = [styles.editProfileText, isDarkMode && styles.editProfileTextDark];
  const sectionTitleStyle = [styles.sectionTitle, isDarkMode && styles.sectionTitleDark];
  const dangerTitleStyle = [styles.dangerTitle, isDarkMode && styles.dangerTitleDark];
  const settingItemStyle = [styles.settingItem, isDarkMode && styles.settingItemDark];
  const dangerItemStyle = [styles.dangerItem, isDarkMode && styles.dangerItemDark];
  const settingIconStyle = [styles.settingIcon, isDarkMode && styles.settingIconDark];
  const dangerIconStyle = [styles.dangerIcon, isDarkMode && styles.dangerIconDark];
  const settingTitleStyle = [styles.settingTitle, isDarkMode && styles.settingTitleDark];
  const settingSubtitleStyle = [styles.settingSubtitle, isDarkMode && styles.settingSubtitleDark];
  const dangerTextStyle = [styles.dangerText, isDarkMode && styles.dangerTextDark];
  const dangerSubtextStyle = [styles.dangerSubtext, isDarkMode && styles.dangerSubtextDark];
  const textInputStyle = [styles.textInput, isDarkMode && styles.textInputDark];
  const labelStyle = [styles.label, isDarkMode && styles.labelDark];
  const modalContentStyle = [styles.modalContent, isDarkMode && styles.modalContentDark];
  const modalTitleStyle = [styles.modalTitle, isDarkMode && styles.modalTitleDark];
  const modalTextStyle = [styles.modalText, isDarkMode && styles.modalTextDark];

  if (loading) {
    return (
      <View style={[styles.loadingContainer, isDarkMode && styles.loadingContainerDark]}>
        <ActivityIndicator size="large" color={isDarkMode ? "#D4A57F" : "#8B4513"} />
      </View>
    );
  }

  const profileImage = profile?.profileImage || 
                      auth.currentUser?.photoURL || 
                      'https://via.placeholder.com/150';

  return (
    <View style={containerStyle}>
      {/* Compact Header */}
      <View style={headerStyle}>
        <View style={styles.headerContent}>
          <Text 
            style={greetingStyle}
            numberOfLines={1} 
            ellipsizeMode="tail"
          >
            Hi, {profile?.username || 'User'}.
          </Text>
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => setShowLogoutModal(true)}
          >
            <Image 
              source={{ uri: profileImage }} 
              style={styles.profileImage}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.mainContent} showsVerticalScrollIndicator={false}>
        <View style={styles.titleContainer}>
          <Text style={titleStyle}>Profile</Text>
        </View>

        {/* Profile Card */}
        <View style={profileCardStyle}>
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: profileImage }} 
              style={styles.avatar}
            />
            <TouchableOpacity
              style={styles.cameraButton}
              onPress={handleChangeProfilePhoto}
            >
              <Text style={styles.cameraIcon}>📷</Text>
            </TouchableOpacity>
          </View>

          {isEditing ? (
            <View style={styles.editForm}>
              <View style={styles.inputContainer}>
                <Text style={labelStyle}>Username</Text>
                <TextInput
                  style={textInputStyle}
                  value={editedUsername}
                  onChangeText={setEditedUsername}
                  placeholder="Enter your username"
                  placeholderTextColor={isDarkMode ? '#A0A0A0' : '#C7C7CD'}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={labelStyle}>Email</Text>
                <TextInput
                  style={[textInputStyle, { color: isDarkMode ? '#A0A0A0' : '#666' }]}
                  value={profile?.email || ''}
                  editable={false}
                  placeholder="Email cannot be changed"
                  placeholderTextColor={isDarkMode ? '#A0A0A0' : '#C7C7CD'}
                />
              </View>
              <View style={styles.editButtons}>
                <TouchableOpacity
                  style={[styles.editButton, styles.cancelEditButton, isDarkMode && styles.cancelEditButtonDark]}
                  onPress={() => setIsEditing(false)}
                >
                  <Text style={[styles.cancelEditButtonText, isDarkMode && styles.cancelEditButtonTextDark]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.editButton, styles.saveButton]}
                  onPress={handleSaveProfile}
                >
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.profileInfo}>
              <Text style={profileNameStyle}>{profile?.username || 'User'}</Text>
              <Text style={profileEmailStyle}>{profile?.email || auth.currentUser?.email}</Text>
              <TouchableOpacity
                style={editProfileButtonStyle}
                onPress={() => setIsEditing(true)}
              >
                <Text style={styles.editIcon}>✏️</Text>
                <Text style={editProfileTextStyle}>Edit Profile</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Account Settings */}
        <View style={styles.section}>
          <Text style={sectionTitleStyle}>Account Settings</Text>
          <TouchableOpacity 
            style={settingItemStyle} 
            onPress={() => setShowPasswordModal(true)}
          >
            <View style={settingIconStyle}><Text style={styles.settingIconText}>🔒</Text></View>
            <View style={styles.settingContent}>
              <Text style={settingTitleStyle}>Change Password</Text>
              <Text style={settingSubtitleStyle}>Update your password</Text>
            </View>
            <Text style={[styles.chevron, isDarkMode && styles.chevronDark]}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={dangerTitleStyle}>Danger Zone</Text>
          <TouchableOpacity 
            style={dangerItemStyle} 
            onPress={handleDeleteAccount}
          >
            <View style={dangerIconStyle}><Text style={styles.dangerIconText}>🗑️</Text></View>
            <View style={styles.settingContent}>
              <Text style={dangerTextStyle}>Delete Account</Text>
              <Text style={dangerSubtextStyle}>Permanently delete your account and data</Text>
            </View>
            <Text style={[styles.dangerChevron, isDarkMode && styles.dangerChevronDark]}>›</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Change Password Modal */}
      <Modal
        visible={showPasswordModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPasswordModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={modalContentStyle}>
            <Text style={modalTitleStyle}>Change Password</Text>
            
            <TextInput
              placeholder="New Password"
              placeholderTextColor={isDarkMode ? '#A0A0A0' : '#C7C7CD'}
              secureTextEntry
              style={textInputStyle}
              value={newPassword}
              onChangeText={setNewPassword}
            />
            
            <TextInput
              placeholder="Confirm Password"
              placeholderTextColor={isDarkMode ? '#A0A0A0' : '#C7C7CD'}
              secureTextEntry
              style={textInputStyle}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton, isDarkMode && styles.cancelButtonDark]}
                onPress={() => setShowPasswordModal(false)}
              >
                <Text style={[styles.cancelButtonText, isDarkMode && styles.cancelButtonTextDark]}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleChangePassword}
              >
                <Text style={styles.confirmButtonText}>Change</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Logout Modal */}
      <Modal
        visible={showLogoutModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={modalContentStyle}>
            <Text style={[styles.logoutIcon, isDarkMode && styles.logoutIconDark]}>🚪</Text>
            <Text style={modalTitleStyle}>Logout</Text>
            <Text style={modalTextStyle}>Are you sure you want to logout?</Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton, isDarkMode && styles.cancelButtonDark]}
                onPress={() => setShowLogoutModal(false)}
              >
                <Text style={[styles.cancelButtonText, isDarkMode && styles.cancelButtonTextDark]}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleLogout}
              >
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
  container: { 
    flex: 1, 
    backgroundColor: '#F5E6D3' 
  },
  containerDark: {
    backgroundColor: '#121212'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingContainerDark: {
    backgroundColor: '#121212'
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
    padding: 15,          
    paddingTop: 10, 
    paddingBottom: 5 
  },
  title: { 
    fontSize: 24,         
    fontWeight: 'bold', 
    color: '#8B4513' 
  },
  titleDark: {
    color: '#D4A57F'
  },
  profileCard: { 
    backgroundColor: '#FFFFFF', 
    marginHorizontal: 15, 
    marginBottom: 20,     
    borderRadius: 16,     
    padding: 20,          
    alignItems: 'center', 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 3 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 6, 
    elevation: 6 
  },
  profileCardDark: {
    backgroundColor: '#1E1E1E',
    shadowColor: '#000000'
  },
  avatarContainer: { 
    position: 'relative', 
    marginBottom: 12      
  },
  avatar: { 
    width: 90,            
    height: 90,           
    borderRadius: 45,     
    borderWidth: 3,       
    borderColor: '#F5E6D3' 
  },
  cameraButton: { 
    position: 'absolute', 
    bottom: 0, 
    right: 0, 
    backgroundColor: '#8B4513', 
    borderRadius: 14,     
    width: 28,            
    height: 28,           
    justifyContent: 'center', 
    alignItems: 'center', 
    borderWidth: 2,       
    borderColor: '#FFFFFF' 
  },
  cameraIcon: { 
    fontSize: 14,         
    color: '#FFFFFF'
  },
  profileInfo: { 
    alignItems: 'center' 
  },
  profileName: { 
    fontSize: 20,         
    fontWeight: 'bold', 
    color: '#333', 
    marginBottom: 4 
  },
  profileNameDark: {
    color: '#E0E0E0'
  },
  profileEmail: { 
    fontSize: 14,         
    color: '#666', 
    marginBottom: 12      
  },
  profileEmailDark: {
    color: '#A0A0A0'
  },
  editProfileButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#F5E6D3', 
    paddingHorizontal: 14,
    paddingVertical: 6,   
    borderRadius: 18,     
    gap: 6                
  },
  editProfileButtonDark: {
    backgroundColor: '#2C2C2C'
  },
  editIcon: { 
    fontSize: 14          
  },
  editProfileText: { 
    fontSize: 14,         
    color: '#8B4513', 
    fontWeight: '600' 
  },
  editProfileTextDark: {
    color: '#D4A57F'
  },
  editForm: { 
    width: '100%' 
  },
  inputContainer: { 
    marginBottom: 12      
  },
  label: { 
    fontSize: 13,         
    fontWeight: '600', 
    color: '#333', 
    marginBottom: 6       
  },
  labelDark: {
    color: '#E0E0E0'
  },
  textInput: { 
    borderWidth: 1, 
    borderColor: '#E0E0E0', 
    borderRadius: 10,     
    paddingHorizontal: 14,
    paddingVertical: 10,  
    fontSize: 14,         
    backgroundColor: '#FFFFFF',
    color: '#333'
  },
  textInputDark: {
    borderColor: '#4A4A4A',
    backgroundColor: '#2C2C2C',
    color: '#E0E0E0'
  },
  editButtons: { 
    flexDirection: 'row', 
    gap: 10,              
    marginTop: 12         
  },
  editButton: { 
    flex: 1, 
    paddingVertical: 10,  
    borderRadius: 10,     
    alignItems: 'center' 
  },
  cancelEditButton: { 
    backgroundColor: '#F0F0F0' 
  },
  cancelEditButtonDark: {
    backgroundColor: '#3e3e3e'
  },
  saveButton: { 
    backgroundColor: '#8B4513' 
  },
  cancelEditButtonText: { 
    color: '#666', 
    fontWeight: '600',
    fontSize: 14          
  },
  cancelEditButtonTextDark: {
    color: '#E0E0E0'
  },
  saveButtonText: { 
    color: '#FFFFFF', 
    fontWeight: '600',
    fontSize: 14          
  },
  section: { 
    marginBottom: 20      
  },
  sectionTitle: { 
    fontSize: 16,         
    fontWeight: 'bold', 
    color: '#8B4513', 
    marginBottom: 10,     
    paddingHorizontal: 15 
  },
  sectionTitleDark: {
    color: '#D4A57F'
  },
  dangerTitle: { 
    fontSize: 16,         
    fontWeight: 'bold', 
    color: '#F44336', 
    marginBottom: 10,     
    paddingHorizontal: 15 
  },
  dangerTitleDark: {
    color: '#FF8A80'
  },
  settingItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#FFFFFF', 
    marginHorizontal: 15, 
    marginBottom: 2, 
    padding: 14,          
    borderRadius: 10,     
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 1 }, 
    shadowOpacity: 0.05, 
    shadowRadius: 2, 
    elevation: 1 
  },
  settingItemDark: {
    backgroundColor: '#1E1E1E'
  },
  dangerItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#F44336', 
    marginHorizontal: 15, 
    marginBottom: 2, 
    padding: 14,          
    borderRadius: 10,     
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.15, 
    shadowRadius: 4, 
    elevation: 3 
  },
  dangerItemDark: {
    backgroundColor: '#D32F2F'
  },
  settingIcon: { 
    width: 36,            
    height: 36,           
    borderRadius: 18,     
    backgroundColor: '#F5E6D3', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 14       
  },
  settingIconDark: {
    backgroundColor: '#2C2C2C'
  },
  dangerIcon: { 
    width: 36,            
    height: 36,           
    borderRadius: 18,     
    backgroundColor: 'rgba(255,255,255,0.2)', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 14       
  },
  dangerIconDark: {
    backgroundColor: 'rgba(255,255,255,0.1)'
  },
  settingIconText: { 
    fontSize: 18          
  },
  dangerIconText: { 
    fontSize: 18          
  },
  settingContent: { 
    flex: 1 
  },
  settingTitle: { 
    fontSize: 14,         
    fontWeight: '600', 
    color: '#333', 
    marginBottom: 2 
  },
  settingTitleDark: {
    color: '#E0E0E0'
  },
  settingSubtitle: { 
    fontSize: 12,         
    color: '#666' 
  },
  settingSubtitleDark: {
    color: '#A0A0A0'
  },
  dangerText: { 
    fontSize: 14,         
    fontWeight: '600', 
    color: '#FFFFFF', 
    marginBottom: 2 
  },
  dangerTextDark: {
    color: '#FFFFFF'
  },
  dangerSubtext: { 
    fontSize: 12,         
    color: 'rgba(255,255,255,0.8)' 
  },
  dangerSubtextDark: {
    color: 'rgba(255,255,255,0.7)'
  },
  chevron: { 
    fontSize: 18,         
    color: '#A0A0A0' 
  },
  chevronDark: {
    color: '#666'
  },
  dangerChevron: { 
    fontSize: 18,         
    color: '#FFFFFF' 
  },
  dangerChevronDark: {
    color: '#FFFFFF'
  },
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  modalContent: { 
    backgroundColor: '#FFFFFF', 
    borderRadius: 16,     
    padding: 20,          
    width: '85%', 
    maxWidth: 400 
  },
  modalContentDark: {
    backgroundColor: '#2C2C2C'
  },
  logoutIcon: { 
    fontSize: 40,         
    textAlign: 'center' 
  },
  logoutIconDark: {
    color: '#FFFFFF'
  },
  modalTitle: { 
    fontSize: 18,         
    fontWeight: 'bold', 
    color: '#333', 
    marginTop: 12,        
    marginBottom: 6,      
    textAlign: 'center' 
  },
  modalTitleDark: {
    color: '#FFFFFF'
  },
  modalText: { 
    fontSize: 14,         
    color: '#666', 
    textAlign: 'center', 
    marginBottom: 20 
  },
  modalTextDark: {
    color: '#A0A0A0'
  },
  modalButtons: { 
    flexDirection: 'row', 
    gap: 10               
  },
  modalButton: { 
    flex: 1, 
    paddingVertical: 10,  
    borderRadius: 10,     
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
    fontWeight: '600',
    fontSize: 14          
  },
  cancelButtonTextDark: {
    color: '#E0E0E0'
  },
  confirmButtonText: { 
    color: '#FFFFFF', 
    fontWeight: '600',
    fontSize: 14          
  },
});

export default ProfileScreen;