import React, { useState, useEffect, useRef, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  Dimensions,
  Modal,
  ActivityIndicator
} from 'react-native';
import { auth } from '../firebase/config';
import { getUserProfile } from '../services/userService';
import { dummyData } from '../api/dummyData';
import ArticleScreen from './ArticleScreen'; 
import { ThemeContext } from '../context/ThemeContext';

const { width: screenWidth } = Dimensions.get('window');

const DashboardScreen = ({ onLogout }) => {
  const { isDarkMode } = useContext(ThemeContext);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [showTipsModal, setShowTipsModal] = useState(false);
  const scrollViewRef = useRef(null);
  const [selectedCoffee, setSelectedCoffee] = useState(null);
  
  const [userProfile, setUserProfile] = useState({
    username: 'User',
    profileImage: 'https://via.placeholder.com/150'
  });
  
  const [loading, setLoading] = useState(true);

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
            profileImage: auth.currentUser.photoURL || 
                         userData.profileImage || 
                         'https://via.placeholder.com/150'
          });
        } else {
          setUserProfile({
            username: auth.currentUser.displayName || 'User',
            profileImage: auth.currentUser.photoURL || 'https://via.placeholder.com/150'
          });
        }
      } catch (error) {
        setUserProfile({
          username: 'User',
          profileImage: 'https://via.placeholder.com/150'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleScroll = (event) => {
    const slide = Math.ceil(event.nativeEvent.contentOffset.x / screenWidth);
    if (slide !== currentSlide) {
      setCurrentSlide(slide);
    }
  };

  const handleCoffeeTypePress = (coffee) => {
    setSelectedCoffee(coffee);
  };

  const handleLogout = () => {
    onLogout();
    setShowLogoutModal(false);
  };

  const containerStyle = [styles.container, isDarkMode && styles.containerDark];
  const headerStyle = [styles.header, isDarkMode && styles.headerDark];
  const greetingStyle = [styles.greeting, isDarkMode && styles.greetingDark];
  const mainContentStyle = [styles.mainContent, isDarkMode && styles.mainContentDark];
  const sectionTitleStyle = [styles.sectionTitle, isDarkMode && styles.sectionTitleDark];
  const coffeeTypeCardStyle = [styles.coffeeTypeCard, isDarkMode && styles.coffeeTypeCardDark];
  const coffeeTypeNameStyle = [styles.coffeeTypeName, isDarkMode && styles.coffeeTypeNameDark];
  const featureCardStyle = [styles.featureCard, isDarkMode && styles.featureCardDark];
  const featureIconStyle = [styles.featureIcon, isDarkMode && styles.featureIconDark];
  const featureTitleStyle = [styles.featureTitle, isDarkMode && styles.featureTitleDark];
  const featureSubtitleStyle = [styles.featureSubtitle, isDarkMode && styles.featureSubtitleDark];
  const modalContentStyle = [styles.modalContent, isDarkMode && styles.modalContentDark];
  const modalTitleStyle = [styles.modalTitle, isDarkMode && styles.modalTitleDark];
  const modalTextStyle = [styles.modalText, isDarkMode && styles.modalTextDark];
  const guideModalContentStyle = [styles.guideModalContent, isDarkMode && styles.guideModalContentDark];
  const guideTitleStyle = [styles.guideTitle, isDarkMode && styles.guideTitleDark];
  const guideStepStyle = [styles.guideStep, isDarkMode && styles.guideStepDark];

  if (loading) {
    return (
      <View style={[styles.loadingContainer, isDarkMode && styles.loadingContainerDark]}>
        <ActivityIndicator size="large" color={isDarkMode ? "#D4A57F" : "#8B4513"} />
      </View>
    );
  }

  if (selectedCoffee) {
    return (
      <ArticleScreen 
        coffee={selectedCoffee} 
        onClose={() => setSelectedCoffee(null)}
      />
    );
  }

  return (
    <View style={containerStyle}>
      {/* Header */}
      <View style={headerStyle}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Text 
              style={greetingStyle}
              numberOfLines={1} 
              ellipsizeMode="tail"
            >
              Hi, {userProfile.username}!
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => setShowLogoutModal(true)}
          >
            <Image 
              source={{ uri: userProfile.profileImage }} 
              style={styles.profileImage}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView style={mainContentStyle} showsVerticalScrollIndicator={false}>
        {/* Image Slider */}
        <View style={styles.sliderContainer}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={50}
          >
            {dummyData.sliderPhotos.map((item) => (
              <View key={item.id} style={styles.slide}>
                <Image source={{ uri: item.name }} style={styles.sliderImage} />
                <View style={styles.sliderOverlay}>
                  <Text style={styles.sliderText}>Coffee Processing Excellence</Text>
                </View>
              </View>
            ))}
          </ScrollView>
          <View style={styles.pagination}>
            {dummyData.sliderPhotos.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  index === currentSlide && styles.paginationDotActive
                ]}
              />
            ))}
          </View>
        </View>

        {/* Coffee Types */}
        <View style={styles.section}>
          <Text style={sectionTitleStyle}>Coffee Types</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.coffeeTypesContainer}
          >
            {dummyData.coffeeTypes.map((coffee) => (
              <TouchableOpacity
                key={coffee.id}
                style={coffeeTypeCardStyle}
                onPress={() => handleCoffeeTypePress(coffee)}
              >
                <Image source={{ uri: coffee.image }} style={styles.coffeeTypeImage} />
                <Text style={coffeeTypeNameStyle}>{coffee.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Interactive Features */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={featureCardStyle}
            onPress={() => setShowGuideModal(true)}
          >
            <View style={featureIconStyle}><Text style={styles.featureIconText}>❓</Text></View>
            <View style={styles.featureContent}>
              <Text style={featureTitleStyle}>How to Use</Text>
              <Text style={featureSubtitleStyle}>Complete guide for using the app</Text>
            </View>
            <Text style={[styles.chevron, isDarkMode && styles.chevronDark]}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={featureCardStyle}
            onPress={() => setShowTipsModal(true)}
          >
            <View style={featureIconStyle}><Text style={styles.featureIconText}>💡</Text></View>
            <View style={styles.featureContent}>
              <Text style={featureTitleStyle}>Coffee Tips</Text>
              <Text style={featureSubtitleStyle}>Expert tips for better coffee</Text>
            </View>
            <Text style={[styles.chevron, isDarkMode && styles.chevronDark]}>›</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

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

      {/* Guide Modal */}
      <Modal
        visible={showGuideModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowGuideModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={guideModalContentStyle}>
            <View style={styles.guideHeader}>
              <Text style={[styles.guideIcon, isDarkMode && styles.guideIconDark]}>❓</Text>
              <Text style={guideTitleStyle}>How to Use Smart Ndelik 5.0</Text>
            </View>
            <ScrollView style={styles.guideContent}>
              <Text style={guideStepStyle}>1. Buka Settings untuk mengatur kamera, tema, dan preferensi aplikasi</Text>
              <Text style={guideStepStyle}>2. Gunakan Monitoring untuk melihat proses pemilihan biji kopi secara real-time</Text>
              <Text style={guideStepStyle}>3. Akses Dashboard untuk melihat ringkasan proses pengolahan kopi</Text>
              <Text style={guideStepStyle}>4. Kelola akun dan informasi pribadi di Profil</Text>
              <Text style={guideStepStyle}>5. Pelajari berbagai jenis kopi di Coffee Types</Text>
            </ScrollView>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowGuideModal(false)}
            >
              <Text style={styles.closeButtonText}>Got it!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showTipsModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowTipsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={guideModalContentStyle}>
            <View style={styles.guideHeader}>
              <Text style={[styles.guideIcon, isDarkMode && styles.guideIconDark]}>💡</Text>
              <Text style={guideTitleStyle}>Coffee Tips</Text>
            </View>
            <ScrollView style={styles.guideContent}>
              <Text style={guideStepStyle}>• Gunakan biji kopi segar untuk rasa terbaik</Text>
              <Text style={guideStepStyle}>• Pilih biji kopi sesuai selera (Arabika, Robusta, Liberika)</Text>
              <Text style={guideStepStyle}>• Simpan biji kopi dalam wadah kedap udara</Text>
              <Text style={guideStepStyle}>• Giling biji kopi sesuai metode penyeduhan (French press, espresso, pour-over)</Text>
              <Text style={guideStepStyle}>• Gunakan air bersih dan segar untuk menyeduh kopi</Text>
              <Text style={guideStepStyle}>• Sesuaikan rasio kopi dan air untuk kekuatan yang diinginkan</Text>
              <Text style={guideStepStyle}>• Jangan biarkan kopi terlalu lama terpapar udara</Text>
            </ScrollView>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowTipsModal(false)}
            >
              <Text style={styles.closeButtonText}>Thanks!</Text>
            </TouchableOpacity>
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
  mainContentDark: {
    backgroundColor: '#121212'
  },
  sliderContainer: { 
    height: 180,          
    marginBottom: 15      
  },
  slide: { 
    width: screenWidth, 
    height: 180           
  },
  sliderImage: { 
    width: '100%', 
    height: '100%', 
    resizeMode: 'cover' 
  },
  sliderOverlay: { 
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    right: 0, 
    backgroundColor: 'rgba(0,0,0,0.4)', 
    padding: 15            
  },
  sliderText: { 
    color: '#FFFFFF', 
    fontSize: 16,          
    fontWeight: 'bold' 
  },
  pagination: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    position: 'absolute', 
    bottom: 8,             
    left: 0, 
    right: 0 
  },
  paginationDot: { 
    width: 6,              
    height: 6,             
    borderRadius: 3,       
    backgroundColor: 'rgba(255,255,255,0.5)', 
    marginHorizontal: 3    
  },
  paginationDotActive: { 
    backgroundColor: '#FFFFFF' 
  },
  section: { 
    marginBottom: 20       
  },
  sectionTitle: { 
    fontSize: 18,          
    fontWeight: 'bold', 
    color: '#8B4513', 
    marginBottom: 12,      
    paddingHorizontal: 15  
  },
  sectionTitleDark: {
    color: '#D4A57F'
  },
  coffeeTypesContainer: { 
    paddingHorizontal: 15  
  },
  coffeeTypeCard: { 
    alignItems: 'center', 
    marginRight: 12,       
    backgroundColor: '#FFFFFF', 
    borderRadius: 14,      
    padding: 10,           
    shadowColor: '#000', 
    shadowOffset: { 
      width: 0, 
      height: 2 
    }, 
    shadowOpacity: 0.1, 
    shadowRadius: 4, 
    elevation: 3 
  },
  coffeeTypeCardDark: {
    backgroundColor: '#1E1E1E'
  },
  coffeeTypeImage: { 
    width: 70,             
    height: 70,            
    borderRadius: 35,      
    marginBottom: 6        
  },
  coffeeTypeName: { 
    fontSize: 13,          
    fontWeight: '600', 
    color: '#8B4513' 
  },
  coffeeTypeNameDark: {
    color: '#D4A57F'
  },
  featureCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#FFFFFF', 
    marginHorizontal: 15,  
    marginBottom: 10,      
    padding: 14,           
    borderRadius: 14,      
    shadowColor: '#000', 
    shadowOffset: { 
      width: 0, 
      height: 2 
    }, 
    shadowOpacity: 0.1, 
    shadowRadius: 4, 
    elevation: 3 
  },
  featureCardDark: {
    backgroundColor: '#1E1E1E'
  },
  featureIcon: { 
    width: 42,             
    height: 42,            
    borderRadius: 21,      
    backgroundColor: '#F5E6D3', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 14        
  },
  featureIconDark: {
    backgroundColor: '#2C2C2C'
  },
  featureIconText: { 
    fontSize: 20           
  },
  featureContent: { 
    flex: 1 
  },
  featureTitle: { 
    fontSize: 15,          
    fontWeight: 'bold', 
    color: '#333', 
    marginBottom: 2        
  },
  featureTitleDark: {
    color: '#E0E0E0'
  },
  featureSubtitle: { 
    fontSize: 13,          
    color: '#666' 
  },
  featureSubtitleDark: {
    color: '#A0A0A0'
  },
  chevron: { 
    fontSize: 18,          
    color: '#A0A0A0' 
  },
  chevronDark: {
    color: '#666'
  },
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  modalContent: { 
    backgroundColor: '#FFFFFF', 
    borderRadius: 18,      
    padding: 20,           
    alignItems: 'center', 
    marginHorizontal: 30,  
    shadowColor: '#000', 
    shadowOffset: { 
      width: 0, 
      height: 3            
    }, 
    shadowOpacity: 0.2,    
    shadowRadius: 6,       
    elevation: 6           
  },
  modalContentDark: {
    backgroundColor: '#2C2C2C'
  },
  logoutIcon: { 
    fontSize: 40           
  },
  logoutIconDark: {
    color: '#FFFFFF'
  },
  modalTitle: { 
    fontSize: 18,          
    fontWeight: 'bold', 
    color: '#333', 
    marginTop: 12,         
    marginBottom: 6        
  },
  modalTitleDark: {
    color: '#FFFFFF'
  },
  modalText: { 
    fontSize: 15,          
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
    paddingVertical: 10,   
    paddingHorizontal: 20, 
    borderRadius: 10,      
    minWidth: 75,          
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
  guideModalContent: { 
    backgroundColor: '#FFFFFF', 
    borderRadius: 18,      
    marginHorizontal: 15,  
    maxHeight: '80%', 
    shadowColor: '#000', 
    shadowOffset: { 
      width: 0, 
      height: 3            
    }, 
    shadowOpacity: 0.2,    
    shadowRadius: 6,       
    elevation: 6           
  },
  guideModalContentDark: {
    backgroundColor: '#2C2C2C'
  },
  guideHeader: { 
    alignItems: 'center', 
    padding: 20,           
    paddingBottom: 12      
  },
  guideIcon: { 
    fontSize: 28           
  },
  guideIconDark: {
    color: '#FFFFFF'
  },
  guideTitle: { 
    fontSize: 18,          
    fontWeight: 'bold', 
    color: '#333', 
    marginTop: 10          
  },
  guideTitleDark: {
    color: '#FFFFFF'
  },
  guideContent: { 
    paddingHorizontal: 20, 
    maxHeight: 300 
  },
  guideStep: { 
    fontSize: 15,          
    color: '#666', 
    lineHeight: 22,        
    marginBottom: 10       
  },
  guideStepDark: {
    color: '#A0A0A0'
  },
  closeButton: { 
    backgroundColor: '#8B4513', 
    margin: 20,            
    marginTop: 12,         
    paddingVertical: 10,   
    borderRadius: 10,      
    alignItems: 'center' 
  },
  closeButtonText: { 
    color: '#FFFFFF', 
    fontSize: 15,          
    fontWeight: '600' 
  },
});

export default DashboardScreen;