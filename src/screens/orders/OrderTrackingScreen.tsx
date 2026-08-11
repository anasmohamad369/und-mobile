import React from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { OrderTimeline } from '../../components/orders/OrderTimeline';
import { DriverCard } from '../../components/orders/DriverCard';
import { colors } from '../../theme/colors';
import { useSingleOrder } from '../../hooks/useOrders';
import { MapPin, Phone, ShieldCheck, RefreshCw } from 'lucide-react-native';

interface OrderTrackingScreenProps {
  orderId: string;
}

export const OrderTrackingScreen: React.FC<OrderTrackingScreenProps> = ({ orderId }) => {
  const { data: order, isLoading, refetch } = useSingleOrder(orderId);

  if (isLoading || !order) {
    return (
      <View style={styles.loadingContainer}>
        <RefreshCw size={24} color={colors.primary} style={{ marginBottom: 10 }} />
        <Text style={styles.loadingText}>Fetching Live Order Status...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
    >
      {/* Top Order Badge Header */}
      <Card style={styles.headerCard}>
        <View style={styles.topRow}>
          <Text style={styles.orderIdTitle}>Order #{order.id}</Text>
          <Badge status={order.status} />
        </View>

        <View style={styles.orderStatsGrid}>
          <View style={styles.statCol}>
            <Text style={styles.statLabel}>Quantity</Text>
            <Text style={styles.statVal}>{order.quantityKg} KG</Text>
          </View>

          <View style={styles.statCol}>
            <Text style={styles.statLabel}>Rate</Text>
            <Text style={styles.statVal}>₹{order.ratePerKg}/KG</Text>
          </View>

          <View style={styles.statCol}>
            <Text style={styles.statLabel}>Total Paid</Text>
            <Text style={styles.totalHighlight}>₹{order.totalAmount.toLocaleString()}</Text>
          </View>
        </View>
      </Card>

      {/* Live Timeline */}
      <Card style={styles.timelineCard}>
        <Text style={styles.sectionTitle}>Delivery Status Timeline</Text>
        <OrderTimeline currentStatus={order.status} createdAt={order.createdAt} />
      </Card>

      {/* Driver Information */}
      {order.delivery.driver && <DriverCard driver={order.delivery.driver} />}

      {/* Delivery Destination */}
      <Card style={styles.destinationCard}>
        <Text style={styles.sectionTitle}>Delivering To</Text>

        <View style={styles.locationRow}>
          <MapPin size={22} color={colors.primary} style={{ marginRight: 10, marginTop: 2 }} />
          <View style={styles.locationInfo}>
            <Text style={styles.shopName}>{order.delivery.shopName}</Text>
            <Text style={styles.shopAddress}>{order.delivery.shopAddress}</Text>
            <Text style={styles.slotText}>Expected Slot: {order.delivery.deliverySlot}</Text>
          </View>
        </View>
      </Card>

      <View style={styles.helpFooter}>
        <ShieldCheck size={16} color={colors.gray500} style={{ marginRight: 6 }} />
        <Text style={styles.helpText}>Need help with this order? Contact platform dispatch at 1800-POULTRY</Text>
      </View>
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
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    fontSize: 14,
    color: colors.gray600,
    fontWeight: '600',
  },
  headerCard: {
    marginBottom: 12,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  orderIdTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.gray900,
  },
  orderStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.gray50,
    padding: 12,
    borderRadius: 12,
  },
  statCol: {
    alignItems: 'flex-start',
  },
  statLabel: {
    fontSize: 11,
    color: colors.gray500,
    fontWeight: '500',
  },
  statVal: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.gray800,
    marginTop: 2,
  },
  totalHighlight: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.primary,
    marginTop: 2,
  },
  timelineCard: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.gray900,
    marginBottom: 10,
  },
  destinationCard: {
    marginBottom: 14,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.gray50,
    padding: 12,
    borderRadius: 12,
  },
  locationInfo: {
    flex: 1,
  },
  shopName: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.gray900,
  },
  shopAddress: {
    fontSize: 13,
    color: colors.gray600,
    marginTop: 2,
  },
  slotText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryDark,
    marginTop: 4,
  },
  helpFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  helpText: {
    fontSize: 12,
    color: colors.gray500,
  },
});
