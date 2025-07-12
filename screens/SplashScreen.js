import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, Animated,Image } from 'react-native';
import Logo from '../assets/Logo.png';

const SplashScreen = ({ onFinish }) => {
  const fadeAnim = useMemo(() => new Animated.Value(0), []);
  const scaleAnim = useMemo(() => new Animated.Value(0), []);


  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 65,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      onFinish();
    }, 3000);

    return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim, onFinish]);

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >
        <Image 
              source={Logo} 
              style={styles.coffeeIcon}
          />
        <Text style={styles.title}>Smart Ndelik</Text>
        <Text style={styles.version}>5.0</Text>
        <Text style={styles.subtitle}>AI Coffee Bean Selection</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8B4513',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  coffeeIcon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  version: {
    fontSize: 18,
    color: '#F5E6D3',
    fontWeight: '600',
    marginTop: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#F5E6D3',
    marginTop: 8,
    opacity: 0.9,
  },
});

export default SplashScreen;