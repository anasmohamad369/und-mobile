import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HomeScreen } from '../screens/main/HomeScreen';
import { OrdersScreen } from '../screens/main/OrdersScreen';
import { ShopsScreen } from '../screens/main/ShopsScreen';
import { ProfileScreen } from '../screens/main/ProfileScreen';
import { colors } from '../theme/colors';
import { Home, ShoppingBag, Store, User } from 'lucide-react-native';

export type MainTabType = 'HOME' | 'ORDERS' | 'SHOPS' | 'PROFILE';

interface MainTabNavigatorProps {
  currentTab: MainTabType;
  onTabChange: (tab: MainTabType) => void;
  onNavigateToBuy: () => void;
  onNavigateToOrderTracking: (orderId: string) => void;
  onNavigateToRequirements: () => void;
  onNavigateToAddRequirement: () => void;
  onNavigateToAddShop: () => void;
  onNavigateToNotifications: () => void;
  onNavigateToEditProfile: () => void;
}

export const MainTabNavigator: React.FC<MainTabNavigatorProps> = ({
  currentTab,
  onTabChange,
  onNavigateToBuy,
  onNavigateToOrderTracking,
  onNavigateToRequirements,
  onNavigateToAddRequirement,
  onNavigateToAddShop,
  onNavigateToNotifications,
  onNavigateToEditProfile,
}) => {
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, 12);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {currentTab === 'HOME' && (
          <HomeScreen
            onNavigateToBuy={onNavigateToBuy}
            onNavigateToOrders={() => onTabChange('ORDERS')}
            onNavigateToOrderTracking={onNavigateToOrderTracking}
            onNavigateToRequirements={onNavigateToRequirements}
            onNavigateToAddRequirement={onNavigateToAddRequirement}
            onNavigateToAddShop={onNavigateToAddShop}
            onNavigateToNotifications={onNavigateToNotifications}
          />
        )}
        {currentTab === 'ORDERS' && (
          <OrdersScreen onSelectOrder={onNavigateToOrderTracking} />
        )}
        {currentTab === 'SHOPS' && <ShopsScreen onAddShop={onNavigateToAddShop} />}
        {currentTab === 'PROFILE' && (
          <ProfileScreen
            onEditProfile={onNavigateToEditProfile}
            onManageShops={() => onTabChange('SHOPS')}
            onViewRequirements={onNavigateToRequirements}
            onViewNotifications={onNavigateToNotifications}
          />
        )}
      </View>

      {/* Seamless Edge-to-Edge Bottom Navigation Bar */}
      <View style={[styles.bottomBar, { paddingBottom: bottomPadding }]}>
        <TouchableOpacity
          style={styles.tabItem}
          activeOpacity={0.8}
          onPress={() => onTabChange('HOME')}
        >
          <View style={[styles.iconWrapper, currentTab === 'HOME' && styles.activeIconWrapper]}>
            <Home
              size={22}
              color={currentTab === 'HOME' ? colors.primary : '#64748B'}
            />
          </View>
          <Text style={[styles.tabLabel, currentTab === 'HOME' && styles.activeTabLabel]}>
            Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          activeOpacity={0.8}
          onPress={() => onTabChange('ORDERS')}
        >
          <View style={[styles.iconWrapper, currentTab === 'ORDERS' && styles.activeIconWrapper]}>
            <ShoppingBag
              size={22}
              color={currentTab === 'ORDERS' ? colors.primary : '#64748B'}
            />
          </View>
          <Text style={[styles.tabLabel, currentTab === 'ORDERS' && styles.activeTabLabel]}>
            Orders
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          activeOpacity={0.8}
          onPress={() => onTabChange('SHOPS')}
        >
          <View style={[styles.iconWrapper, currentTab === 'SHOPS' && styles.activeIconWrapper]}>
            <Store
              size={22}
              color={currentTab === 'SHOPS' ? colors.primary : '#64748B'}
            />
          </View>
          <Text style={[styles.tabLabel, currentTab === 'SHOPS' && styles.activeTabLabel]}>
            Shops
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          activeOpacity={0.8}
          onPress={() => onTabChange('PROFILE')}
        >
          <View style={[styles.iconWrapper, currentTab === 'PROFILE' && styles.activeIconWrapper]}>
            <User
              size={22}
              color={currentTab === 'PROFILE' ? colors.primary : '#64748B'}
            />
          </View>
          <Text style={[styles.tabLabel, currentTab === 'PROFILE' && styles.activeTabLabel]}>
            Profile
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  bottomBar: {
    flexDirection: 'row',
    paddingTop: 10,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  activeIconWrapper: {
    backgroundColor: colors.primaryLight,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 4,
  },
  activeTabLabel: {
    color: colors.primary,
    fontWeight: '800',
  },
});
