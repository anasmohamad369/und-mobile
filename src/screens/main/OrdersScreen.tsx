import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { colors } from '../../theme/colors';
import { useOrders } from '../../hooks/useOrders';
import { useLanguage } from '../../context/LanguageContext';
import { Order } from '../../types';
import { ShoppingBag, ChevronRight, Truck } from 'lucide-react-native';

interface OrdersScreenProps {
  onSelectOrder: (orderId: string) => void;
}

export const OrdersScreen: React.FC<OrdersScreenProps> = ({ onSelectOrder }) => {
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'COMPLETED'>('ALL');
  const { data: orders, isLoading, refetch } = useOrders(filter);

  const renderOrderItem = ({ item }: { item: Order }) => {
    return (
      <Card style={styles.orderCard}>
        <View style={styles.cardHeader}>
          <View style={styles.orderIdContainer}>
            <Truck size={18} color="#0A5D36" style={{ marginRight: 6 }} />
            <Text style={styles.orderId}>{item.id}</Text>
          </View>
          <Badge status={item.status} />
        </View>

        <Text style={styles.shopName}>{item.delivery.shopName}</Text>
        <Text style={styles.shopAddress}>{item.delivery.shopAddress}</Text>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <View style={styles.infoCol}>
            <Text style={styles.infoLabel}>{t('quantity')}</Text>
            <Text style={styles.infoVal}>{item.quantityKg} KG</Text>
          </View>

          <View style={styles.infoCol}>
            <Text style={styles.infoLabel}>{t('marketPriceRate')}</Text>
            <Text style={styles.infoVal}>₹{item.ratePerKg}/KG</Text>
          </View>

          <View style={styles.infoCol}>
            <Text style={styles.infoLabel}>{t('finalAmount')}</Text>
            <Text style={styles.totalVal}>₹{item.totalAmount.toLocaleString()}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.viewBtn}
          activeOpacity={0.7}
          onPress={() => onSelectOrder(item.id)}
        >
          <Text style={styles.viewBtnText}>{t('trackOrder')}</Text>
          <ChevronRight size={16} color="#0A5D36" />
        </TouchableOpacity>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 14) }]}>
        <Text style={styles.title}>{t('myOrdersTitle')}</Text>

        {/* Filter Tabs */}
        <View style={styles.tabContainer}>
          {(['ALL', 'ACTIVE', 'COMPLETED'] as const).map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, filter === tab && styles.activeTab]}
              onPress={() => setFilter(tab)}
            >
              <Text style={[styles.tabText, filter === tab && styles.activeTabText]}>
                {tab === 'ALL' ? t('viewAll') : tab === 'ACTIVE' ? t('activeOrdersTab') : t('pastOrdersTab')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>


      <FlatList
        data={orders || []}
        keyExtractor={item => item.id}
        renderItem={renderOrderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <ShoppingBag size={48} color={colors.gray300} />
            <Text style={styles.emptyTitle}>No orders found</Text>
            <Text style={styles.emptySub}>Your wholesale purchases will appear here.</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.surface,
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: colors.gray900,
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.gray100,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: colors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.gray500,
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '800',
  },
  listContent: {
    padding: 16,
    paddingBottom: 85,
  },
  orderCard: {
    marginBottom: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  orderIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderId: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.gray900,
  },
  shopName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.gray800,
  },
  shopAddress: {
    fontSize: 12,
    color: colors.gray500,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray200,
    marginVertical: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.gray50,
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  infoCol: {
    alignItems: 'flex-start',
  },
  infoLabel: {
    fontSize: 11,
    color: colors.gray500,
    fontWeight: '500',
  },
  infoVal: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.gray800,
    marginTop: 2,
  },
  totalVal: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primary,
    marginTop: 2,
  },
  viewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
  },
  viewBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.gray700,
    marginTop: 14,
  },
  emptySub: {
    fontSize: 14,
    color: colors.gray500,
    marginTop: 4,
  },
});
