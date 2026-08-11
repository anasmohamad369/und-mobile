import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { colors } from '../../theme/colors';
import { useShopContext } from '../../context/ShopContext';
import { MapPin, Calendar, Clock, CheckCircle2, Circle, ArrowRight } from 'lucide-react-native';

interface DeliverySelectionScreenProps {
  quantityKg: number;
  ratePerKg: number;
  onChangeShop: () => void;
  onProceedToReview: (deliveryDate: string, deliverySlot: string) => void;
}

const DATES = [
  { id: '2026-08-11', label: 'Today (11 Aug)' },
  { id: '2026-08-12', label: 'Tomorrow (12 Aug)' },
];

const SLOTS = [
  '10:00 AM - 12:00 PM',
  '12:00 PM - 02:00 PM',
  '02:00 PM - 04:00 PM',
  '04:00 PM - 06:00 PM',
];

export const DeliverySelectionScreen: React.FC<DeliverySelectionScreenProps> = ({
  quantityKg,
  ratePerKg,
  onChangeShop,
  onProceedToReview,
}) => {
  const { selectedShop } = useShopContext();
  const [selectedDate, setSelectedDate] = useState<string>('2026-08-11');
  const [selectedSlot, setSelectedSlot] = useState<string>('10:00 AM - 12:00 PM');

  const handleNext = () => {
    onProceedToReview(selectedDate, selectedSlot);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.screenTitle}>Delivery Details</Text>

      {/* Selected Shop Preview */}
      <Card style={styles.shopCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.sectionLabel}>Deliver To</Text>
          <TouchableOpacity onPress={onChangeShop} activeOpacity={0.7}>
            <Text style={styles.changeShopText}>Change Shop</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.shopDetailRow}>
          <MapPin size={22} color={colors.primary} style={{ marginRight: 10, marginTop: 2 }} />
          <View style={styles.shopInfo}>
            <Text style={styles.shopName}>{selectedShop?.name || 'ABC Chicken - Bopal'}</Text>
            <Text style={styles.shopAddress}>
              {selectedShop?.address || 'Bopal Main Road'}, {selectedShop?.city || 'Ahmedabad'}
            </Text>
            <Text style={styles.shopPincode}>Pincode: {selectedShop?.pincode || '380058'}</Text>
          </View>
        </View>
      </Card>

      {/* Delivery Date Selection */}
      <Card style={styles.sectionCard}>
        <View style={styles.iconTitleRow}>
          <Calendar size={20} color={colors.primary} style={{ marginRight: 8 }} />
          <Text style={styles.sectionLabel}>Select Delivery Date</Text>
        </View>

        <View style={styles.dateGrid}>
          {DATES.map(dateItem => {
            const isSelected = selectedDate === dateItem.id;
            return (
              <TouchableOpacity
                key={dateItem.id}
                style={[styles.dateBox, isSelected && styles.selectedDateBox]}
                onPress={() => setSelectedDate(dateItem.id)}
              >
                <Text style={[styles.dateText, isSelected && styles.selectedDateText]}>
                  {dateItem.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </Card>

      {/* Delivery Time Slot Selection */}
      <Card style={styles.sectionCard}>
        <View style={styles.iconTitleRow}>
          <Clock size={20} color={colors.primary} style={{ marginRight: 8 }} />
          <Text style={styles.sectionLabel}>Choose Delivery Time Slot</Text>
        </View>

        <View style={styles.slotsList}>
          {SLOTS.map(slot => {
            const isSelected = selectedSlot === slot;
            return (
              <TouchableOpacity
                key={slot}
                style={[styles.slotOption, isSelected && styles.selectedSlotOption]}
                onPress={() => setSelectedSlot(slot)}
              >
                {isSelected ? (
                  <CheckCircle2 size={20} color={colors.primary} style={{ marginRight: 10 }} />
                ) : (
                  <Circle size={20} color={colors.gray400} style={{ marginRight: 10 }} />
                )}
                <Text style={[styles.slotText, isSelected && styles.selectedSlotText]}>
                  {slot}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </Card>

      {/* Summary Box */}
      <Card variant="bordered" style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Order Snapshot</Text>
        <Text style={styles.summarySub}>
          {quantityKg} KG Live Broiler Chicken @ ₹{ratePerKg}/KG = ₹{(quantityKg * ratePerKg).toLocaleString()}
        </Text>
      </Card>

      <Button
        title="Proceed to Order Review"
        variant="primary"
        size="lg"
        icon={<ArrowRight size={20} color={colors.textWhite} />}
        onPress={handleNext}
        style={styles.continueBtn}
      />
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
  screenTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.gray900,
    marginBottom: 14,
  },
  shopCard: {
    marginBottom: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.gray900,
  },
  changeShopText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  shopDetailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.gray50,
    padding: 12,
    borderRadius: 12,
  },
  shopInfo: {
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
  shopPincode: {
    fontSize: 12,
    color: colors.gray500,
    marginTop: 2,
  },
  sectionCard: {
    marginBottom: 14,
  },
  iconTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  dateGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  dateBox: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: colors.gray50,
    borderWidth: 1.5,
    borderColor: colors.gray200,
    alignItems: 'center',
  },
  selectedDateBox: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  dateText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.gray700,
  },
  selectedDateText: {
    color: colors.primaryDark,
  },
  slotsList: {
    gap: 8,
  },
  slotOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    backgroundColor: colors.gray50,
    borderWidth: 1.5,
    borderColor: colors.gray200,
  },
  selectedSlotOption: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  slotText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.gray800,
  },
  selectedSlotText: {
    color: colors.primaryDark,
  },
  summaryCard: {
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.gray700,
  },
  summarySub: {
    fontSize: 13,
    color: colors.gray600,
    marginTop: 2,
  },
  continueBtn: {
    marginBottom: 20,
  },
});
