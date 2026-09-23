import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthContext } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { ChevronDown, Bell } from 'lucide-react-native';

interface HeaderProps {
  onNotificationPress?: () => void;
  unreadNotifications?: boolean;
  selectedCircleName?: string;
  onOpenCircleModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onNotificationPress,
  unreadNotifications = true,
}) => {
  const insets = useSafeAreaInsets();
  const { retailer } = useAuthContext();
  const { t } = useLanguage();

  const getGreetingKey = (): 'goodMorning' | 'goodAfternoon' | 'goodEvening' => {
    const hour = new Date().getHours();
    if (hour < 12) return 'goodMorning';
    if (hour < 17) return 'goodAfternoon';
    return 'goodEvening';
  };

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top + 8, 22) }]}>
      {/* Top Bar with NutriFarm Brand Logo, Notification Bell, and User Profile Avatar */}
      <View style={styles.topBar}>
        {/* NutriFarm Brand Logo matching reference design */}
        <View style={styles.logoWrapper}>
          <View style={styles.logoTitleRow}>
            <Text style={styles.logoNutri}>Nutri</Text>
            <Text style={styles.logoFarm}>Farm</Text>
          </View>
          <View style={styles.logoChickenRow}>
            <View style={styles.logoLine} />
            <Text style={styles.logoChickenText}>CHICKEN</Text>
            <View style={styles.logoLine} />
          </View>
          <View style={styles.logoTaglineRow}>
            <Text style={styles.logoLeaf}>🍃</Text>
            <Text style={styles.logoTaglineText}>A Fresh & Healthy Chicken</Text>
            <Text style={styles.logoLeaf}>🍃</Text>
          </View>
        </View>

        <View style={styles.topRightActions}>
          {/* Notification Bell Button with Red Badge */}
          <TouchableOpacity
            style={styles.bellButton}
            onPress={onNotificationPress}
            activeOpacity={0.7}
          >
            <Bell size={20} color="#1E293B" />
            {unreadNotifications && (
              <View style={styles.badgeCount}>
                <Text style={styles.badgeCountText}>3</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Circular User Profile Avatar with Dropdown Arrow */}
          <TouchableOpacity style={styles.profileWrapper} activeOpacity={0.8}>
            <Image
              source={require('../../../assets/avatar-raj.png')}
              style={styles.avatarImage}
            />
            <ChevronDown size={14} color="#334155" style={styles.profileChevron} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Hero Section with Greeting Text & Farm Hen Background Image */}
      <View style={styles.heroSection}>
        {/* Right-aligned Farm Hen Landscape Image with smooth fade into background */}
        <View style={styles.farmImageWrapper}>
          <Image
            source={require('../../../assets/hero-farm-chicken.png')}
            style={styles.farmHenImage}
            resizeMode="cover"
          />

          {/* Smooth multi-stop gradient mask for seamless left edge fade */}
          <View style={styles.fadeContainer}>
            <View style={[styles.fadeSlice, { opacity: 1.0 }]} />
            <View style={[styles.fadeSlice, { opacity: 0.85 }]} />
            <View style={[styles.fadeSlice, { opacity: 0.65 }]} />
            <View style={[styles.fadeSlice, { opacity: 0.45 }]} />
            <View style={[styles.fadeSlice, { opacity: 0.25 }]} />
            <View style={[styles.fadeSlice, { opacity: 0.1 }]} />
          </View>
        </View>

        {/* Left Hero Text Content */}
        <View style={styles.greetingContent}>
          {/* Greeting Title with Waving Hand Emoji */}
          <Text style={styles.greetingTitle}>
            {t(getGreetingKey())}, {retailer?.ownerName || 'Raj'}! 👋
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF9F4',
    marginHorizontal: -16,
    paddingHorizontal: 16,
    paddingBottom: 6,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  logoWrapper: {
    justifyContent: 'center',
  },
  logoTitleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  logoNutri: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FF5500',
    letterSpacing: -0.5,
  },
  logoFarm: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0A5D36',
    letterSpacing: -0.5,
  },
  logoChickenRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -2,
  },
  logoLine: {
    flex: 1,
    height: 1.5,
    backgroundColor: '#0A5D36',
    marginHorizontal: 2,
  },
  logoChickenText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#0A5D36',
    letterSpacing: 2.5,
  },
  logoTaglineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 1,
  },
  logoLeaf: {
    fontSize: 8,
    marginHorizontal: 1,
  },
  logoTaglineText: {
    fontSize: 8,
    fontWeight: '700',
    color: '#0A5D36',
  },
  topRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  bellButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F3E8E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeCount: {
    position: 'absolute',
    top: 2,
    right: 2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeCountText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  profileWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarImage: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  profileChevron: {
    marginLeft: 3,
  },
  heroSection: {
    position: 'relative',
    height: 95,
    justifyContent: 'center',
    marginTop: 4,
  },
  farmImageWrapper: {
    position: 'absolute',
    right: -16,
    top: 0,
    bottom: 0,
    width: '65%',
  },
  farmHenImage: {
    width: '100%',
    height: '100%',
  },
  fadeContainer: {
    flexDirection: 'row',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 75,
  },
  fadeSlice: {
    flex: 1,
    backgroundColor: '#FFF9F4',
  },
  greetingContent: {
    zIndex: 2,
    maxWidth: '55%',
  },
  greetingTitle: {
    fontSize: 21,
    fontWeight: '600',
    color: '#0F172A',
    letterSpacing: -0.4,
  },
});
