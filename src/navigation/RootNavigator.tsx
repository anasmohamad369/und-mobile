import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthContext } from '../context/AuthContext';
import { useNotificationContext } from '../context/NotificationContext';
import { useShopContext } from '../context/ShopContext';
import { AuthNavigator } from './AuthNavigator';
import { MainTabNavigator, MainTabType } from './MainTabNavigator';
import { BuyChickenScreen } from '../screens/purchase/BuyChickenScreen';
import { DeliverySelectionScreen } from '../screens/purchase/DeliverySelectionScreen';
import { OrderReviewScreen } from '../screens/purchase/OrderReviewScreen';
import { PaymentScreen } from '../screens/purchase/PaymentScreen';
import { OrderConfirmationScreen } from '../screens/purchase/OrderConfirmationScreen';
import { OrderTrackingScreen } from '../screens/orders/OrderTrackingScreen';
import { AddRequirementScreen } from '../screens/requirements/AddRequirementScreen';
import { RequirementsListScreen } from '../screens/requirements/RequirementsListScreen';
import { AddShopScreen } from '../screens/shops/AddShopScreen';
import { EditProfileScreen } from '../screens/profile/EditProfileScreen';
import { NotificationsScreen } from '../screens/profile/NotificationsScreen';
import { ShopSelectorModal } from '../components/home/ShopSelectorModal';
import { OfflineBanner } from '../components/common/OfflineBanner';
import { colors } from '../theme/colors';
import { Order, PaymentInitiation } from '../types';
import { ArrowLeft, Bell, AlertTriangle } from 'lucide-react-native';

type ScreenState =
  | { name: 'TABS' }
  | { name: 'BUY_CHICKEN' }
  | { name: 'DELIVERY_SELECTION'; quantityKg: number; ratePerKg: number }
  | { name: 'ORDER_REVIEW'; quantityKg: number; ratePerKg: number; deliveryDate: string; deliverySlot: string }
  | { name: 'PAYMENT'; order: Order; payment: PaymentInitiation }
  | { name: 'ORDER_CONFIRMATION'; order: Order }
  | { name: 'ORDER_TRACKING'; orderId: string }
  | { name: 'ADD_REQUIREMENT' }
  | { name: 'REQUIREMENTS_LIST' }
  | { name: 'ADD_SHOP' }
  | { name: 'EDIT_PROFILE' }
  | { name: 'NOTIFICATIONS' };

export const RootNavigator: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { isAuthenticated, isLoading } = useAuthContext();
  const { toast, hideToast } = useNotificationContext();
  const { setSelectorModalVisible } = useShopContext();

  const [currentTab, setCurrentTab] = useState<MainTabType>('HOME');
  const [screen, setScreen] = useState<ScreenState>({ name: 'TABS' });

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading Retailer App...</Text>
      </View>
    );
  }

  if (!isAuthenticated) {
    return <AuthNavigator />;
  }

  const handleBackToTabs = () => setScreen({ name: 'TABS' });

  const renderHeaderBar = (title: string, onBack: () => void) => (
    <View style={[styles.headerBar, { paddingTop: Math.max(insets.top, 14) }]}>
      <TouchableOpacity style={styles.backBtn} activeOpacity={0.7} onPress={onBack}>
        <ArrowLeft size={22} color={colors.gray900} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{title}</Text>
      <View style={{ width: 36 }} />
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Toast Alert Notification Banner */}
      {toast && (
        <TouchableOpacity style={styles.toastBanner} activeOpacity={0.9} onPress={hideToast}>
          <AlertTriangle size={18} color={colors.accent} style={{ marginRight: 10 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.toastTitle}>{toast.title}</Text>
            <Text style={styles.toastMsg}>{toast.message}</Text>
          </View>
        </TouchableOpacity>
      )}

      <OfflineBanner isOffline={false} />

      {screen.name === 'TABS' && (
        <MainTabNavigator
          currentTab={currentTab}
          onTabChange={setCurrentTab}
          onNavigateToBuy={() => setScreen({ name: 'BUY_CHICKEN' })}
          onNavigateToOrderTracking={(orderId) => setScreen({ name: 'ORDER_TRACKING', orderId })}
          onNavigateToRequirements={() => setScreen({ name: 'REQUIREMENTS_LIST' })}
          onNavigateToAddRequirement={() => setScreen({ name: 'ADD_REQUIREMENT' })}
          onNavigateToAddShop={() => setScreen({ name: 'ADD_SHOP' })}
          onNavigateToNotifications={() => setScreen({ name: 'NOTIFICATIONS' })}
          onNavigateToEditProfile={() => setScreen({ name: 'EDIT_PROFILE' })}
        />
      )}

      {screen.name === 'BUY_CHICKEN' && (
        <View style={{ flex: 1 }}>
          {renderHeaderBar('Buy Chicken', handleBackToTabs)}
          <BuyChickenScreen
            onContinueToDelivery={(quantityKg, ratePerKg) =>
              setScreen({ name: 'DELIVERY_SELECTION', quantityKg, ratePerKg })
            }
          />
        </View>
      )}

      {screen.name === 'DELIVERY_SELECTION' && (
        <View style={{ flex: 1 }}>
          {renderHeaderBar('Delivery Details', () => setScreen({ name: 'BUY_CHICKEN' }))}
          <DeliverySelectionScreen
            quantityKg={screen.quantityKg}
            ratePerKg={screen.ratePerKg}
            onChangeShop={() => setSelectorModalVisible(true)}
            onProceedToReview={(deliveryDate, deliverySlot) =>
              setScreen({
                name: 'ORDER_REVIEW',
                quantityKg: screen.quantityKg,
                ratePerKg: screen.ratePerKg,
                deliveryDate,
                deliverySlot,
              })
            }
          />
        </View>
      )}

      {screen.name === 'ORDER_REVIEW' && (
        <View style={{ flex: 1 }}>
          {renderHeaderBar(
            'Review Order',
            () =>
              setScreen({
                name: 'DELIVERY_SELECTION',
                quantityKg: screen.quantityKg,
                ratePerKg: screen.ratePerKg,
              })
          )}
          <OrderReviewScreen
            quantityKg={screen.quantityKg}
            ratePerKg={screen.ratePerKg}
            deliveryDate={screen.deliveryDate}
            deliverySlot={screen.deliverySlot}
            onProceedToPayment={(order, payment) => setScreen({ name: 'PAYMENT', order, payment })}
          />
        </View>
      )}

      {screen.name === 'PAYMENT' && (
        <View style={{ flex: 1 }}>
          {renderHeaderBar('Payment Gateway', () => setScreen({ name: 'BUY_CHICKEN' }))}
          <PaymentScreen
            order={screen.order}
            payment={screen.payment}
            onPaymentSuccess={(confirmedOrder) =>
              setScreen({ name: 'ORDER_CONFIRMATION', order: confirmedOrder })
            }
          />
        </View>
      )}

      {screen.name === 'ORDER_CONFIRMATION' && (
        <View style={{ flex: 1 }}>
          <OrderConfirmationScreen
            order={screen.order}
            onTrackOrder={(orderId) => setScreen({ name: 'ORDER_TRACKING', orderId })}
            onReturnHome={handleBackToTabs}
          />
        </View>
      )}

      {screen.name === 'ORDER_TRACKING' && (
        <View style={{ flex: 1 }}>
          {renderHeaderBar('Order Tracking', handleBackToTabs)}
          <OrderTrackingScreen orderId={screen.orderId} />
        </View>
      )}

      {screen.name === 'ADD_REQUIREMENT' && (
        <View style={{ flex: 1 }}>
          {renderHeaderBar('Add Requirement', handleBackToTabs)}
          <AddRequirementScreen onSuccess={() => setScreen({ name: 'REQUIREMENTS_LIST' })} />
        </View>
      )}

      {screen.name === 'REQUIREMENTS_LIST' && (
        <View style={{ flex: 1 }}>
          {renderHeaderBar('Expected Requirements', handleBackToTabs)}
          <RequirementsListScreen onAddRequirement={() => setScreen({ name: 'ADD_REQUIREMENT' })} />
        </View>
      )}

      {screen.name === 'ADD_SHOP' && (
        <View style={{ flex: 1 }}>
          {renderHeaderBar('Add New Shop', handleBackToTabs)}
          <AddShopScreen onSuccess={handleBackToTabs} />
        </View>
      )}

      {screen.name === 'EDIT_PROFILE' && (
        <View style={{ flex: 1 }}>
          {renderHeaderBar('Edit Profile', handleBackToTabs)}
          <EditProfileScreen onSuccess={handleBackToTabs} />
        </View>
      )}

      {screen.name === 'NOTIFICATIONS' && (
        <View style={{ flex: 1 }}>
          {renderHeaderBar('Notifications', handleBackToTabs)}
          <NotificationsScreen />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.gray700,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.gray900,
  },
  toastBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 2,
    borderBottomColor: colors.accent,
  },
  toastTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.accent,
  },
  toastMsg: {
    fontSize: 12,
    color: colors.textWhite,
    marginTop: 2,
  },
});
