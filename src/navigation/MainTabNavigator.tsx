import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
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

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.tabItem}
          activeOpacity={0.8}
          onPress={() => onTabChange('HOME')}
        >
          <Home
            size={22}
            color={currentTab === 'HOME' ? colors.primary : colors.gray500}
          />
          <Text style={[styles.tabLabel, currentTab === 'HOME' && styles.activeTabLabel]}>
            Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          activeOpacity={0.8}
          onPress={() => onTabChange('ORDERS')}
        >
          <ShoppingBag
            size={22}
            color={currentTab === 'ORDERS' ? colors.primary : colors.gray500}
          />
          <Text style={[styles.tabLabel, currentTab === 'ORDERS' && styles.activeTabLabel]}>
            Orders
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          activeOpacity={0.8}
          onPress={() => onTabChange('SHOPS')}
        >
          <Store
            size={22}
            color={currentTab === 'SHOPS' ? colors.primary : colors.gray500}
          />
          <Text style={[styles.tabLabel, currentTab === 'SHOPS' && styles.activeTabLabel]}>
            Shops
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          activeOpacity={0.8}
          onPress={() => onTabChange('PROFILE')}
        >
          <User
            size={22}
            color={currentTab === 'PROFILE' ? colors.primary : colors.gray500}
          />
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
    height: 64,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.gray500,
    marginTop: 3,
  },
  activeTabLabel: {
    color: colors.primary,
    fontWeight: '800',
  },
});
