import React from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { Header } from '../../components/common/Header';
import { LiveRateCard } from '../../components/home/LiveRateCard';
import { StockCard } from '../../components/home/StockCard';
import { RecentOrderCard } from '../../components/home/RecentOrderCard';
import { ShopSelectorModal } from '../../components/home/ShopSelectorModal';
import { Card } from '../../components/common/Card';
import { colors } from '../../theme/colors';
import { useLiveRate } from '../../hooks/useLiveRate';
import { useInventory } from '../../hooks/useInventory';
import { useOrders } from '../../hooks/useOrders';
import { useRequirements } from '../../hooks/useRequirements';
import { useShopContext } from '../../context/ShopContext';
import { useNotificationContext } from '../../context/NotificationContext';
import { CalendarRange, ChevronRight, Zap } from 'lucide-react-native';

interface HomeScreenProps {
  onNavigateToBuy: () => void;
  onNavigateToOrders: () => void;
  onNavigateToOrderTracking: (orderId: string) => void;
  onNavigateToRequirements: () => void;
  onNavigateToAddRequirement: () => void;
  onNavigateToAddShop: () => void;
  onNavigateToNotifications: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigateToBuy,
  onNavigateToOrders,
  onNavigateToOrderTracking,
  onNavigateToRequirements,
  onNavigateToAddRequirement,
  onNavigateToAddShop,
  onNavigateToNotifications,
}) => {
  const { data: rate, refetch: refetchRate, isLoading: isRateLoading } = useLiveRate();
  const { data: inventory, refetch: refetchInventory } = useInventory();
  const { data: orders, refetch: refetchOrders } = useOrders('ACTIVE');
  const { data: requirements } = useRequirements();
  const { isSelectorModalVisible, setSelectorModalVisible } = useShopContext();
  const { triggerMockRateUpdate } = useNotificationContext();

  const activeOrder = orders && orders.length > 0 ? orders[0] : null;
  const activeRequirement = requirements && requirements.length > 0 ? requirements[0] : null;

  const onRefresh = async () => {
    await Promise.all([refetchRate(), refetchInventory(), refetchOrders()]);
  };

  const handleSimulateRateChange = () => {
    const current = rate?.ratePerKg || 102;
    const nextRate = current === 102 ? 105 : current === 105 ? 99 : 102;
    triggerMockRateUpdate(nextRate);
  };

  return (
    <View style={styles.container}>
      <Header
        onNotificationPress={onNavigateToNotifications}
        unreadNotifications={true}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={isRateLoading} onRefresh={onRefresh} />}
      >
        {/* Real-time Rate Simulation Bar */}
        <TouchableOpacity
          style={styles.simBar}
          activeOpacity={0.8}
          onPress={handleSimulateRateChange}
        >
          <Zap size={14} color={colors.accent} style={{ marginRight: 6 }} />
          <Text style={styles.simBarText}>
            Simulate Rate Fluctuation (Tap to test WebSocket update: ₹{rate?.ratePerKg || 102}/KG)
          </Text>
        </TouchableOpacity>

        {/* Live Chicken Rate Card */}
        <LiveRateCard rate={rate || null} onBuyPress={onNavigateToBuy} />

        {/* Stock Availability */}
        <StockCard availableKg={inventory?.availableKg || 4250} />

        {/* Expected Requirement Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Expected Requirement</Text>
          <TouchableOpacity onPress={onNavigateToRequirements} activeOpacity={0.7}>
            <Text style={styles.seeAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        {activeRequirement ? (
          <Card style={styles.reqCard}>
            <View style={styles.reqHeader}>
              <View style={styles.reqIconBox}>
                <CalendarRange size={20} color={colors.primary} />
              </View>
              <View style={styles.reqInfo}>
                <Text style={styles.reqShopName}>{activeRequirement.shopName}</Text>
                <Text style={styles.reqDateText}>
                  {activeRequirement.fromDate} - {activeRequirement.toDate}
                </Text>
              </View>
              <View style={styles.reqKgPill}>
                <Text style={styles.reqKgText}>{activeRequirement.expectedKg.toLocaleString()} KG</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.reqAction}
              activeOpacity={0.7}
              onPress={onNavigateToRequirements}
            >
              <Text style={styles.reqActionText}>
                Estimated Remaining: {activeRequirement.remainingKg || 350} KG
              </Text>
              <ChevronRight size={16} color={colors.primary} />
            </TouchableOpacity>
          </Card>
        ) : (
          <Card style={styles.emptyReqCard}>
            <Text style={styles.emptyReqTitle}>No Expected Requirements Set</Text>
            <Text style={styles.emptyReqSub}>Tell us your expected future KG demand for better farm supply.</Text>
            <TouchableOpacity style={styles.addReqBtn} onPress={onNavigateToAddRequirement}>
              <Text style={styles.addReqBtnText}>+ Add Expected Requirement</Text>
            </TouchableOpacity>
          </Card>
        )}

        {/* Recent Active Order Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Order</Text>
          <TouchableOpacity onPress={onNavigateToOrders} activeOpacity={0.7}>
            <Text style={styles.seeAllText}>All Orders</Text>
          </TouchableOpacity>
        </View>

        {activeOrder ? (
          <RecentOrderCard order={activeOrder} onViewOrder={onNavigateToOrderTracking} />
        ) : (
          <Card style={styles.emptyOrderCard}>
            <Text style={styles.emptyOrderText}>No active orders right now.</Text>
            <TouchableOpacity style={styles.buyNowSmallBtn} onPress={onNavigateToBuy}>
              <Text style={styles.buyNowSmallText}>Place New Purchase Order</Text>
            </TouchableOpacity>
          </Card>
        )}
      </ScrollView>

      {/* Shop Selector Modal */}
      <ShopSelectorModal
        visible={isSelectorModalVisible}
        onClose={() => setSelectorModalVisible(false)}
        onAddNewShop={onNavigateToAddShop}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  simBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E293B',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 4,
  },
  simBarText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.gray300,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 18,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.gray900,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  reqCard: {
    padding: 14,
    marginVertical: 4,
  },
  reqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reqIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  reqInfo: {
    flex: 1,
  },
  reqShopName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.gray900,
  },
  reqDateText: {
    fontSize: 12,
    color: colors.gray500,
    marginTop: 2,
  },
  reqKgPill: {
    backgroundColor: colors.accentLight,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  reqKgText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#B45309',
  },
  reqAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
  },
  reqActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.gray700,
  },
  emptyReqCard: {
    padding: 16,
    alignItems: 'center',
  },
  emptyReqTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.gray800,
  },
  emptyReqSub: {
    fontSize: 12,
    color: colors.gray500,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 12,
  },
  addReqBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: colors.primaryLight,
  },
  addReqBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  emptyOrderCard: {
    padding: 20,
    alignItems: 'center',
  },
  emptyOrderText: {
    fontSize: 14,
    color: colors.gray500,
  },
  buyNowSmallBtn: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  buyNowSmallText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textWhite,
  },
});
