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
import { Home, FileText, Headset, User } from 'lucide-react-native';

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

  const activeColor = colors.primary;
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

      {/* Modern Bottom Navigation Bar */}
      <View style={[styles.bottomBarContainer, { paddingBottom: bottomPadding }]}>
        {/* Tab 1: Home */}
        <TouchableOpacity
          style={styles.tabItem}
          activeOpacity={0.7}
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
          activeOpacity={0.7}
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

        {/* Tab 3: Help Centre */}
        <TouchableOpacity
          style={styles.tabItem}
          activeOpacity={0.7}
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
          activeOpacity={0.7}
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
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 10,
    paddingHorizontal: 8,
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
    paddingVertical: 6,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 4,
    textAlign: 'center',
  },
  activeTabLabel: {
    color: colors.primary,
    fontWeight: '800',
  },
});


