import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HomeScreen } from '../screens/main/HomeScreen';
import { OrdersScreen } from '../screens/main/OrdersScreen';
import { ShopsScreen } from '../screens/main/ShopsScreen';
import { ProfileScreen } from '../screens/main/ProfileScreen';
import { HelpCentreScreen } from '../screens/main/HelpCentreScreen';
import { useLanguage } from '../context/LanguageContext';

import { colors } from '../theme/colors';
import { Home, FileText, ShoppingCart, Headset, User } from 'lucide-react-native';

export type MainTabType = 'HOME' | 'ORDERS' | 'SHOPS' | 'HELP' | 'PROFILE';

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
  const { t } = useLanguage();
  const bottomPadding = Math.max(insets.bottom, 10);

  const activeColor = '#FF5500';
  const inactiveColor = '#64748B';

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
        {currentTab === 'HELP' && <HelpCentreScreen />}

        {currentTab === 'PROFILE' && (
          <ProfileScreen
            onEditProfile={onNavigateToEditProfile}
            onManageShops={() => onTabChange('SHOPS')}
            onViewRequirements={onNavigateToRequirements}
            onViewNotifications={onNavigateToNotifications}
          />

        )}
      </View>

      {/* Modern Curved Floating Bottom Navigation Bar */}
      <View style={[styles.bottomBarContainer, { paddingBottom: bottomPadding }]}>
        {/* Tab 1: Home */}
        <TouchableOpacity
          style={styles.tabItem}
          activeOpacity={0.8}
          onPress={() => onTabChange('HOME')}
        >
          <Home
            size={24}
            color={currentTab === 'HOME' ? activeColor : inactiveColor}
          />
          <Text style={[styles.tabLabel, currentTab === 'HOME' && styles.activeTabLabel]}>
            {t('home')}
          </Text>
        </TouchableOpacity>

        {/* Tab 2: Orders */}
        <TouchableOpacity
          style={styles.tabItem}
          activeOpacity={0.8}
          onPress={() => onTabChange('ORDERS')}
        >
          <FileText
            size={24}
            color={currentTab === 'ORDERS' ? activeColor : inactiveColor}
          />
          <Text style={[styles.tabLabel, currentTab === 'ORDERS' && styles.activeTabLabel]}>
            {t('orders')}
          </Text>
        </TouchableOpacity>

        {/* Central Floating Buy Now Button */}
        <View style={styles.centerButtonWrapper}>
          <TouchableOpacity
            style={styles.floatingBuyBtn}
            activeOpacity={0.88}
            onPress={onNavigateToBuy}
          >
            <ShoppingCart size={24} color="#FFFFFF" />
            <Text style={styles.floatingBuyBtnText}>{t('buyNow')}</Text>
          </TouchableOpacity>
        </View>

        {/* Tab 3: Help Centre */}
        <TouchableOpacity
          style={styles.tabItem}
          activeOpacity={0.8}
          onPress={() => onTabChange('HELP')}
        >
          <Headset
            size={24}
            color={currentTab === 'HELP' ? activeColor : inactiveColor}
          />
          <Text style={[styles.tabLabel, currentTab === 'HELP' && styles.activeTabLabel]}>
            {t('helpCentre')}
          </Text>
        </TouchableOpacity>

        {/* Tab 4: Profile */}
        <TouchableOpacity
          style={styles.tabItem}
          activeOpacity={0.8}
          onPress={() => onTabChange('PROFILE')}
        >
          <User
            size={24}
            color={currentTab === 'PROFILE' ? activeColor : inactiveColor}
          />
          <Text style={[styles.tabLabel, currentTab === 'PROFILE' && styles.activeTabLabel]}>
            {t('profile')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  content: {
    flex: 1,
  },
  bottomBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 4,
  },
  activeTabLabel: {
    color: '#FF5500',
    fontWeight: '800',
  },
  centerButtonWrapper: {
    flex: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -30,
  },
  floatingBuyBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FF5500',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF5500',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  floatingBuyBtnText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
    marginTop: 1,
  },
});

