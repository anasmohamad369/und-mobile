import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import { useShopContext } from '../../context/ShopContext';
import { Button } from '../common/Button';
import { colors } from '../../theme/colors';
import { MapPin, Plus, CheckCircle2, Circle } from 'lucide-react-native';

interface ShopSelectorModalProps {
  visible: boolean;
  onClose: () => void;
  onAddNewShop?: () => void;
}

export const ShopSelectorModal: React.FC<ShopSelectorModalProps> = ({
  visible,
  onClose,
  onAddNewShop,
}) => {
  const { shops, selectedShop, selectShop } = useShopContext();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalCard}>
              <View style={styles.header}>
                <Text style={styles.title}>Select Shop</Text>
                <Text style={styles.subtitle}>
                  Where do you want this order delivered?
                </Text>
              </View>

              <ScrollView style={{ maxHeight: 300 }}>
                {shops.map(shop => {
                  const isSelected = selectedShop?.id === shop.id;
                  return (
                    <TouchableOpacity
                      key={shop.id}
                      style={[
                        styles.shopOption,
                        isSelected && styles.selectedOption,
                      ]}
                      activeOpacity={0.8}
                      onPress={() => selectShop(shop.id)}
                    >
                      <View style={styles.radioContainer}>
                        {isSelected ? (
                          <CheckCircle2 size={22} color={colors.primary} />
                        ) : (
                          <Circle size={22} color={colors.gray400} />
                        )}
                      </View>

                      <View style={styles.shopInfo}>
                        <Text style={[styles.shopName, isSelected && styles.selectedShopName]}>
                          {shop.name}
                        </Text>
                        <Text style={styles.shopAddress}>
                          {shop.address}, {shop.city}
                        </Text>
                        <Text style={styles.shopMobile}>Mob: +91 {shop.mobile}</Text>
                      </View>

                      {shop.isDefault && (
                        <View style={styles.defaultPill}>
                          <Text style={styles.defaultPillText}>Default</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              {onAddNewShop && (
                <TouchableOpacity
                  style={styles.addShopBtn}
                  activeOpacity={0.7}
                  onPress={() => {
                    onClose();
                    onAddNewShop();
                  }}
                >
                  <Plus size={18} color={colors.primary} style={{ marginRight: 6 }} />
                  <Text style={styles.addShopText}>Add Another Shop</Text>
                </TouchableOpacity>
              )}

              <Button
                title="Continue"
                variant="primary"
                size="lg"
                onPress={onClose}
                style={{ marginTop: 16 }}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '80%',
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.gray900,
  },
  subtitle: {
    fontSize: 14,
    color: colors.gray500,
    marginTop: 4,
  },
  shopOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.gray200,
    marginBottom: 10,
    backgroundColor: colors.surface,
  },
  selectedOption: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  radioContainer: {
    marginRight: 12,
  },
  shopInfo: {
    flex: 1,
  },
  shopName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.gray900,
  },
  selectedShopName: {
    color: colors.primaryDark,
  },
  shopAddress: {
    fontSize: 13,
    color: colors.gray600,
    marginTop: 2,
  },
  shopMobile: {
    fontSize: 12,
    color: colors.gray500,
    marginTop: 2,
  },
  defaultPill: {
    backgroundColor: colors.gray200,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  defaultPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.gray700,
  },
  addShopBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    borderRadius: 12,
    marginTop: 8,
  },
  addShopText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
});
