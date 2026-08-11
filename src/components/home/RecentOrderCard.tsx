import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { colors } from '../../theme/colors';
import { Order } from '../../types';
import { ChevronRight, Truck } from 'lucide-react-native';

interface RecentOrderCardProps {
  order: Order;
  onViewOrder: (orderId: string) => void;
}

export const RecentOrderCard: React.FC<RecentOrderCardProps> = ({ order, onViewOrder }) => {
  return (
    <Card style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.orderIdBox}>
          <Truck size={16} color={colors.primary} style={{ marginRight: 6 }} />
          <Text style={styles.orderIdText}>{order.id}</Text>
        </View>
        <Badge status={order.status} />
      </View>

      <Text style={styles.shopName} numberOfLines={1}>
        {order.delivery.shopName}
      </Text>

      <View style={styles.detailsRow}>
        <View style={styles.detailCol}>
          <Text style={styles.detailLabel}>Quantity</Text>
          <Text style={styles.detailValue}>{order.quantityKg} KG</Text>
        </View>

        <View style={styles.detailCol}>
          <Text style={styles.detailLabel}>Rate</Text>
          <Text style={styles.detailValue}>₹{order.ratePerKg}/KG</Text>
        </View>

        <View style={styles.detailCol}>
          <Text style={styles.detailLabel}>Total Amount</Text>
          <Text style={styles.detailValueHighlight}>₹{order.totalAmount.toLocaleString()}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.actionBtn}
        activeOpacity={0.7}
        onPress={() => onViewOrder(order.id)}
      >
        <Text style={styles.actionBtnText}>View Order Details & Tracking</Text>
        <ChevronRight size={16} color={colors.primary} />
      </TouchableOpacity>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 6,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  orderIdBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderIdText: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.gray900,
  },
  shopName: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.gray600,
    marginBottom: 12,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.gray50,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  detailCol: {
    alignItems: 'flex-start',
  },
  detailLabel: {
    fontSize: 11,
    color: colors.gray500,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.gray800,
    marginTop: 2,
  },
  detailValueHighlight: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.primary,
    marginTop: 2,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
});
