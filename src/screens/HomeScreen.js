// src/screens/HomeScreen.js
import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  Alert, 
  RefreshControl, 
  Animated,
  Dimensions,
  StatusBar,
  TouchableOpacity
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import BrandCard from '../components/BrandCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { apiService } from '../services/apiService';
import { COLORS, GRADIENTS } from '../constants/colors';

const { width, height } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Animation values
  const gradientAnimation = useRef(new Animated.Value(0)).current;
  const headerAnimation = useRef(new Animated.Value(0)).current;
  const fadeAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchBrands();
    startAnimations();
  }, []);

  const startAnimations = () => {
    // Gradient background animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(gradientAnimation, {
          toValue: 1,
          duration: 8000,
          useNativeDriver: false,
        }),
        Animated.timing(gradientAnimation, {
          toValue: 0,
          duration: 8000,
          useNativeDriver: false,
        }),
      ])
    ).start();

    // Header entrance animation
    Animated.parallel([
      Animated.timing(headerAnimation, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnimation, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const fetchBrands = async (isRefresh = false) => {
    try {
      if (!isRefresh) setLoading(true);
      const data = await apiService.getBrands();
      setBrands(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load brands. Please try again.');
    } finally {
      setLoading(false);
      if (isRefresh) setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchBrands(true);
  };

  const handleBrandPress = (brand) => {
    navigation.navigate('BrandDetail', { 
      brandId: brand.id, 
      brandName: brand.name 
    });
  };

  const renderBrandCard = ({ item, index }) => (
    <Animated.View
      style={[
        styles.cardContainer,
        {
          opacity: fadeAnimation,
          transform: [
            {
              translateY: fadeAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            },
          ],
        },
      ]}
    >
      <BrandCard brand={item} onPress={handleBrandPress} />
    </Animated.View>
  );

  const renderHeader = () => (
    <Animated.View
      style={[
        styles.header,
        {
          opacity: headerAnimation,
          transform: [
            {
              translateY: headerAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [-30, 0],
              }),
            },
          ],
        },
      ]}
    >
      <View style={styles.headerContent}>
        <Text style={styles.headerTitle}>Top Brands Today</Text>
        
        <Text style={styles.headerSubtitle}>
          Discover the world's most innovative companies and emerging brands
        </Text>
      </View>
    </Animated.View>
  );

  const renderAnimatedGradient = () => {
    return (
      <View style={styles.gradientContainer}>
        <LinearGradient
          colors={['#0a0f1c', '#1e3c72', '#2a5298', '#667eea']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.gradientBackground]}
        />
        <LinearGradient
          colors={['rgba(118, 75, 162, 0.4)', 'rgba(240, 147, 251, 0.3)', 'rgba(102, 126, 234, 0.3)']}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.gradientOverlay}
        />
        <LinearGradient
          colors={['transparent', 'rgba(10, 15, 28, 0.2)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientAccent}
        />
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        {renderAnimatedGradient()}
        <LoadingSpinner message="Loading brands..." />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      {renderAnimatedGradient()}
      
      <SafeAreaView style={styles.safeArea}>
        <FlatList
          data={brands}
          keyExtractor={(item) => item.id}
          renderItem={renderBrandCard}
          ListHeaderComponent={renderHeader}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          bounces={true}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={COLORS.white}
              colors={[COLORS.white]}
              progressBackgroundColor="rgba(255, 255, 255, 0.1)"
            />
          }
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0f1c',
  },
  gradientContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: -width * 0.5,
    width: width * 2,
    height: height * 1.5,
    transform: [{ rotate: '-15deg' }],
    opacity: 0.9,
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.7,
  },
  gradientAccent: {
    position: 'absolute',
    top: height * 0.2,
    left: 0,
    right: 0,
    height: height * 0.6,
    opacity: 0.5,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    padding: 24,
    paddingTop: 40,
    paddingBottom: 30,
    alignItems: 'center',
  },
  headerContent: {
    alignItems: 'center',
    maxWidth: width * 0.9,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: COLORS.white,
    textAlign: 'center',
    opacity: 0.85,
    fontWeight: '400',
    lineHeight: 22,
    marginBottom: 30,
  },
  listContent: {
    paddingBottom: 40,
  },
  cardContainer: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
});