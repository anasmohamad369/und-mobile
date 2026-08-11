import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthContext } from '../../context/AuthContext';
import { useShopContext } from '../../context/ShopContext';
import { colors } from '../../theme/colors';
import { MapPin, ChevronDown, Bell } from 'lucide-react-native';

interface HeaderProps {
  onNotificationPress?: () => void;
  unreadNotifications?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onNotificationPress, unreadNotifications = true }) => {
  const insets = useSafeAreaInsets();
  const { retailer } = useAuthContext();
  const { selectedShop, setSelectorModalVisible } = useShopContext();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 14) }]}>
      <View style={styles.topRow}>
        <View style={styles.greetingCol}>
          <Text style={styles.greetingText}>
            {getGreeting()}, {retailer?.ownerName || 'Retailer'}
          </Text>
          <Text style={styles.businessNameText}>{retailer?.businessName || 'NutriFarm Chicken Traders'}</Text>
        </View>

        {onNotificationPress && (
          <TouchableOpacity style={styles.bellButton} onPress={onNotificationPress} activeOpacity={0.7}>
            <Bell size={22} color={colors.gray800} />
            {unreadNotifications && <View style={styles.unreadDot} />}
          </TouchableOpacity>
        )}
      </View>

      {/* Shop Selector Pill */}
      <View style={styles.selectorWrapper}>
        <Text style={styles.deliveringLabel}>Delivering To</Text>
        <TouchableOpacity
          style={styles.shopSelectorPill}
          activeOpacity={0.8}
          onPress={() => setSelectorModalVisible(true)}
        >
          <MapPin size={16} color={colors.primary} style={{ marginRight: 6 }} />
          <Text style={styles.shopNameText} numberOfLines={1}>
            {selectedShop ? selectedShop.name : 'Select Shop'}
          </Text>
          <ChevronDown size={18} color={colors.gray700} style={{ marginLeft: 4 }} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  greetingCol: {
    flex: 1,
  },
  greetingText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.gray500,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  businessNameText: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.gray900,
    marginTop: 2,
  },
  bellButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  selectorWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.gray50,
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  deliveringLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.gray500,
  },
  shopSelectorPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  shopNameText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.gray900,
    maxWidth: 160,
  },
});
