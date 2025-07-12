import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const BottomNavigation = ({ activeTab, onTabPress }) => {
  const tabs = [
    { id: 'dashboard', icon: '🏠', label: 'Dashboard' },
    { id: 'monitoring', icon: '📊', label: 'Monitoring' },
    { id: 'settings', icon: '⚙️', label: 'Settings' },
    { id: 'profile', icon: '👤', label: 'Profile' },
  ];

  return (
    <View style={styles.bottomNav}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={[styles.tabItem, activeTab === tab.id && styles.activeTab]}
          onPress={() => onTabPress(tab.id)}
        >
          <Text style={styles.tabIcon}>{tab.icon}</Text>
          <Text style={[styles.tabLabel, activeTab === tab.id && styles.activeTabLabel]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
    bottomNav: {
        flexDirection: 'row',
        backgroundColor: '#92400E',
        paddingHorizontal: 4,
        paddingVertical: 8,
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 4,
        borderRadius: 12,
    },
    activeTab: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    tabIcon: {
        fontSize: 20,
        marginBottom: 4,
    },
    tabLabel: {
        fontSize: 12,
        color: 'white',
    },
    activeTabLabel: {
        fontWeight: 'bold',
    },
});

export default BottomNavigation;