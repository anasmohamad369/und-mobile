import React from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { OrderTimeline } from '../../components/orders/OrderTimeline';
import { DriverCard } from '../../components/orders/DriverCard';
import { colors } from '../../theme/colors';
import { useSingleOrder } from '../../hooks/useOrders';
import { MapPin, ShieldCheck, RefreshCw, Sparkles, Tag, TrendingDown } from 'lucide-react-native';

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

  // Calculate pricing breakdown & NutriFarm ₹5/kg savings
  const discountPerKg = 5;
  const quantityKg = order.quantityKg || 250;
  const effectiveRate = order.ratePerKg || 145;
  const marketRate = effectiveRate + discountPerKg; // e.g. 145 + 5 = 150
  const originalMarketTotal = quantityKg * marketRate; // e.g. 250 * 150 = 37,500
  const totalSaved = quantityKg * discountPerKg; // e.g. 250 * 5 = 1,250
  const totalPaid = order.totalAmount || (quantityKg * effectiveRate); // e.g. 36,250

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
    >
      {/* Top Order Overview Card */}
      <Card style={styles.headerCard}>
        <View style={styles.topRow}>
          <Text style={styles.orderIdTitle}>Order #{order.id}</Text>
          <Badge status={order.status} />
        </View>

        <View style={styles.orderStatsGrid}>
          <View style={styles.statCol}>
            <Text style={styles.statLabel}>Quantity</Text>
            <Text style={styles.statVal}>{quantityKg} KG</Text>
          </View>

          <View style={styles.statCol}>
            <Text style={styles.statLabel}>Rate</Text>
            <Text style={styles.statVal}>₹{effectiveRate}/KG</Text>
          </View>

          <View style={styles.statCol}>
            <Text style={styles.statLabel}>Total Saved</Text>
            <Text style={styles.savedHighlight}>₹{totalSaved.toLocaleString()}</Text>
          </View>

          <View style={styles.statCol}>
            <Text style={styles.statLabel}>Total Paid</Text>
            <Text style={styles.totalHighlight}>₹{totalPaid.toLocaleString()}</Text>
          </View>
        </View>
      </Card>

      {/* Savings & Price Breakdown Card (Curiosity & Profit Booster) */}
      <Card style={styles.savingsCard}>
        {/* Savings Header Banner */}
        <View style={styles.savingsHeaderBanner}>
          <View style={styles.savingsHeaderLeft}>
            <Sparkles size={18} color="#0A5D36" style={{ marginRight: 6 }} />
            <Text style={styles.savingsHeaderText}>
              You Saved ₹{totalSaved.toLocaleString()} on this Order! 🎉
            </Text>
          </View>
          <View style={styles.savingsBadge}>
            <Text style={styles.savingsBadgeText}>₹{discountPerKg}/kg OFF</Text>
          </View>
        </View>

        {/* Detailed Price Breakdown */}
        <View style={styles.priceBreakdownContainer}>
          <View style={styles.priceRow}>
            <Text style={styles.priceRowLabel}>Total Order Quantity</Text>
            <Text style={styles.priceRowValue}>{quantityKg} KG</Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.priceRowLabel}>Market Price (₹{marketRate}/kg)</Text>
            <Text style={styles.marketPriceStrike}>₹{originalMarketTotal.toLocaleString()}.00</Text>
          </View>

          <View style={styles.priceRow}>
            <View style={styles.discountLabelRow}>
              <Tag size={14} color="#16A34A" style={{ marginRight: 5 }} />
              <Text style={styles.discountRowLabel}>NutriFarm Offer Discount (₹{discountPerKg}/kg)</Text>
            </View>
            <Text style={styles.discountRowValue}>- ₹{totalSaved.toLocaleString()}.00</Text>
          </View>

          <View style={styles.dividerLine} />

          <View style={styles.priceRowTotal}>
            <View>
              <Text style={styles.totalPaidLabel}>Total Amount Paid</Text>
              <Text style={styles.totalPaidSubtext}>Effective Price: ₹{effectiveRate}/kg</Text>
            </View>
            <Text style={styles.totalPaidValue}>₹{totalPaid.toLocaleString()}.00</Text>
          </View>
        </View>

        {/* Curiosity & Savings Reengagement Banner */}
        <View style={styles.curiosityBox}>
          <TrendingDown size={16} color="#0A5D36" style={{ marginRight: 6 }} />
          <Text style={styles.curiosityText}>
            Great deal! You saved ₹{totalSaved.toLocaleString()} on this order.
          </Text>
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
  savedHighlight: {
    fontSize: 14,
    fontWeight: '800',
    color: '#16A34A',
    marginTop: 2,
  },
  totalHighlight: {
    fontSize: 14,
    fontWeight: '900',
    color: colors.primary,
    marginTop: 2,
  },
  savingsCard: {
    marginBottom: 12,
    padding: 0,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#C8E6C9',
    backgroundColor: '#FFFFFF',
  },
  savingsHeaderBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#E8F5E9',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#C8E6C9',
  },
  savingsHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  savingsHeaderText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0A5D36',
    flex: 1,
  },
  savingsBadge: {
    backgroundColor: '#0A5D36',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  savingsBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
  },
  priceBreakdownContainer: {
    padding: 14,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  priceRowLabel: {
    fontSize: 13,
    color: colors.gray600,
    fontWeight: '500',
  },
  priceRowValue: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.gray900,
  },
  marketPriceStrike: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.gray500,
    textDecorationLine: 'line-through',
  },
  discountLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  discountRowLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#16A34A',
  },
  discountRowValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#16A34A',
  },
  dividerLine: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 10,
  },
  priceRowTotal: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totalPaidLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.gray900,
  },
  totalPaidSubtext: {
    fontSize: 11,
    color: colors.gray500,
    marginTop: 1,
  },
  totalPaidValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FF4D00',
  },
  curiosityBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderTopWidth: 1,
    borderTopColor: '#DCFCE7',
  },
  curiosityText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0A5D36',
    flex: 1,
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
