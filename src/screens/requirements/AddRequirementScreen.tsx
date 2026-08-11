import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { colors } from '../../theme/colors';
import { useShopContext } from '../../context/ShopContext';
import { useCreateRequirementMutation } from '../../hooks/useRequirements';
import { CalendarRange, Info, CheckCircle2 } from 'lucide-react-native';

interface AddRequirementScreenProps {
  onSuccess: () => void;
}

export const AddRequirementScreen: React.FC<AddRequirementScreenProps> = ({ onSuccess }) => {
  const { shops, selectedShop } = useShopContext();
  const createRequirementMutation = useCreateRequirementMutation();

  const [shopId, setShopId] = useState<number>(selectedShop?.id || shops[0]?.id || 1);
  const [chickenType] = useState<string>('Live Broiler Chicken');
  const [expectedKg, setExpectedKg] = useState<string>('1000');
  const [fromDate, setFromDate] = useState<string>('2026-08-12');
  const [toDate, setToDate] = useState<string>('2026-08-18');
  const [notes, setNotes] = useState<string>('Expecting high weekend demand.');
  const [error, setError] = useState<string>('');

  const handleSave = async () => {
    setError('');
    const kgNum = parseInt(expectedKg, 10);

    if (isNaN(kgNum) || kgNum <= 0) {
      setError('Please enter a valid expected KG quantity');
      return;
    }

    try {
      await createRequirementMutation.mutateAsync({
        shopId,
        chickenType,
        expectedKg: kgNum,
        fromDate,
        toDate,
        notes,
      });

      onSuccess();
    } catch (e: any) {
      setError(e.message || 'Failed to save requirement');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.screenTitle}>Expected Requirement</Text>
      <Text style={styles.screenSub}>Help us forecast wholesale farm supply for your shop.</Text>

      {/* Critical System Notice */}
      <View style={styles.noticeBox}>
        <Info size={20} color={colors.info} style={{ marginRight: 10, marginTop: 2 }} />
        <View style={styles.noticeTextCol}>
          <Text style={styles.noticeTitle}>Demand Forecasting Signal</Text>
          <Text style={styles.noticeDesc}>
            This is NOT a binding purchase order. Submitting expected requirements will NEVER deduct inventory, reserve stock, or initiate payment.
          </Text>
        </View>
      </View>

      <Card style={styles.formCard}>
        <Input
          label="Selected Shop *"
          value={shops.find(s => s.id === shopId)?.name || 'ABC Chicken - Bopal'}
          editable={false}
        />

        <Input
          label="Chicken Type *"
          value={chickenType}
          editable={false}
        />

        <Input
          label="Expected Quantity (KG) *"
          placeholder="1000"
          keyboardType="number-pad"
          value={expectedKg}
          onChangeText={setExpectedKg}
          error={error}
        />

        <View style={styles.dateRow}>
          <View style={{ flex: 1, marginRight: 6 }}>
            <Input
              label="From Date *"
              placeholder="12 Aug"
              value={fromDate}
              onChangeText={setFromDate}
            />
          </View>
          <View style={{ flex: 1, marginLeft: 6 }}>
            <Input
              label="To Date *"
              placeholder="18 Aug"
              value={toDate}
              onChangeText={setToDate}
            />
          </View>
        </View>

        <Input
          label="Notes / Special Requirements"
          placeholder="e.g. Catering order planned for weekend"
          value={notes}
          onChangeText={setNotes}
          multiline
          style={{ height: 70, textAlignVertical: 'top' }}
        />
      </Card>

      <Button
        title="Save Requirement"
        variant="primary"
        size="lg"
        loading={createRequirementMutation.isPending}
        onPress={handleSave}
        style={styles.saveBtn}
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
  },
  screenSub: {
    fontSize: 13,
    color: colors.gray500,
    marginTop: 2,
    marginBottom: 14,
  },
  noticeBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.infoLight,
    borderWidth: 1,
    borderColor: '#93C5FD',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
  },
  noticeTextCol: {
    flex: 1,
  },
  noticeTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.info,
  },
  noticeDesc: {
    fontSize: 12,
    color: colors.gray700,
    marginTop: 2,
    lineHeight: 18,
  },
  formCard: {
    marginBottom: 20,
  },
  dateRow: {
    flexDirection: 'row',
  },
  saveBtn: {
    marginBottom: 20,
  },
});
