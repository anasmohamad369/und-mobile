import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { colors } from '../../theme/colors';
import { Order } from '../../types';
import { CheckCircle2, Truck, ArrowRight, Home } from 'lucide-react-native';

interface OrderConfirmationScreenProps {
  order: Order;
  onTrackOrder: (orderId: string) => void;
  onReturnHome: () => void;
}

export const OrderConfirmationScreen: React.FC<OrderConfirmationScreenProps> = ({
  order,
  onTrackOrder,
  onReturnHome,
}) => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.successHeader}>
        <View style={styles.iconCircle}>
          <CheckCircle2 size={56} color={colors.success} />
        </View>

        <Text style={styles.successTitle}>Payment Successful!</Text>
        <Text style={styles.amountText}>₹{order.totalAmount.toLocaleString()}</Text>

        <View style={styles.orderBadge}>
          <Text style={styles.orderBadgeText}>Order #{order.id}</Text>
        </View>

        <Text style={styles.subtitle}>
          Your order has been confirmed and submitted to the platform farm dispatch network.
        </Text>
      </View>

      <Card style={styles.detailsCard}>
        <Text style={styles.cardHeaderTitle}>Delivery Summary</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Quantity</Text>
          <Text style={styles.val}>{order.quantityKg} KG Live Broiler Chicken</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Wholesale Rate</Text>
          <Text style={styles.val}>₹{order.ratePerKg} / KG</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Delivering To</Text>
          <Text style={styles.val}>{order.delivery.shopName}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Slot Window</Text>
          <Text style={styles.val}>{order.delivery.deliverySlot}</Text>
        </View>
      </Card>

      <Button
        title="Track Order Status"
        variant="primary"
        size="lg"
        icon={<Truck size={20} color={colors.textWhite} />}
        onPress={() => onTrackOrder(order.id)}
        style={styles.trackBtn}
      />

      <Button
        title="Back to Home Dashboard"
        variant="outline"
        size="lg"
        icon={<Home size={20} color={colors.gray800} />}
        onPress={onReturnHome}
        style={styles.homeBtn}
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
    padding: 20,
    paddingBottom: 30,
    alignItems: 'center',
  },
  successHeader: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 24,
  },
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.successLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: colors.gray900,
  },
  amountText: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.primary,
    marginTop: 6,
  },
  orderBadge: {
    backgroundColor: colors.gray200,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  orderBadgeText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.gray800,
  },
  subtitle: {
    fontSize: 14,
    color: colors.gray600,
    textAlign: 'center',
    marginTop: 12,
    paddingHorizontal: 10,
    lineHeight: 20,
  },
  detailsCard: {
    width: '100%',
    marginBottom: 24,
  },
  cardHeaderTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.gray900,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  label: {
    fontSize: 13,
    color: colors.gray500,
  },
  val: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.gray800,
    maxWidth: 200,
    textAlign: 'right',
  },
  trackBtn: {
    width: '100%',
    marginBottom: 12,
  },
  homeBtn: {
    width: '100%',
  },
});
