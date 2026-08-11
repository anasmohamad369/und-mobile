import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { colors } from '../../theme/colors';
import { useShopContext } from '../../context/ShopContext';
import { useCreateOrderMutation } from '../../hooks/useOrders';
import { Order, PaymentInitiation } from '../../types';
import { MapPin, Truck, Calendar, CreditCard, ShieldCheck } from 'lucide-react-native';

interface OrderReviewScreenProps {
  quantityKg: number;
  ratePerKg: number;
  deliveryDate: string;
  deliverySlot?: string;
  onProceedToPayment: (order: Order, payment: PaymentInitiation) => void;
}

export const OrderReviewScreen: React.FC<OrderReviewScreenProps> = ({
  quantityKg,
  ratePerKg,
  deliveryDate,
  deliverySlot = 'Standard Delivery',
  onProceedToPayment,
}) => {
  const { selectedShop } = useShopContext();
  const createOrderMutation = useCreateOrderMutation();
  const [errorMsg, setErrorMsg] = useState<string>('');

  const subtotal = quantityKg * ratePerKg;
  const deliveryFee = 0;
  const totalAmount = subtotal + deliveryFee;

  const handleCreateOrder = async () => {
    setErrorMsg('');
    try {
      const idempotencyKey = `IDEM_ORDER_${Date.now()}_${Math.random().toString(36).substring(7)}`;

      const res = await createOrderMutation.mutateAsync({
        payload: {
          shopId: selectedShop?.id || 1,
          quantityKg,
          deliveryDate,
          deliverySlot,
          paymentMethod: 'UPI',
        },
        idempotencyKey,
      });

      onProceedToPayment(res.order, res.payment);
    } catch (e: any) {
      setErrorMsg(e.message || 'Failed to place order. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.screenTitle}>Review Your Order</Text>

      {/* Delivery Address Card */}
      <Card style={styles.reviewCard}>
        <View style={styles.cardHeader}>
          <MapPin size={20} color={colors.primary} style={{ marginRight: 8 }} />
          <Text style={styles.cardHeaderTitle}>Delivering To</Text>
        </View>
        <Text style={styles.shopTitle}>{selectedShop?.name || 'NutriFarm - Bopal'}</Text>
        <Text style={styles.shopSub}>
          {selectedShop?.address}, {selectedShop?.city} - {selectedShop?.pincode}
        </Text>
      </Card>

      {/* Item & Rate Details */}
      <Card style={styles.reviewCard}>
        <View style={styles.cardHeader}>
          <Truck size={20} color={colors.primary} style={{ marginRight: 8 }} />
          <Text style={styles.cardHeaderTitle}>Wholesale Chicken Supply</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Product Type</Text>
          <Text style={styles.valBold}>Live Broiler Chicken</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Quantity</Text>
          <Text style={styles.valBold}>{quantityKg} KG</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Wholesale Rate</Text>
          <Text style={styles.valBold}>₹{ratePerKg} / KG</Text>
        </View>
      </Card>

      {/* Delivery Window */}
      <Card style={styles.reviewCard}>
        <View style={styles.cardHeader}>
          <Calendar size={20} color={colors.primary} style={{ marginRight: 8 }} />
          <Text style={styles.cardHeaderTitle}>Scheduled Delivery</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Delivery Date</Text>
          <Text style={styles.valBold}>{deliveryDate}</Text>
        </View>
      </Card>

      {/* Final Price Breakdown */}
      <Card style={styles.reviewCard}>
        <View style={styles.cardHeader}>
          <CreditCard size={20} color={colors.primary} style={{ marginRight: 8 }} />
          <Text style={styles.cardHeaderTitle}>Payment Breakdown</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Subtotal ({quantityKg} KG × ₹{ratePerKg})</Text>
          <Text style={styles.val}>₹{subtotal.toLocaleString()}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Delivery Fee</Text>
          <Text style={[styles.val, { color: colors.success }]}>₹0 (FREE)</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={styles.totalLabel}>Total Payable</Text>
          <Text style={styles.totalVal}>₹{totalAmount.toLocaleString()}</Text>
        </View>
      </Card>

      {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

      <View style={styles.securityNote}>
        <ShieldCheck size={16} color={colors.gray500} style={{ marginRight: 6 }} />
        <Text style={styles.securityText}>
          Backend Idempotency & Stock Reservation Protected
        </Text>
      </View>

      <Button
        title="Proceed to Payment"
        variant="primary"
        size="lg"
        loading={createOrderMutation.isPending}
        onPress={handleCreateOrder}
        style={styles.payBtn}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 30,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.gray900,
    marginBottom: 14,
  },
  reviewCard: {
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardHeaderTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.gray900,
  },
  shopTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.gray900,
  },
  shopSub: {
    fontSize: 13,
    color: colors.gray600,
    marginTop: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  label: {
    fontSize: 13,
    color: colors.gray600,
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
  divider: {
    height: 1,
    backgroundColor: colors.gray200,
    marginVertical: 10,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.gray900,
  },
  totalVal: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.primary,
  },
  errorText: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  securityText: {
    fontSize: 12,
    color: colors.gray500,
    fontWeight: '500',
  },
  payBtn: {
    marginBottom: 20,
  },
});
