import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { Order } from '../../types';
import { ChevronRight, ShoppingBag, Clock, FileText, CheckCircle2, Truck, Hourglass } from 'lucide-react-native';

interface RecentOrderCardProps {
  order?: Order;
  mockData?: {
    id: string;
    date: string;
    deliveryDate: string;
    kg: string;
    amount: string;
    status: 'Delivered' | 'In Transit' | 'Pending';
  };
  onViewOrder?: (orderId: string) => void;
}

export const RecentOrderCard: React.FC<RecentOrderCardProps> = ({ order, mockData, onViewOrder }) => {
  const id = mockData?.id || order?.id || '#NF10245';
  const dateStr = mockData?.date || (order ? new Date(order.createdAt).toLocaleString() : '08 Aug 2025, 10:30 AM');
  const deliveryStr = mockData?.deliveryDate || 'Delivery on 10 Aug 2025';
  const kgStr = mockData?.kg || `${order?.quantityKg || 200} kg`;
  const amountStr = mockData?.amount || `₹${(order?.totalAmount || 29000).toLocaleString('en-IN')}.00`;
  const statusStr = mockData?.status || (order?.status === 'DELIVERED' ? 'Delivered' : (order?.status === 'OUT_FOR_DELIVERY' || order?.status === 'DRIVER_ASSIGNED') ? 'In Transit' : 'Pending');


  const getStatusConfig = () => {
    switch (statusStr) {
      case 'Delivered':
        return {
          icon: <ShoppingBag size={18} color="#16A34A" />,
          circleBg: '#DCFCE7',
          statusBg: '#DCFCE7',
          statusText: '#16A34A',
          statusIcon: <CheckCircle2 size={12} color="#16A34A" style={{ marginRight: 4 }} />,
          deliveryTextColor: '#16A34A',
        };
      case 'In Transit':
        return {
          icon: <Clock size={18} color="#EA580C" />,
          circleBg: '#FFEDD5',
          statusBg: '#FFEDD5',
          statusText: '#EA580C',
          statusIcon: <Truck size={12} color="#EA580C" style={{ marginRight: 4 }} />,
          deliveryTextColor: '#EA580C',
        };
      default:
        return {
          icon: <FileText size={18} color="#2563EB" />,
          circleBg: '#DBEAFE',
          statusBg: '#DBEAFE',
          statusText: '#2563EB',
          statusIcon: <Hourglass size={12} color="#2563EB" style={{ marginRight: 4 }} />,
          deliveryTextColor: '#2563EB',
        };
    }
  };

  const config = getStatusConfig();

  return (
    <TouchableOpacity
      style={styles.cardContainer}
      activeOpacity={0.8}
      onPress={() => onViewOrder && onViewOrder(id)}
    >
      {/* Icon Circle */}
      <View style={[styles.iconCircle, { backgroundColor: config.circleBg }]}>
        {config.icon}
      </View>

      {/* Main Order Info */}
      <View style={styles.infoCol}>
        <Text style={styles.orderIdText}>Order {id}</Text>
        <Text style={styles.dateText}>📅 {dateStr}</Text>
        <Text style={[styles.deliveryDateText, { color: config.deliveryTextColor }]}>
          {deliveryStr}
        </Text>
      </View>

      {/* Right Metrics & Status Pill */}
      <View style={styles.rightCol}>
        <Text style={styles.kgText}>{kgStr}</Text>
        <Text style={styles.amountText}>{amountStr}</Text>
        <View style={styles.statusRow}>
          <View style={[styles.statusPill, { backgroundColor: config.statusBg }]}>
            {config.statusIcon}
            <Text style={[styles.statusPillText, { color: config.statusText }]}>{statusStr}</Text>
          </View>
          <ChevronRight size={18} color={colors.gray400} style={{ marginLeft: 6 }} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    marginVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoCol: {
    flex: 1,
  },
  orderIdText: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.gray900,
  },
  dateText: {
    fontSize: 11,
    color: colors.gray500,
    marginTop: 2,
  },
  deliveryDateText: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  rightCol: {
    alignItems: 'flex-end',
  },
  kgText: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.gray900,
  },
  amountText: {
    fontSize: 12,
    color: colors.gray600,
    fontWeight: '600',
    marginTop: 2,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '800',
  },
});

