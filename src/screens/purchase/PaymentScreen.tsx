import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { colors } from '../../theme/colors';
import { useVerifyPaymentMutation } from '../../hooks/useOrders';
import { Order, PaymentInitiation } from '../../types';
import {
  CreditCard,
  QrCode,
  Building,
  CheckCircle2,
  Circle,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react-native';

interface PaymentScreenProps {
  order: Order;
  payment: PaymentInitiation;
  onPaymentSuccess: (confirmedOrder: Order) => void;
}

type PaymentMethod = 'UPI' | 'CARD' | 'NET_BANKING' | 'BANK_TRANSFER';

export const PaymentScreen: React.FC<PaymentScreenProps> = ({
  order,
  payment,
  onPaymentSuccess,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('UPI');
  const [paymentFailed, setPaymentFailed] = useState<boolean>(false);

  const verifyPaymentMutation = useVerifyPaymentMutation();

  const handlePayNow = async (simulateSuccess: boolean = true) => {
    setPaymentFailed(false);
    try {
      const res = await verifyPaymentMutation.mutateAsync({
        paymentId: payment.paymentId,
        orderId: order.id,
        gatewayPaymentId: `pay_rzp_${Date.now()}`,
        gatewaySignature: `sig_${Date.now()}`,
        success: simulateSuccess,
      });

      onPaymentSuccess(res);
    } catch (e: any) {
      setPaymentFailed(true);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.screenTitle}>Payment</Text>

      {/* Amount Display */}
      <Card style={styles.amountCard}>
        <Text style={styles.amountLabel}>Total Amount Payable</Text>
        <Text style={styles.amountText}>₹{order.totalAmount.toLocaleString()}</Text>
        <Text style={styles.orderIdRef}>Order Reference: #{order.id}</Text>
      </Card>

      {paymentFailed ? (
        <Card style={styles.failedCard}>
          <AlertCircle size={32} color={colors.danger} style={{ alignSelf: 'center', marginBottom: 8 }} />
          <Text style={styles.failedTitle}>Payment Failed</Text>
          <Text style={styles.failedSub}>
            We couldn't complete your payment. Your stock reservation is intact for a limited time.
          </Text>
          <View style={styles.failedActions}>
            <Button
              title="Try Again"
              variant="primary"
              size="md"
              onPress={() => handlePayNow(true)}
              style={{ flex: 1, marginRight: 6 }}
            />
            <Button
              title="Change Method"
              variant="outline"
              size="md"
              onPress={() => setPaymentFailed(false)}
              style={{ flex: 1, marginLeft: 6 }}
            />
          </View>
        </Card>
      ) : null}

      <Text style={styles.sectionTitle}>Choose Payment Method</Text>

      {/* Payment Options */}
      <View style={styles.methodsList}>
        <TouchableOpacity
          style={[styles.methodCard, selectedMethod === 'UPI' && styles.selectedMethod]}
          onPress={() => setSelectedMethod('UPI')}
        >
          {selectedMethod === 'UPI' ? (
            <CheckCircle2 size={22} color={colors.primary} style={{ marginRight: 12 }} />
          ) : (
            <Circle size={22} color={colors.gray400} style={{ marginRight: 12 }} />
          )}
          <QrCode size={22} color={colors.gray800} style={{ marginRight: 12 }} />
          <View style={styles.methodInfo}>
            <Text style={styles.methodTitle}>UPI / GPay / PhonePe / Paytm</Text>
            <Text style={styles.methodSub}>Instant 0% transaction fee payment</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.methodCard, selectedMethod === 'CARD' && styles.selectedMethod]}
          onPress={() => setSelectedMethod('CARD')}
        >
          {selectedMethod === 'CARD' ? (
            <CheckCircle2 size={22} color={colors.primary} style={{ marginRight: 12 }} />
          ) : (
            <Circle size={22} color={colors.gray400} style={{ marginRight: 12 }} />
          )}
          <CreditCard size={22} color={colors.gray800} style={{ marginRight: 12 }} />
          <View style={styles.methodInfo}>
            <Text style={styles.methodTitle}>Credit / Debit Card</Text>
            <Text style={styles.methodSub}>Visa, MasterCard, RuPay</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.methodCard, selectedMethod === 'NET_BANKING' && styles.selectedMethod]}
          onPress={() => setSelectedMethod('NET_BANKING')}
        >
          {selectedMethod === 'NET_BANKING' ? (
            <CheckCircle2 size={22} color={colors.primary} style={{ marginRight: 12 }} />
          ) : (
            <Circle size={22} color={colors.gray400} style={{ marginRight: 12 }} />
          )}
          <Building size={22} color={colors.gray800} style={{ marginRight: 12 }} />
          <View style={styles.methodInfo}>
            <Text style={styles.methodTitle}>Net Banking</Text>
            <Text style={styles.methodSub}>All major Indian Banks</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.securityBox}>
        <ShieldCheck size={18} color={colors.success} style={{ marginRight: 8 }} />
        <Text style={styles.securityText}>
          256-bit Encrypted Wholesale Gateway
        </Text>
      </View>

      <Button
        title={`Pay ₹${order.totalAmount.toLocaleString()}`}
        variant="primary"
        size="lg"
        loading={verifyPaymentMutation.isPending}
        onPress={() => handlePayNow(true)}
        style={styles.payBtn}
      />

      {/* Dev options to test payment failure handling */}
      <TouchableOpacity
        style={styles.devFailBtn}
        onPress={() => handlePayNow(false)}
      >
        <Text style={styles.devFailText}>[DEV TEST: Simulate Gateway Payment Failure]</Text>
      </TouchableOpacity>
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
  amountCard: {
    backgroundColor: '#0F172A',
    alignItems: 'center',
    padding: 24,
    borderRadius: 20,
    marginBottom: 20,
  },
  amountLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.gray400,
    textTransform: 'uppercase',
  },
  amountText: {
    fontSize: 38,
    fontWeight: '900',
    color: colors.textWhite,
    marginTop: 4,
  },
  orderIdRef: {
    fontSize: 12,
    color: colors.gray400,
    marginTop: 6,
  },
  failedCard: {
    backgroundColor: colors.dangerLight,
    borderWidth: 1.5,
    borderColor: colors.danger,
    marginBottom: 16,
  },
  failedTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.danger,
    textAlign: 'center',
  },
  failedSub: {
    fontSize: 13,
    color: colors.gray700,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 14,
  },
  failedActions: {
    flexDirection: 'row',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.gray900,
    marginBottom: 12,
  },
  methodsList: {
    gap: 10,
    marginBottom: 20,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.gray200,
  },
  selectedMethod: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  methodInfo: {
    flex: 1,
  },
  methodTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.gray900,
  },
  methodSub: {
    fontSize: 12,
    color: colors.gray500,
    marginTop: 2,
  },
  securityBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  securityText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.gray600,
  },
  payBtn: {
    marginBottom: 12,
  },
  devFailBtn: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  devFailText: {
    fontSize: 11,
    color: colors.gray500,
    textDecorationLine: 'underline',
  },
});
