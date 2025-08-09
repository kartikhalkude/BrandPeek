import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, GRADIENTS } from '../constants/colors';

export default function BrandCard({ brand, onPress }) {
  return (
    <TouchableOpacity onPress={() => onPress(brand)} style={styles.container}>
      <LinearGradient colors={GRADIENTS.card} style={styles.card}>
        <View style={styles.logoContainer}>
          <Image
            source={{ uri: brand.logo }}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>
        <View style={styles.content}>
          <Text style={styles.name}>{brand.name}</Text>
          <Text style={styles.description}>{brand.description}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    marginHorizontal: 16,
  },
  card: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    
  },
  logoContainer: {
    width: 60,
    height: 60,
    borderRadius: 30, 
     
    overflow: 'hidden',    
    marginRight: 16,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
     borderWidth: 1,           // Add this line
  borderColor: '#ddd', 
    
  },
  logoImage: {
    borderColor:'black',
    width: '70%',          // smaller so logo fits nicely inside circle
    height: '70%',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
});
