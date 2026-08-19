import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { colors } from '../../theme/colors';
import { useShopContext } from '../../context/ShopContext';
import { Shop } from '../../types';
import { Store, MapPin, Phone, Plus, CheckCircle2, Pencil, Trash2, Navigation } from 'lucide-react-native';
import { AddShopScreen } from '../shops/AddShopScreen';

interface ShopsScreenProps {
  onAddShop: () => void;
}

export const ShopsScreen: React.FC<ShopsScreenProps> = ({ onAddShop }) => {
  const insets = useSafeAreaInsets();
  const { shops, deleteShop } = useShopContext();
  const [editingShop, setEditingShop] = useState<Shop | null>(null);

  const handleDelete = (shop: Shop) => {
    Alert.alert(
      'Delete Shop Location',
      `Are you sure you want to delete "${shop.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteShop(shop.id);
          },
        },
      ]
    );
  };

  if (editingShop) {
    return (
      <View style={styles.container}>
        <View style={[styles.header, { paddingTop: Math.max(insets.top, 14) }]}>
          <Text style={styles.title}>Edit Shop</Text>
        </View>
        <AddShopScreen
          shopToEdit={editingShop}
          onSuccess={() => setEditingShop(null)}
        />
      </View>
    );
  }

  const renderShopItem = ({ item }: { item: Shop }) => {
    return (
      <Card style={styles.shopCard}>
        {/* Top Header Row */}
        <View style={styles.cardHeader}>
          <View style={styles.shopNameBox}>
            <View style={styles.iconBox}>
              {item.photoUrl ? (
                <Image source={{ uri: item.photoUrl }} style={styles.shopThumbImage} />
              ) : (
                <Store size={20} color={colors.primary} />
              )}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.shopName}>{item.name}</Text>

              {/* Blinkit / Zomato GPS Map Tag */}
              <View style={styles.gpsRow}>
                <Navigation size={12} color="#0A5D36" style={{ marginRight: 3 }} />
                <Text style={styles.gpsText}>
                  GPS: {item.latitude ? `${item.latitude.toFixed(4)}° N, ${item.longitude?.toFixed(4)}° E` : 'Map Coordinates Verified'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Address Row */}
        <View style={styles.infoRow}>
          <MapPin size={16} color={colors.gray500} style={styles.infoIcon} />
          <Text style={styles.addressText}>
            {item.address}, {item.city} - {item.pincode}
          </Text>
        </View>

        {/* Phone Row */}
        <View style={styles.infoRow}>
          <Phone size={16} color={colors.gray500} style={styles.infoIcon} />
          <Text style={styles.phoneText}>+91 {item.mobile}</Text>
        </View>

        {/* Action Buttons Row: Edit & Delete */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.actionBtnEdit}
            activeOpacity={0.7}
            onPress={() => setEditingShop(item)}
          >
            <Pencil size={14} color={colors.primaryDark} style={{ marginRight: 4 }} />
            <Text style={styles.actionBtnEditText}>Edit Location</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtnDelete}
            activeOpacity={0.7}
            onPress={() => handleDelete(item)}
          >
            <Trash2 size={14} color="#DC2626" style={{ marginRight: 4 }} />
            <Text style={styles.actionBtnDeleteText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 14) }]}>
        <Text style={styles.title}>Your Shops</Text>
        <Text style={styles.subtitle}>
          Manage shop locations & GPS map addresses for wholesale chicken delivery.
        </Text>
      </View>

      <FlatList
        data={shops}
        keyExtractor={item => item.id.toString()}
        renderItem={renderShopItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <TouchableOpacity
            style={styles.addShopCard}
            activeOpacity={0.8}
            onPress={onAddShop}
          >
            <View style={styles.addShopIconCircle}>
              <Plus size={22} color="#FFFFFF" />
            </View>
            <View style={styles.addShopCardTextContainer}>
              <Text style={styles.addShopCardTitle}>Add New Shop Location</Text>
            
            </View>
          </TouchableOpacity>
        }
      />

      <View style={styles.footer}>
        <Button
          title="Add Another Shop (GPS Map)"
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
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  headerAddBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
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
    paddingBottom: 85,
  },
  shopCard: {
    marginBottom: 14,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: colors.gray200,
    padding: 14,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  selectedCard: {
    borderColor: '#0A5D36',
    backgroundColor: '#F4FBF7',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  shopNameBox: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 8,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    overflow: 'hidden',
  },
  shopThumbImage: {
    width: 40,
    height: 40,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  iconBoxActive: {
    backgroundColor: '#E8F5E9',
  },
  shopName: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.gray900,
  },
  gpsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  gpsText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0A5D36',
  },
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#A5D6A7',
  },
  activeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0A5D36',
  },
  selectBtn: {
    backgroundColor: colors.primaryLight,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFD6C6',
  },
  selectBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 6,
  },
  infoIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  addressText: {
    fontSize: 13,
    color: colors.gray800,
    fontWeight: '600',
    flex: 1,
    lineHeight: 18,
  },
  phoneText: {
    fontSize: 13,
    color: colors.gray600,
    fontWeight: '700',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 12,
  },
  actionBtnEdit: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0EA',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  actionBtnEditText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  actionBtnDelete: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  actionBtnDeleteText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#DC2626',
  },
  addShopCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7F3',
    borderWidth: 1.5,
    borderColor: '#FFD6C6',
    borderStyle: 'dashed',
    borderRadius: 18,
    padding: 16,
    marginTop: 4,
    marginBottom: 16,
  },
  addShopIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  addShopCardTextContainer: {
    flex: 1,
  },
  addShopCardTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.primaryDark,
  },
  addShopCardSub: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.gray600,
    marginTop: 2,
  },
  footer: {
    padding: 16,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
  },
});
