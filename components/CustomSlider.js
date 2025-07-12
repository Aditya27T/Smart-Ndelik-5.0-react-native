import React from 'react';
import { View, StyleSheet } from 'react-native';

const CustomSlider = ({ value, onValueChange, minimumValue = 0, maximumValue = 100 }) => {
  const percentage = ((value - minimumValue) / (maximumValue - minimumValue)) * 100;

  return (
    <View style={styles.sliderContainer}>
      <View style={styles.sliderTrack}>
        <View style={[styles.sliderFill, { width: `${percentage}%` }]} />
        <View style={[styles.sliderThumb, { left: `${percentage}%` }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sliderContainer: {
    height: 20,
    justifyContent: 'center',
  },
  sliderTrack: {
    height: 6,
    backgroundColor: '#D1D5DB',
    borderRadius: 3,
    position: 'relative',
  },
  sliderFill: {
    height: 6,
    backgroundColor: '#92400E',
    borderRadius: 3,
  },
  sliderThumb: {
    position: 'absolute',
    top: -7,
    width: 20,
    height: 20,
    backgroundColor: '#92400E',
    borderRadius: 10,
    marginLeft: -10,
  },
});

export default CustomSlider;