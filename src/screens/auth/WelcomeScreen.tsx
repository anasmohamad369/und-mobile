import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Button } from '../../components/common/Button';
import { colors } from '../../theme/colors';
import { ArrowRight } from 'lucide-react-native';

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onGetStarted }) => {
  return (
    <View style={styles.container}>
      <View style={styles.heroBox}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../../assets/nutrifarm-logo.jpg')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.title}>Welcome to NutriFarm</Text>
        <Text style={styles.subTagline}>A Fresh & Healthy Chicken</Text>
        <Text style={styles.description}>
          Buy fresh chicken directly through our wholesale farm supply network at live daily market rates.
        </Text>
      </View>

      <View style={styles.footer}>
        <Button
          title="Get Started"
          variant="primary"
          size="lg"
          icon={<ArrowRight size={20} color={colors.textWhite} />}
          onPress={onGetStarted}
          style={styles.mainBtn}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: 24,
    justifyContent: 'space-between',
  },
  heroBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  logoContainer: {
    width: 200,
    height: 160,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0F5132', // NutriFarm Forest Green
    textAlign: 'center',
    lineHeight: 34,
  },
  subTagline: {
    fontSize: 15,
    fontWeight: '700',
    color: '#D97706', // NutriFarm Amber Gold
    textAlign: 'center',
    marginTop: 4,
    fontStyle: 'italic',
  },
  description: {
    fontSize: 15,
    color: colors.gray600,
    textAlign: 'center',
    marginTop: 14,
    lineHeight: 22,
  },
  footer: {
    paddingBottom: 20,
  },
  mainBtn: {
    marginBottom: 10,
  },
});
