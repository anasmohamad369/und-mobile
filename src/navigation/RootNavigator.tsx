import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthContext } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LanguageModal } from '../components/common/LanguageModal';
import { AuthNavigator } from './AuthNavigator';
import { MainTabNavigator, MainTabType } from './MainTabNavigator';
import { Step1QuantityScreen } from '../screens/purchase/Step1QuantityScreen';
import { Step2DeliveryDateScreen } from '../screens/purchase/Step2DeliveryDateScreen';
import { Step3OrderSummaryScreen } from '../screens/purchase/Step3OrderSummaryScreen';
import { Step4PaymentOptionScreen } from '../screens/purchase/Step4PaymentOptionScreen';
import { Step5ConfirmOrderScreen } from '../screens/purchase/Step5ConfirmOrderScreen';
import { OrderConfirmationScreen } from '../screens/purchase/OrderConfirmationScreen';
import { OrderTrackingScreen } from '../screens/orders/OrderTrackingScreen';
import { AddRequirementScreen } from '../screens/requirements/AddRequirementScreen';
import { RequirementsListScreen } from '../screens/requirements/RequirementsListScreen';
import { AddShopScreen } from '../screens/shops/AddShopScreen';
import { EditProfileScreen } from '../screens/profile/EditProfileScreen';
import { NotificationsScreen } from '../screens/profile/NotificationsScreen';
import { OfflineBanner } from '../components/common/OfflineBanner';
import { colors } from '../theme/colors';
import { ArrowLeft } from 'lucide-react-native';
import { REGIONAL_CIRCLES, CircleRate } from '../data/circlesData';

type ScreenState =
  | { name: 'TABS' }
  | { name: 'STEP_1_QUANTITY'; selectedCircle: CircleRate; quantityKg?: number }
  | { name: 'STEP_2_DATE'; selectedCircle: CircleRate; quantityKg: number; deliveryDate?: string }
  | { name: 'STEP_3_SUMMARY'; selectedCircle: CircleRate; quantityKg: number; deliveryDate: string }
  | { name: 'STEP_4_PAYMENT'; selectedCircle: CircleRate; quantityKg: number; deliveryDate: string; paymentOption?: 'ONLINE' | 'COD' }
  | { name: 'STEP_5_CONFIRM'; selectedCircle: CircleRate; quantityKg: number; deliveryDate: string; paymentOption: 'ONLINE' | 'COD' }
  | { name: 'ORDER_CONFIRMATION'; orderData: { id: string; quantityKg: number; finalAmount: number; deliveryDate: string; paymentMethod: string } }
  | { name: 'ORDER_TRACKING'; orderId: string }
  | { name: 'ADD_REQUIREMENT' }
  | { name: 'REQUIREMENTS_LIST' }
  | { name: 'ADD_SHOP' }
  | { name: 'EDIT_PROFILE' }
  | { name: 'NOTIFICATIONS' };

export const RootNavigator: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { isAuthenticated, isLoading } = useAuthContext();
  const { isLanguageModalVisible, setLanguageModalVisible } = useLanguage();

  const [currentTab, setCurrentTab] = useState<MainTabType>('HOME');
  const [selectedCircle] = useState<CircleRate>(REGIONAL_CIRCLES[0]);
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

  const renderStepHeader = (stepNum: number, onBack: () => void) => (
    <View style={[styles.stepHeaderBar, { paddingTop: Math.max(insets.top + 6, 18) }]}>
      <TouchableOpacity style={styles.stepBackBtn} activeOpacity={0.7} onPress={onBack}>
        <ArrowLeft size={20} color={colors.gray900} />
      </TouchableOpacity>
      <View style={styles.stepTitleContainer}>
        <Text style={styles.stepTitle}>Buy Now</Text>
        <Text style={styles.stepSubtitle}>Step {stepNum} of 5</Text>
      </View>
      <View style={{ width: 36 }} />
    </View>
  );

  const renderHeaderBar = (title: string, onBack: () => void) => (
    <View style={[styles.headerBar, { paddingTop: Math.max(insets.top + 6, 18) }]}>
      <TouchableOpacity style={styles.backBtn} activeOpacity={0.7} onPress={onBack}>
        <ArrowLeft size={22} color={colors.gray900} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{title}</Text>
      <View style={{ width: 36 }} />
    </View>
  );

  return (
    <View style={styles.container}>
      <OfflineBanner isOffline={false} />

      {screen.name === 'TABS' && (
        <MainTabNavigator
          currentTab={currentTab}
          onTabChange={setCurrentTab}
          onNavigateToBuy={() => setScreen({ name: 'STEP_1_QUANTITY', selectedCircle, quantityKg: 100 })}
          onNavigateToOrderTracking={(orderId) => setScreen({ name: 'ORDER_TRACKING', orderId })}
          onNavigateToRequirements={() => setScreen({ name: 'REQUIREMENTS_LIST' })}
          onNavigateToAddRequirement={() => setScreen({ name: 'ADD_REQUIREMENT' })}
          onNavigateToAddShop={() => setScreen({ name: 'ADD_SHOP' })}
          onNavigateToNotifications={() => setScreen({ name: 'NOTIFICATIONS' })}
          onNavigateToEditProfile={() => setScreen({ name: 'EDIT_PROFILE' })}
        />
      )}

      {/* STEP 1 OF 5: Enter Quantity */}
      {screen.name === 'STEP_1_QUANTITY' && (
        <View style={{ flex: 1 }}>
          {renderStepHeader(1, handleBackToTabs)}
          <Step1QuantityScreen
            selectedCircle={screen.selectedCircle}
            initialQuantity={screen.quantityKg || 100}
            onContinue={(quantityKg) =>
              setScreen({
                name: 'STEP_2_DATE',
                selectedCircle: screen.selectedCircle,
                quantityKg,
              })
            }
          />
        </View>
      )}

      {/* STEP 2 OF 5: Select Delivery Date */}
      {screen.name === 'STEP_2_DATE' && (
        <View style={{ flex: 1 }}>
          {renderStepHeader(2, () => setScreen({ name: 'STEP_1_QUANTITY', selectedCircle: screen.selectedCircle, quantityKg: screen.quantityKg }))}
          <Step2DeliveryDateScreen
            initialDate={screen.deliveryDate || '10 Aug 2025 (Sunday)'}
            onContinue={(deliveryDate) =>
              setScreen({
                name: 'STEP_3_SUMMARY',
                selectedCircle: screen.selectedCircle,
                quantityKg: screen.quantityKg,
                deliveryDate,
              })
            }
          />
        </View>
      )}

      {/* STEP 3 OF 5: Order Summary */}
      {screen.name === 'STEP_3_SUMMARY' && (
        <View style={{ flex: 1 }}>
          {renderStepHeader(3, () => setScreen({ name: 'STEP_2_DATE', selectedCircle: screen.selectedCircle, quantityKg: screen.quantityKg, deliveryDate: screen.deliveryDate }))}
          <Step3OrderSummaryScreen
            quantityKg={screen.quantityKg}
            deliveryDate={screen.deliveryDate}
            selectedCircle={screen.selectedCircle}
            onChangeCircle={() => setScreen({ name: 'TABS' })}
            onContinue={() =>
              setScreen({
                name: 'STEP_4_PAYMENT',
                selectedCircle: screen.selectedCircle,
                quantityKg: screen.quantityKg,
                deliveryDate: screen.deliveryDate,
              })
            }
          />
        </View>
      )}

      {/* STEP 4 OF 5: Choose Payment Option */}
      {screen.name === 'STEP_4_PAYMENT' && (
        <View style={{ flex: 1 }}>
          {renderStepHeader(4, () => setScreen({ name: 'STEP_3_SUMMARY', selectedCircle: screen.selectedCircle, quantityKg: screen.quantityKg, deliveryDate: screen.deliveryDate }))}
          <Step4PaymentOptionScreen
            quantityKg={screen.quantityKg}
            initialOption={screen.paymentOption || 'ONLINE'}
            onContinue={(paymentOption) =>
              setScreen({
                name: 'STEP_5_CONFIRM',
                selectedCircle: screen.selectedCircle,
                quantityKg: screen.quantityKg,
                deliveryDate: screen.deliveryDate,
                paymentOption,
              })
            }
          />
        </View>
      )}

      {/* STEP 5 OF 5: Confirm Your Order */}
      {screen.name === 'STEP_5_CONFIRM' && (
        <View style={{ flex: 1 }}>
          {renderStepHeader(5, () => setScreen({ name: 'STEP_4_PAYMENT', selectedCircle: screen.selectedCircle, quantityKg: screen.quantityKg, deliveryDate: screen.deliveryDate, paymentOption: screen.paymentOption }))}
          <Step5ConfirmOrderScreen
            quantityKg={screen.quantityKg}
            deliveryDate={screen.deliveryDate}
            paymentOption={screen.paymentOption}
            selectedCircle={screen.selectedCircle}
            onPlaceOrder={() => {
              const marketRate = screen.selectedCircle.marketPrice;
              const discount = screen.paymentOption === 'ONLINE' ? 5 : 0;
              const finalAmount = screen.quantityKg * (marketRate - discount);
              const orderId = `NF${Math.floor(10000 + Math.random() * 90000)}`;

              setScreen({
                name: 'ORDER_CONFIRMATION',
                orderData: {
                  id: orderId,
                  quantityKg: screen.quantityKg,
                  finalAmount,
                  deliveryDate: screen.deliveryDate,
                  paymentMethod: screen.paymentOption === 'ONLINE' ? 'Pay Online' : 'Cash on Delivery',
                },
              });
            }}
          />
        </View>
      )}

      {/* STEP 6: Order Placed Successfully! */}
      {screen.name === 'ORDER_CONFIRMATION' && (
        <View style={{ flex: 1 }}>
          {renderHeaderBar('Order Placed', handleBackToTabs)}
          <OrderConfirmationScreen
            mockData={{
              orderNumber: `#${screen.orderData.id}`,
              orderDateTime: '08 Aug 2025, 11:30 AM',
              deliveryDate: screen.orderData.deliveryDate,
              quantity: `${screen.orderData.quantityKg} Kg`,
              finalAmount: `₹${screen.orderData.finalAmount.toLocaleString('en-IN')}.00`,
              paymentMethod: screen.orderData.paymentMethod,
            }}
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

      {/* Language Switcher Modal */}
      <LanguageModal
        visible={isLanguageModalVisible}
        onClose={() => setLanguageModalVisible(false)}
      />
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
  stepHeaderBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  stepBackBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepTitleContainer: {
    alignItems: 'center',
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.gray900,
  },
  stepSubtitle: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.gray500,
    marginTop: 1,
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
});
