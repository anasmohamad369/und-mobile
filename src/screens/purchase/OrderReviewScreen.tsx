import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { colors } from '../../theme/colors';
import { useShopContext } from '../../context/ShopContext';
import { useCreateOrderMutation } from '../../hooks/useOrders';
import { Order, PaymentInitiation } from '../../types';
import { CircleRate, REGIONAL_CIRCLES } from '../../data/circlesData';
import { MapPin, Truck, Calendar, CreditCard, ShieldCheck, Tag } from 'lucide-react-native';


interface OrderReviewScreenProps {
  quantityKg: number;
  ratePerKg: number;
  paymentMethod?: 'ONLINE' | 'COD';
  deliveryDate: string;
  deliverySlot?: string;
  selectedCircle?: CircleRate;
  onProceedToPayment: (order: Order, payment: PaymentInitiation) => void;
}

export const OrderReviewScreen: React.FC<OrderReviewScreenProps> = ({
  quantityKg,
  ratePerKg,
  paymentMethod = 'ONLINE',
  deliveryDate,
  deliverySlot = 'Standard Delivery',
  selectedCircle = REGIONAL_CIRCLES[0],
  onProceedToPayment,
}) => {
  const { selectedShop } = useShopContext();
  const createOrderMutation = useCreateOrderMutation();
  const [errorMsg, setErrorMsg] = useState<string>('');

  const subtotal = quantityKg * ratePerKg;
  const deliveryFee = 0;
  const totalAmount = subtotal + deliveryFee;
  const discountAmount = paymentMethod === 'ONLINE' ? 5 : 0;
  const totalSaved = quantityKg * discountAmount;

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
          paymentMethod: paymentMethod === 'ONLINE' ? 'UPI' : 'BANK_TRANSFER',
        },
        idempotencyKey,
      });

      onProceedToPayment(res.order, res.payment);
    } catch (e: any) {
      setErrorMsg(e.message || 'Failed to place order. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={styles.screenTitle}>Review Your Order</Text>

      {/* Delivery Address Card */}
      <Card style={styles.reviewCard}>
        <View style={styles.cardHeader}>
          <MapPin size={20} color="#0A5D36" style={{ marginRight: 8 }} />
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
          <Truck size={20} color="#0A5D36" style={{ marginRight: 8 }} />
          <Text style={styles.cardHeaderTitle}>Supply & Market Circle Rate</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Product Type</Text>
          <Text style={styles.valBold}>Live Broiler Chicken</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Market Circle</Text>
          <Text style={styles.valBold}>{selectedCircle.name}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Quantity</Text>
          <Text style={styles.valBold}>{quantityKg} KG</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Base Market Rate</Text>
          <Text style={styles.valBold}>₹{selectedCircle.marketPrice}.00 / KG</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Payment Method</Text>
          <Text style={styles.valHighlight}>
            {paymentMethod === 'ONLINE' ? 'Online Payment (Prepaid)' : 'Cash on Delivery (COD)'}
          </Text>
        </View>

        {paymentMethod === 'ONLINE' && (
          <View style={styles.discountRow}>
            <Tag size={14} color="#16A34A" style={{ marginRight: 6 }} />
            <Text style={styles.discountText}>Applied flat ₹5.00/kg instant discount!</Text>
          </View>
        )}
      </Card>

      {/* Delivery Window */}
      <Card style={styles.reviewCard}>
        <View style={styles.cardHeader}>
          <Calendar size={20} color="#0A5D36" style={{ marginRight: 8 }} />
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
          <CreditCard size={20} color="#0A5D36" style={{ marginRight: 8 }} />
          <Text style={styles.cardHeaderTitle}>Payment Breakdown</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Rate Applied</Text>
          <Text style={styles.valBold}>₹{ratePerKg}.00 / KG</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Subtotal ({quantityKg} KG × ₹{ratePerKg})</Text>
          <Text style={styles.val}>₹{subtotal.toLocaleString('en-IN')}.00</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Delivery Fee</Text>
          <Text style={[styles.val, { color: colors.success }]}>₹0 (FREE)</Text>
        </View>

        {paymentMethod === 'ONLINE' && totalSaved > 0 && (
          <View style={styles.totalSavingsBox}>
            <Text style={styles.totalSavingsText}>
              Total Savings: ₹{totalSaved.toLocaleString('en-IN')}.00
            </Text>
          </View>
        )}

        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={styles.totalLabel}>Total Payable Amount</Text>
          <Text style={styles.totalVal}>₹{totalAmount.toLocaleString('en-IN')}.00</Text>
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
        title={paymentMethod === 'ONLINE' ? 'Pay Now & Complete Order' : 'Confirm Cash on Delivery Order'}
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
  valHighlight: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FF5500',
  },
  discountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginTop: 6,
  },
  discountText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#16A34A',
  },
  totalSavingsBox: {
    backgroundColor: '#DCFCE7',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginTop: 6,
    alignItems: 'center',
  },
  totalSavingsText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#16A34A',
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
    fontSize: 22,
    fontWeight: '900',
    color: '#FF5500',
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
    backgroundColor: '#FF5500',
  },
});

