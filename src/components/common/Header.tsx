import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthContext } from '../../context/AuthContext';
import { useShopContext } from '../../context/ShopContext';
import { useLanguage } from '../../context/LanguageContext';
import { colors } from '../../theme/colors';
import { MapPin, ChevronDown, Bell, Globe } from 'lucide-react-native';

interface HeaderProps {
  onNotificationPress?: () => void;
  unreadNotifications?: boolean;
  selectedCircleName?: string;
  onOpenCircleModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onNotificationPress,
  unreadNotifications = true,
  selectedCircleName,
  onOpenCircleModal,
}) => {
  const insets = useSafeAreaInsets();
  const { retailer } = useAuthContext();
  const { selectedShop, setSelectorModalVisible } = useShopContext();
  const { language, setLanguageModalVisible, t } = useLanguage();

  const getGreetingKey = (): 'goodMorning' | 'goodAfternoon' | 'goodEvening' => {
    const hour = new Date().getHours();
    if (hour < 12) return 'goodMorning';
    if (hour < 17) return 'goodAfternoon';
    return 'goodEvening';
  };

  const handleLocationPress = () => {
    if (onOpenCircleModal) {
      onOpenCircleModal();
    } else {
      setSelectorModalVisible(true);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 10) }]}>
      {/* Top Header Row with Transparent Logo, Language Selector, and User Profile */}
      <View style={styles.topBar}>
        <Image
          source={require('../../../assets/logo.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />

        <View style={styles.topRightActions}>
          {/* Language Switcher Pill */}
          <TouchableOpacity
            style={styles.langPill}
            activeOpacity={0.8}
            onPress={() => setLanguageModalVisible(true)}
          >
            <Globe size={14} color="#0A5D36" style={{ marginRight: 4 }} />
            <Text style={styles.langPillText}>
              {language === 'te' ? 'తెలుగు' : 'EN'}
            </Text>
            <ChevronDown size={14} color={colors.gray700} style={{ marginLeft: 2 }} />
          </TouchableOpacity>

          {onNotificationPress && (
            <TouchableOpacity style={styles.bellButton} onPress={onNotificationPress} activeOpacity={0.7}>
              <Bell size={18} color={colors.gray800} />
              {unreadNotifications && (
                <View style={styles.badgeCount}>
                  <Text style={styles.badgeCountText}>3</Text>
                </View>
              )}
            </TouchableOpacity>
          )}

          {/* User Profile Avatar with Dropdown */}
          <TouchableOpacity style={styles.profileWrapper} activeOpacity={0.8}>
            <Image
              source={require('../../../assets/avatar-raj.png')}
              style={styles.avatarImage}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Greeting and Hero Illustration Section */}
      <View style={styles.heroSection}>
        <View style={styles.greetingContent}>
          <Text style={styles.greetingTitle}>
            {t(getGreetingKey())}, {retailer?.ownerName || 'Raj'}! 👋
          </Text>
          <Text style={styles.businessSubtitle}>
            {retailer?.businessName || 'Raj Chicken Center'}
          </Text>

          {/* Location Selector */}
          <TouchableOpacity
            style={styles.locationSelector}
            activeOpacity={0.8}
            onPress={handleLocationPress}
          >
            <MapPin size={16} color={colors.secondary} style={{ marginRight: 4 }} />
            <Text style={styles.locationText} numberOfLines={1}>
              {selectedCircleName || (selectedShop ? selectedShop.name : 'Gokavaram Circle')}
            </Text>
            <ChevronDown size={16} color={colors.gray700} style={{ marginLeft: 2 }} />
          </TouchableOpacity>
        </View>

        {/* Hero Farm Chicken Illustration */}
        <Image
          source={require('../../../assets/hero-farm-chicken.png')}
          style={styles.heroImage}
          resizeMode="cover"
        />
      </View>
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  logoImage: {
    width: 155,
    height: 48,
  },
  topRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  langPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  langPillText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0A5D36',
  },
  bellButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },

  badgeCount: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
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
  heroSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 85,
    position: 'relative',
    marginTop: 4,
  },
  greetingContent: {
    flex: 1,
    paddingRight: 8,
    zIndex: 2,
  },
  greetingTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.gray900,
    letterSpacing: -0.3,
  },
  businessSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray600,
    marginTop: 2,
  },
  locationSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  locationText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.gray800,
  },
  heroImage: {
    width: 140,
    height: 90,
    borderRadius: 12,
  },
});

