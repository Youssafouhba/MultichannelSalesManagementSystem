import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';

const QuatreRectangles = () => {
  const { width } = useWindowDimensions();
  const rectangleWidth = width / 2 - 15; // 15 est la marge entre les rectangles


  

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={[styles.rectangle, { width: rectangleWidth, backgroundColor: 'red' }]} />
        <View style={[styles.rectangle, { width: rectangleWidth, backgroundColor: 'green' }]} />
      </View>
      <View style={styles.row}>
        <View style={[styles.rectangle, { width: rectangleWidth, backgroundColor: 'blue' }]} />
        <View style={[styles.rectangle, { width: rectangleWidth, backgroundColor: 'yellow' }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-evenly',
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: '47%', // Définir une hauteur fixe pour chaque rangée
  },
  rectangle: {
    height: '100%', // Remplir toute la hauteur de la rangée
    //margin: 5,
  },
});

export default QuatreRectangles;