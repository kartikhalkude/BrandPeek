// src/navigation/AppNavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import BrandDetailScreen from '../screens/BrandDetailScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          animationDuration: 300,
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{
            title: 'BrandPeek'
          }}
        />
        <Stack.Screen 
          name="BrandDetail" 
          component={BrandDetailScreen}
          options={({ route }) => ({
            title: route.params?.brandName || 'Brand Details'
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}