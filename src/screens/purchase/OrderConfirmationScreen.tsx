import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '../../theme/colors';
import { Order } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { Check, Star } from 'lucide-react-native';

interface OrderConfirmationScreenProps {
  order?: Order;
  mockData?: {
    orderNumber: string;
    orderDateTime: string;
    deliveryDate: string;
    quantity: string;
    finalAmount: string;
    paymentMethod: string;
  };
  onTrackOrder: (orderId: string) => void;
  onReturnHome: () => void;
}

export const OrderConfirmationScreen: React.FC<OrderConfirmationScreenProps> = ({
  order,
  mockData,
  onTrackOrder,
  onReturnHome,
}) => {
  const { t } = useLanguage();
  const orderNum = mockData?.orderNumber || (order ? `#${order.id}` : '#NF10248');
  const orderDateTime = mockData?.orderDateTime || (order ? new Date(order.createdAt).toLocaleString() : '08 Aug 2025, 11:30 AM');
  const deliveryDateStr = mockData?.deliveryDate || (order?.delivery?.deliveryDate ? order.delivery.deliveryDate : '10 Aug 2025 (Sunday)');
  const quantityStr = mockData?.quantity || `${order?.quantityKg || 100} Kg`;
  const finalAmountStr = mockData?.finalAmount || `₹${(order?.totalAmount || 14500).toLocaleString('en-IN')}.00`;
  const paymentMethodStr = mockData?.paymentMethod || (order?.paymentMethod === 'UPI' ? t('payOnlineSave') : t('cashOnDelivery'));

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Big Green Circle Checkmark */}
      <View style={styles.successBadgeCircle}>
        <View style={styles.innerCheckCircle}>
          <Check size={36} color="#FFFFFF" strokeWidth={3} />
        </View>
      </View>

      <Text style={styles.successTitle}>{t('orderPlacedSuccess')}</Text>
      <Text style={styles.successSub}>{t('orderPlacedSub')}</Text>

      {/* Details Card */}
      <View style={styles.detailsCard}>
        <View style={styles.cardRow}>
          <Text style={styles.label}>{t('orderNumber')}</Text>
          <Text style={styles.orderNumVal}>{orderNum}</Text>
        </View>

        <View style={styles.cardRow}>
          <Text style={styles.label}>{t('orderDateAndTime')}</Text>
          <Text style={styles.val}>{orderDateTime}</Text>
        </View>

        <View style={styles.cardRow}>
          <Text style={styles.label}>{t('deliveryDate')}</Text>
          <Text style={styles.val}>{deliveryDateStr}</Text>
        </View>

        <View style={styles.cardRow}>
          <Text style={styles.label}>{t('quantity')}</Text>
          <Text style={styles.valBold}>{quantityStr}</Text>
        </View>

        <View style={styles.cardRow}>
          <Text style={styles.label}>{t('finalAmount')}</Text>
          <Text style={styles.amountVal}>{finalAmountStr}</Text>
        </View>

        <View style={styles.cardRow}>
          <Text style={styles.label}>{t('paymentMethod')}</Text>
          <Text style={styles.val}>{paymentMethodStr}</Text>
        </View>
      </View>

      {/* Info Callout Banner */}
      <View style={styles.infoBanner}>
        <Star size={16} color="#0A5D36" style={{ marginRight: 8 }} />
        <Text style={styles.infoBannerText}>{t('notificationUpdateNote')}</Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={styles.viewOrderBtn}
          activeOpacity={0.88}
          onPress={() => onTrackOrder(order?.id || 'NF10248')}
        >
          <Text style={styles.viewOrderBtnText}>{t('viewOrderBtn')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.homeOutlineBtn} activeOpacity={0.8} onPress={onReturnHome}>
          <Text style={styles.homeOutlineBtnText}>{t('backToHomeBtn')}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  content: {
    padding: 20,
    paddingTop: 36,
    paddingBottom: 40,
    alignItems: 'center',
  },
  successBadgeCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  innerCheckCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#16A34A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#16A34A',
    textAlign: 'center',
  },
  successSub: {
    fontSize: 13,
    color: colors.gray600,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 20,
    maxWidth: 260,
  },
  detailsCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  label: {
    fontSize: 13,
    color: colors.gray500,
  },
  val: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.gray800,
  },
  valBold: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.gray900,
  },
  orderNumVal: {
    fontSize: 15,
    fontWeight: '900',
    color: colors.gray900,
  },
  amountVal: {
    fontSize: 15,
    fontWeight: '900',
    color: colors.gray900,
  },
  infoBanner: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#C8E6C9',
    marginBottom: 24,
  },
  infoBannerText: {
    flex: 1,
    fontSize: 12,
    color: '#0A5D36',
    fontWeight: '600',
  },
  buttonGroup: {
    width: '100%',
    gap: 10,
  },
  viewOrderBtn: {
    backgroundColor: '#0A5D36',
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0A5D36',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  viewOrderBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  homeOutlineBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
  },
  homeOutlineBtnText: {
    color: colors.gray700,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
});
