// src/screens/BrandDetailScreen.js
import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  Alert,
  Animated,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import LoadingSpinner from '../components/LoadingSpinner';
import { apiService } from '../services/apiService';
import { COLORS, GRADIENTS } from '../constants/colors';

const { width, height } = Dimensions.get('window');

export default function BrandDetailScreen({ route, navigation }) {
  const { brandId, brandName } = route.params;
  const [brand, setBrand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(false);

  // Animation values
  const gradientAnimation = useRef(new Animated.Value(0)).current;
  const contentAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchBrandDetail();
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

    // Content entrance animation
    Animated.timing(contentAnimation, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  };

  const fetchBrandDetail = async () => {
    try {
      const data = await apiService.getBrandById(brandId);
      // Fix potential snake_case field
      const fullDesc = data.fullDescription || data.full_description || '';
      setBrand({ ...data, fullDescription: fullDesc });
    } catch (error) {
      Alert.alert('Error', 'Failed to load brand details. Please try again.');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = () => {
    setFollowing(!following);
    Alert.alert(
      'Success',
      following ? `Unfollowed ${brand.name}!` : `Now following ${brand.name}!`
    );
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const renderAnimatedGradient = () => (
    <View style={styles.gradientContainer}>
      <LinearGradient
        colors={['#0a0f1c', '#1e3c72', '#2a5298']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradientBackground]}
      />
      <LinearGradient
        colors={['rgba(240, 147, 251, 0.2)', 'rgba(245, 87, 108, 0.2)', 'rgba(102, 126, 234, 0.2)']}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradientOverlay}
      />
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        {renderAnimatedGradient()}
        <LoadingSpinner message="Loading brand details..." />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderAnimatedGradient()}
      
      <SafeAreaView style={styles.safeArea}>
        {/* Enhanced Header Bar */}
        <View style={styles.headerBar}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.1)']}
              style={styles.backButtonGradient}
            >
              <Text style={styles.backButtonText}>← Back</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        
        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Animated.View
            style={[
              styles.content,
              {
                opacity: contentAnimation,
                transform: [
                  {
                    translateY: contentAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [30, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            {/* Enhanced Logo Container */}
            <View style={styles.logoContainer}>
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.1)']}
                style={styles.logoGradientBorder}
              >
                <Image
                  source={{ uri: brand.logo }}
                  style={styles.logoImage}
                  resizeMode="contain"
                />
              </LinearGradient>
            </View>

            <Text style={styles.brandName}>{brand.name}</Text>
            <Text style={styles.description}>{brand.description}</Text>
            
            {/* Enhanced Details Container */}
            <View style={styles.detailsContainer}>
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.05)']}
                style={styles.detailsGradient}
              >
                <Text style={styles.sectionTitle}>About</Text>
                <Text style={styles.fullDescription}>{brand.fullDescription}</Text>
                
                <View style={styles.infoSection}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Founded</Text>
                    <Text style={styles.infoValue}>{brand.founded}</Text>
                  </View>
                  
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Headquarters</Text>
                    <Text style={styles.infoValue}>{brand.headquarters}</Text>
                  </View>
                  
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Category</Text>
                    <Text style={styles.infoValue}>{brand.category}</Text>
                  </View>
                </View>
              </LinearGradient>
            </View>
            
            {/* Enhanced Follow Button */}
            <TouchableOpacity onPress={handleFollow} style={styles.followButton}>
              <LinearGradient
                colors={following ? 
                  ['rgba(229, 62, 62, 0.9)', 'rgba(252, 129, 129, 0.9)'] : 
                  ['rgba(56, 161, 105, 0.9)', 'rgba(104, 211, 145, 0.9)']
                }
                style={styles.followButtonGradient}
              >
                <Text style={styles.followButtonText}>
                  {following ? '✓ Following' : '+ Follow'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
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
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.6,
  },
  safeArea: {
    flex: 1,
  },
  headerBar: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    alignSelf: 'flex-start',
    borderRadius: 25,
    overflow: 'hidden',
  },
  backButtonGradient: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  backButtonText: {
    fontSize: 16,
    color: COLORS.white,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 25,
    borderRadius: 70,
    overflow: 'hidden',
  },
  logoGradientBorder: {
    width: 130,
    height: 130,
    borderRadius: 65,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    backgroundColor: 'white',
  },
  logoImage: {
    width: 90,
    height: 90,
  },
  brandName: {
    fontSize: 34,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 18,
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 35,
    opacity: 0.9,
    fontWeight: '500',
    lineHeight: 24,
  },
  detailsContainer: {
    borderRadius: 25,
    marginBottom: 35,
    width: '100%',
    overflow: 'hidden',
  },
  detailsGradient: {
    padding: 28,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 18,
  },
  fullDescription: {
    fontSize: 16,
    color: COLORS.white,
    lineHeight: 26,
    marginBottom: 24,
    opacity: 0.9,
  },
  infoSection: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    paddingTop: 24,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
    paddingVertical: 4,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
    flex: 1,
  },
  infoValue: {
    fontSize: 16,
    color: COLORS.white,
    opacity: 0.85,
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  followButton: {
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
  },
  followButtonGradient: {
    paddingVertical: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  followButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.white,
    letterSpacing: 0.5,
  },
});