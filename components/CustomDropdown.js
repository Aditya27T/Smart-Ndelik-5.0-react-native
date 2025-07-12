import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';

const CustomDropdown = ({ options, value, onSelect, isOpen, onOpen }) => {
  const handleToggle = () => {
    onOpen(!isOpen); 
  };

  const handleSelect = (option) => {
    onSelect(option);
    onOpen(false);
  };

  return (
    <View style={styles.container}>
      {/* This is the button you see initially */}
      <TouchableOpacity onPress={handleToggle} style={styles.button}>
        <Text style={styles.buttonText}>{value}</Text>
        <Text style={styles.arrow}>{isOpen ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      {/* This View only appears when isOpen is true */}
      {isOpen && (
        <View style={styles.optionsContainer}>
          <FlatList
            data={options}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleSelect(item)}
                style={styles.optionItem}
              >
                <Text style={styles.optionText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingVertical: 4,
  },
  buttonText: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  arrow: {
    fontSize: 10,
    color: '#666',
  },
  optionsContainer: {
    position: 'absolute',
    top: '110%',
    right: 0,
    width: '120%', 
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8, 
    zIndex: 1000, 
  },
  optionItem: {
    padding: 12,
  },
  optionText: {
    fontSize: 14,
    color: '#333',
  },
});

export default CustomDropdown;