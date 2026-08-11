import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { colors } from '../../theme/colors';
import { useLiveRate } from '../../hooks/useLiveRate';
import { useInventory } from '../../hooks/useInventory';
import { ShoppingBag, Minus, Plus, AlertTriangle, ArrowRight } from 'lucide-react-native';

interface BuyChickenScreenProps {
  onContinueToDelivery: (quantityKg: number, ratePerKg: number) => void;
}

const QUICK_CHIPS = [50, 100, 250, 500, 1000];

export const BuyChickenScreen: React.FC<BuyChickenScreenProps> = ({ onContinueToDelivery }) => {
  const { data: rateData } = useLiveRate();
  const { data: inventoryData } = useInventory();

  const currentRate = rateData?.ratePerKg || 102;
  const availableStock = inventoryData?.availableKg || 4250;

  const [quantity, setQuantity] = useState<number>(250);
  const [inputText, setInputText] = useState<string>('250');
  const [stockError, setStockError] = useState<string>('');

  const updateQuantity = (val: number) => {
    const clamped = Math.max(0, val);
    setQuantity(clamped);
    setInputText(clamped ? clamped.toString() : '');

    if (clamped > availableStock) {
      setStockError(`Not Enough Stock! Only ${availableStock.toLocaleString()} KG is currently available. Please reduce your quantity.`);
    } else {
      setStockError('');
    }
  };

  const handleInputChange = (text: string) => {
    setInputText(text);
    const parsed = parseInt(text, 10);
    if (!isNaN(parsed)) {
      setQuantity(parsed);
      if (parsed > availableStock) {
        setStockError(`Not Enough Stock! Only ${availableStock.toLocaleString()} KG is currently available. Please reduce your quantity.`);
      } else {
        setStockError('');
      }
    } else {
      setQuantity(0);
      setStockError('');
    }
  };

  const subtotal = quantity * currentRate;
  const deliveryFee = 0;
  const totalAmount = subtotal + deliveryFee;

  const handleProceed = () => {
    if (quantity <= 0) {
      Alert.alert('Invalid Quantity', 'Please select at least 1 KG to purchase.');
      return;
    }
    if (quantity > availableStock) {
      setStockError(`Not Enough Stock! Only ${availableStock.toLocaleString()} KG is currently available. Please reduce your quantity.`);
      return;
    }

    onContinueToDelivery(quantity, currentRate);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.screenTitle}>Buy Live Chicken</Text>

      {/* Rate & Inventory Overview */}
      <View style={styles.summaryRow}>
        <Card variant="bordered" style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Current Rate</Text>
          <Text style={styles.rateText}>₹{currentRate} / KG</Text>
        </Card>

        <Card variant="bordered" style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Available Stock</Text>
          <Text style={styles.stockText}>{availableStock.toLocaleString()} KG</Text>
        </Card>
      </View>

      {/* Quantity Stepper & Manual Entry */}
      <Card style={styles.quantityCard}>
        <Text style={styles.sectionLabel}>How many KG do you need?</Text>

        <View style={styles.stepperRow}>
          <TouchableOpacity
            style={styles.stepperBtn}
            onPress={() => updateQuantity(quantity - 50)}
            activeOpacity={0.7}
          >
            <Minus size={22} color={colors.gray800} />
          </TouchableOpacity>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.kgInput}
              keyboardType="number-pad"
              value={inputText}
              onChangeText={handleInputChange}
            />
            <Text style={styles.kgLabel}>KG</Text>
          </View>

          <TouchableOpacity
            style={styles.stepperBtn}
            onPress={() => updateQuantity(quantity + 50)}
            activeOpacity={0.7}
          >
            <Plus size={22} color={colors.gray800} />
          </TouchableOpacity>
        </View>

        {/* Quick Selection Chips */}
        <Text style={styles.quickLabel}>Quick Selection:</Text>
        <View style={styles.chipsRow}>
          {QUICK_CHIPS.map(chip => (
            <TouchableOpacity
              key={chip}
              style={[styles.chip, quantity === chip && styles.activeChip]}
              onPress={() => updateQuantity(chip)}
            >
              <Text style={[styles.chipText, quantity === chip && styles.activeChipText]}>
                {chip} KG
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Stock Validation Error Box */}
        {stockError ? (
          <View style={styles.errorBox}>
            <AlertTriangle size={18} color={colors.danger} style={{ marginRight: 8 }} />
            <Text style={styles.errorText}>{stockError}</Text>
          </View>
        ) : null}
      </Card>

      {/* Transparent Price Calculation */}
      <Card style={styles.calcCard}>
        <Text style={styles.calcTitle}>Price Breakdown</Text>

        <View style={styles.calcRow}>
          <Text style={styles.calcLabel}>Quantity</Text>
          <Text style={styles.calcVal}>{quantity} KG</Text>
        </View>

        <View style={styles.calcRow}>
          <Text style={styles.calcLabel}>Wholesale Rate</Text>
          <Text style={styles.calcVal}>₹{currentRate} / KG</Text>
        </View>

        <View style={styles.calcRow}>
          <Text style={styles.calcLabel}>Subtotal</Text>
          <Text style={styles.calcVal}>₹{subtotal.toLocaleString()}</Text>
        </View>

        <View style={styles.calcRow}>
          <Text style={styles.calcLabel}>Delivery Charges</Text>
          <Text style={[styles.calcVal, { color: colors.success }]}>FREE (₹0)</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.calcRow}>
          <Text style={styles.totalLabel}>Total Payable Amount</Text>
          <Text style={styles.totalVal}>₹{totalAmount.toLocaleString()}</Text>
        </View>
      </Card>

      <Button
        title="Continue to Delivery Details"
        variant="primary"
        size="lg"
        disabled={!!stockError || quantity <= 0}
        icon={<ArrowRight size={20} color={colors.textWhite} />}
        onPress={handleProceed}
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
  summaryRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  summaryCard: {
    flex: 1,
    padding: 14,
    backgroundColor: colors.surface,
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.gray500,
  },
  rateText: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primary,
    marginTop: 4,
  },
  stockText: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.gray900,
    marginTop: 4,
  },
  quantityCard: {
    marginBottom: 14,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.gray900,
    marginBottom: 14,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  stepperBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.gray300,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    backgroundColor: colors.gray50,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 56,
    minWidth: 140,
  },
  kgInput: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.gray900,
    textAlign: 'center',
  },
  kgLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.gray500,
    marginLeft: 6,
  },
  quickLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.gray500,
    marginBottom: 8,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: colors.gray100,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  activeChip: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.gray700,
  },
  activeChipText: {
    color: colors.primaryDark,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dangerLight,
    padding: 12,
    borderRadius: 10,
    marginTop: 14,
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: colors.danger,
  },
  calcCard: {
    marginBottom: 20,
  },
  calcTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.gray900,
    marginBottom: 12,
  },
  calcRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  calcLabel: {
    fontSize: 14,
    color: colors.gray600,
  },
  calcVal: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.gray800,
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray200,
    marginVertical: 10,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.gray900,
  },
  totalVal: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.primary,
  },
  continueBtn: {
    marginBottom: 20,
  },
});
