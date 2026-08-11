import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { colors } from '../../theme/colors';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../../assets/nutrifarm-logo.jpg')}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.title}>NutriFarm Chicken</Text>
      <Text style={styles.tagline}>A Fresh & Healthy Chicken</Text>

      <View style={styles.loaderBox}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading Wholesale Network...</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  logoContainer: {
    width: 220,
    height: 180,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#0F5132', // NutriFarm Forest Green
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 16,
    color: '#D97706', // NutriFarm Gold
    marginTop: 6,
    fontWeight: '700',
    fontStyle: 'italic',
  },
  loaderBox: {
    position: 'absolute',
    bottom: 50,
    alignItems: 'center',
  },
  loadingText: {
    color: colors.gray500,
    fontSize: 13,
    marginTop: 10,
    fontWeight: '600',
  },
});
