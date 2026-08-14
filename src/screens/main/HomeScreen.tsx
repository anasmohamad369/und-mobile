import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { Header } from '../../components/common/Header';
import { LiveRateCard } from '../../components/home/LiveRateCard';
import { SpecialPriceCard } from '../../components/home/SpecialPriceCard';
import { RecentOrderCard } from '../../components/home/RecentOrderCard';
import { ShopSelectorModal } from '../../components/home/ShopSelectorModal';
import { CircleRateModal } from '../../components/home/CircleRateModal';
import { REGIONAL_CIRCLES, CircleRate } from '../../data/circlesData';
import { colors } from '../../theme/colors';
import { useLiveRate } from '../../hooks/useLiveRate';
import { useInventory } from '../../hooks/useInventory';
import { useOrders } from '../../hooks/useOrders';
import { useShopContext } from '../../context/ShopContext';
import { useLanguage } from '../../context/LanguageContext';
import { ArrowRight } from 'lucide-react-native';

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
  onNavigateToAddShop,
  onNavigateToNotifications,
}) => {
  const { refetch: refetchRate, isLoading: isRateLoading } = useLiveRate();
  const { refetch: refetchInventory } = useInventory();
  const { data: orders, refetch: refetchOrders } = useOrders('ACTIVE');
  const { isSelectorModalVisible, setSelectorModalVisible } = useShopContext();
  const { t } = useLanguage();


  // Circle / Area rate state
  const [selectedCircle, setSelectedCircle] = useState<CircleRate>(REGIONAL_CIRCLES[0]);
  const [isCircleModalVisible, setIsCircleModalVisible] = useState(false);

  const onRefresh = async () => {
    await Promise.all([refetchRate(), refetchInventory(), refetchOrders()]);
  };

  const sampleRecentOrders = [
    {
      id: '#NF10245',
      date: '08 Aug 2025, 10:30 AM',
      deliveryDate: 'Delivery on 10 Aug 2025',
      kg: '200 kg',
      amount: '₹29,000.00',
      status: 'Delivered' as const,
    },
    {
      id: '#NF10246',
      date: '08 Aug 2025, 09:15 AM',
      deliveryDate: 'Delivery on 11 Aug 2025',
      kg: '150 kg',
      amount: '₹21,750.00',
      status: 'In Transit' as const,
    },
    {
      id: '#NF10247',
      date: '07 Aug 2025, 06:45 PM',
      deliveryDate: 'Delivery on 09 Aug 2025',
      kg: '300 kg',
      amount: '₹43,500.00',
      status: 'Pending' as const,
    },
  ];

  return (
    <View style={styles.container}>
      <Header
        onNotificationPress={onNavigateToNotifications}
        unreadNotifications={true}
        selectedCircleName={selectedCircle.name}
        onOpenCircleModal={() => setIsCircleModalVisible(true)}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={isRateLoading} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Today's Live Market Price Card */}
        <LiveRateCard
          selectedCircle={selectedCircle}
          onOpenCircleModal={() => setIsCircleModalVisible(true)}
          onBuyPress={onNavigateToBuy}
        />

        {/* NutriFarm Special Price (After Discount) Banner Card */}
        <SpecialPriceCard
          marketPrice={selectedCircle.marketPrice}
          specialPrice={selectedCircle.specialPrice}
          discountAmount={selectedCircle.discount}
          onBuyNow={onNavigateToBuy}
        />

        {/* Recent Orders Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('recentOrders')}</Text>
          <TouchableOpacity
            style={styles.viewAllBtn}
            onPress={onNavigateToOrders}
            activeOpacity={0.7}
          >
            <Text style={styles.viewAllText}>{t('viewAll')}</Text>
            <View style={styles.viewAllArrowCircle}>
              <ArrowRight size={12} color="#0A5D36" />
            </View>
          </TouchableOpacity>
        </View>


        {/* Orders List */}
        {sampleRecentOrders.map((item) => (
          <RecentOrderCard
            key={item.id}
            mockData={item}
            onViewOrder={onNavigateToOrderTracking}
          />
        ))}

        {orders && orders.length > 0 && orders[0] && (
          <RecentOrderCard
            order={orders[0]}
            onViewOrder={onNavigateToOrderTracking}
          />
        )}
      </ScrollView>

      {/* Circle / Area Selector Modal */}
      <CircleRateModal
        visible={isCircleModalVisible}
        selectedCircle={selectedCircle}
        onSelectCircle={(circle) => setSelectedCircle(circle)}
        onClose={() => setIsCircleModalVisible(false)}
      />

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
    backgroundColor: '#FAFAFA',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 100,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.gray900,
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0A5D36',
    marginRight: 4,
  },
  viewAllArrowCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: '#0A5D36',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

