import React, { useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import { ThemeContext } from '../context/ThemeContext';

const ArticleScreen = ({ coffee, onClose }) => {
  const { isDarkMode } = useContext(ThemeContext);
  
  const safeAreaStyle = [
    styles.safeArea, 
    isDarkMode && styles.safeAreaDark
  ];
  
  const containerStyle = [
    styles.container, 
    isDarkMode && styles.containerDark
  ];
  
  const headerStyle = [
    styles.header, 
    isDarkMode && styles.headerDark
  ];
  
  const backButtonTextStyle = [
    styles.backButtonText,
    isDarkMode && styles.backButtonTextDark
  ];
  
  const headerTitleStyle = [
    styles.headerTitle,
    isDarkMode && styles.headerTitleDark
  ];
  
  const scrollContentStyle = [
    styles.scrollContent,
    isDarkMode && styles.scrollContentDark
  ];
  
  const articleTextStyle = [
    styles.articleText,
    isDarkMode && styles.articleTextDark
  ];

  return (
    <SafeAreaView style={safeAreaStyle}>
      <View style={containerStyle}>
        {/* Header */}
        <View style={headerStyle}>
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
            <Text style={backButtonTextStyle}>‹</Text>
          </TouchableOpacity>
          <Text style={headerTitleStyle}>{coffee.name}</Text>
        </View>

        {/* Content */}
        <ScrollView contentContainerStyle={scrollContentStyle}>
          <Image source={{ uri: coffee.articleImage }} style={styles.articleImage} />
          <Text style={articleTextStyle}>{coffee.article}</Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#5D2E0A',
  },
  safeAreaDark: {
    backgroundColor: '#1E1E1E',
  },
  container: {
    flex: 1,
    backgroundColor: '#F5E6D3',
  },
  containerDark: {
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#5D2E0A',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  headerDark: {
    backgroundColor: '#1E1E1E',
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2C',
  },
  backButton: {
    paddingRight: 16,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: 'bold',
  },
  backButtonTextDark: {
    color: '#E0E0E0',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerTitleDark: {
    color: '#FFFFFF',
  },
  scrollContent: {
    padding: 20,
  },
  scrollContentDark: {
    backgroundColor: '#121212',
  },
  articleImage: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    marginBottom: 20,
  },
  articleText: {
    fontSize: 16,
    color: '#333333',
    lineHeight: 24,
    textAlign: 'justify',
  },
  articleTextDark: {
    color: '#E0E0E0',
  },
});

export default ArticleScreen;