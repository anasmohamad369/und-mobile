import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { colors } from '../../theme/colors';
import { useShopContext } from '../../context/ShopContext';
import { Shop } from '../../types';
import { Store, MapPin, Phone, Plus, CheckCircle2 } from 'lucide-react-native';

interface ShopsScreenProps {
  onAddShop: () => void;
}

export const ShopsScreen: React.FC<ShopsScreenProps> = ({ onAddShop }) => {
  const insets = useSafeAreaInsets();
  const { shops, selectedShop, selectShop } = useShopContext();

  const renderShopItem = ({ item }: { item: Shop }) => {
    const isSelected = selectedShop?.id === item.id;

    return (
      <Card style={[styles.shopCard, isSelected && styles.selectedCard]}>
        <View style={styles.cardHeader}>
          <View style={styles.shopNameBox}>
            <Store size={20} color={isSelected ? colors.primary : colors.gray700} style={{ marginRight: 8 }} />
            <Text style={styles.shopName}>{item.name}</Text>
          </View>

          {isSelected ? (
            <View style={styles.activePill}>
              <CheckCircle2 size={12} color={colors.success} style={{ marginRight: 4 }} />
              <Text style={styles.activeText}>Active Delivering</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.selectBtn}
              onPress={() => selectShop(item.id)}
            >
              <Text style={styles.selectBtnText}>Select for Delivery</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.infoRow}>
          <MapPin size={16} color={colors.gray500} style={{ marginRight: 6, marginTop: 2 }} />
          <Text style={styles.addressText}>
            {item.address}, {item.city} - {item.pincode}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Phone size={16} color={colors.gray500} style={{ marginRight: 6 }} />
          <Text style={styles.phoneText}>+91 {item.mobile}</Text>
        </View>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 14) }]}>
        <Text style={styles.title}>Your Shops</Text>
        <Text style={styles.subtitle}>
          Manage shop addresses for wholesale chicken delivery.
        </Text>
      </View>

      <FlatList
        data={shops}
        keyExtractor={item => item.id.toString()}
        renderItem={renderShopItem}
        contentContainerStyle={styles.listContent}
      />

      <View style={styles.footer}>
        <Button
          title="Add Another Shop"
          variant="primary"
          size="lg"
          icon={<Plus size={20} color={colors.textWhite} />}
          onPress={onAddShop}
        />
      </View>
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
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: colors.gray500,
    marginTop: 4,
  },
  listContent: {
    padding: 16,
    paddingBottom: 20,
  },
  shopCard: {
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: colors.gray200,
  },
  selectedCard: {
    borderColor: colors.primary,
    backgroundColor: '#FFF1F2',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  shopNameBox: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  shopName: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.gray900,
  },
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.successLight,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  activeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.success,
  },
  selectBtn: {
    backgroundColor: colors.gray200,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  selectBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.gray800,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 4,
  },
  addressText: {
    fontSize: 13,
    color: colors.gray700,
    flex: 1,
  },
  phoneText: {
    fontSize: 13,
    color: colors.gray600,
    fontWeight: '600',
  },
  footer: {
    padding: 16,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
  },
});
