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
import { useInventory } from '../../hooks/useInventory';
import { CircleRate, REGIONAL_CIRCLES } from '../../data/circlesData';
import {
  ShoppingBag,
  Minus,
  Plus,
  AlertTriangle,
  ArrowRight,
  CreditCard,
  Banknote,
  Tag,
  CheckCircle2,
  Circle as CircleOutline,
  MapPin,
} from 'lucide-react-native';

interface BuyChickenScreenProps {
  selectedCircle?: CircleRate;
  onContinueToDelivery: (
    quantityKg: number,
    effectiveRatePerKg: number,
    paymentMethod: 'ONLINE' | 'COD',
    selectedCircle: CircleRate
  ) => void;
}

const QUICK_CHIPS = [50, 100, 250, 500, 1000];

export const BuyChickenScreen: React.FC<BuyChickenScreenProps> = ({
  selectedCircle = REGIONAL_CIRCLES[0],
  onContinueToDelivery,
}) => {
  const { data: inventoryData } = useInventory();

  const availableStock = inventoryData?.availableKg || 4250;
  const baseMarketRate = selectedCircle.marketPrice; // e.g. 150

  const [paymentMethod, setPaymentMethod] = useState<'ONLINE' | 'COD'>('ONLINE');
  const [quantity, setQuantity] = useState<number>(250);
  const [inputText, setInputText] = useState<string>('250');
  const [stockError, setStockError] = useState<string>('');

  const discountAmount = paymentMethod === 'ONLINE' ? 5 : 0;
  const effectiveRate = baseMarketRate - discountAmount; // e.g. 145 or 150
  const subtotal = quantity * effectiveRate;
  const totalSavings = quantity * discountAmount;
  const totalAmount = subtotal;

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

  const handleProceed = () => {
    if (quantity <= 0) {
      Alert.alert('Invalid Quantity', 'Please select at least 1 KG to purchase.');
      return;
    }
    if (quantity > availableStock) {
      setStockError(`Not Enough Stock! Only ${availableStock.toLocaleString()} KG is currently available. Please reduce your quantity.`);
      return;
    }

    onContinueToDelivery(quantity, effectiveRate, paymentMethod, selectedCircle);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={styles.screenTitle}>Buy Live Chicken</Text>

      {/* Selected Market Circle & Rate Summary */}
      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <MapPin size={14} color="#0A5D36" style={{ marginRight: 4 }} />
            <Text style={styles.summaryLabel} numberOfLines={1}>{selectedCircle.name}</Text>
          </View>
          <Text style={styles.rateText}>₹{baseMarketRate} <Text style={styles.unitText}>/ KG</Text></Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Available Stock</Text>
          <Text style={styles.stockText}>{availableStock.toLocaleString()} KG</Text>
        </View>
      </View>

      {/* UPFRONT PAYMENT METHOD SELECTION CARD */}
      <View style={styles.paymentSelectionCard}>
        <View style={styles.paymentSectionHeader}>
          <Tag size={18} color="#FF5500" style={{ marginRight: 6 }} />
          <Text style={styles.paymentSectionTitle}>Select Payment Method (Prior Offer)</Text>
        </View>
        <Text style={styles.paymentSectionSub}>
          Pay online prior to order to claim instant ₹5.00/kg discount!
        </Text>

        {/* Option 1: Online Payment (Discount Offer) */}
        <TouchableOpacity
          style={[
            styles.paymentOption,
            paymentMethod === 'ONLINE' && styles.selectedPaymentOption,
          ]}
          activeOpacity={0.85}
          onPress={() => setPaymentMethod('ONLINE')}
        >
          <View style={styles.radioBox}>
            {paymentMethod === 'ONLINE' ? (
              <CheckCircle2 size={22} color="#FF5500" />
            ) : (
              <CircleOutline size={22} color={colors.gray400} />
            )}
          </View>

          <View style={styles.paymentOptionContent}>
            <View style={styles.optionTitleRow}>
              <CreditCard size={18} color={paymentMethod === 'ONLINE' ? '#FF5500' : colors.gray700} style={{ marginRight: 6 }} />
              <Text style={[styles.optionTitle, paymentMethod === 'ONLINE' && styles.selectedOptionTitle]}>
                Online Payment (Prepaid / UPI)
              </Text>
              <View style={styles.offerBadge}>
                <Text style={styles.offerBadgeText}>SAVE ₹5/KG</Text>
              </View>
            </View>

            <Text style={styles.optionDesc}>
              Instant discount applied: <Text style={styles.discountPriceText}>₹{baseMarketRate - 5}.00 / KG</Text> (Market: ₹{baseMarketRate}/kg)
            </Text>
          </View>
        </TouchableOpacity>

        {/* Option 2: Cash on Delivery (COD) */}
        <TouchableOpacity
          style={[
            styles.paymentOption,
            paymentMethod === 'COD' && styles.selectedPaymentOption,
          ]}
          activeOpacity={0.85}
          onPress={() => setPaymentMethod('COD')}
        >
          <View style={styles.radioBox}>
            {paymentMethod === 'COD' ? (
              <CheckCircle2 size={22} color="#FF5500" />
            ) : (
              <CircleOutline size={22} color={colors.gray400} />
            )}
          </View>

          <View style={styles.paymentOptionContent}>
            <View style={styles.optionTitleRow}>
              <Banknote size={18} color={paymentMethod === 'COD' ? '#FF5500' : colors.gray700} style={{ marginRight: 6 }} />
              <Text style={[styles.optionTitle, paymentMethod === 'COD' && styles.selectedOptionTitle]}>
                Cash on Delivery (COD)
              </Text>
            </View>

            <Text style={styles.optionDesc}>
              Charged at regular market rate: <Text style={styles.codPriceText}>₹{baseMarketRate}.00 / KG</Text>
            </Text>
          </View>
        </TouchableOpacity>
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

      {/* Transparent Price Calculation & Discount Callout */}
      <Card style={styles.calcCard}>
        <Text style={styles.calcTitle}>Price Breakdown</Text>

        <View style={styles.calcRow}>
          <Text style={styles.calcLabel}>Quantity</Text>
          <Text style={styles.calcVal}>{quantity} KG</Text>
        </View>

        <View style={styles.calcRow}>
          <Text style={styles.calcLabel}>Base Market Rate ({selectedCircle.name})</Text>
          <Text style={styles.calcVal}>₹{baseMarketRate}.00 / KG</Text>
        </View>

        {paymentMethod === 'ONLINE' ? (
          <View style={styles.calcRow}>
            <Text style={styles.calcLabelGreen}>Online Instant Discount</Text>
            <Text style={styles.calcValGreen}>-₹5.00 / KG</Text>
          </View>
        ) : (
          <View style={styles.calcRow}>
            <Text style={styles.calcLabelMuted}>Online Discount (Not Applied)</Text>
            <Text style={styles.calcValMuted}>₹0.00 / KG</Text>
          </View>
        )}

        <View style={styles.calcRow}>
          <Text style={styles.calcLabel}>Effective Rate Applied</Text>
          <Text style={styles.calcValHighlight}>₹{effectiveRate}.00 / KG</Text>
        </View>

        <View style={styles.calcRow}>
          <Text style={styles.calcLabel}>Subtotal</Text>
          <Text style={styles.calcVal}>₹{subtotal.toLocaleString('en-IN')}.00</Text>
        </View>

        <View style={styles.calcRow}>
          <Text style={styles.calcLabel}>Delivery Charges</Text>
          <Text style={[styles.calcVal, { color: colors.success }]}>FREE (₹0)</Text>
        </View>

        {paymentMethod === 'ONLINE' && totalSavings > 0 && (
          <View style={styles.savingsBanner}>
            <Tag size={16} color="#16A34A" style={{ marginRight: 6 }} />
            <Text style={styles.savingsBannerText}>
              You save <Text style={styles.savingsBold}>₹{totalSavings.toLocaleString('en-IN')}.00</Text> on this order by paying online!
            </Text>
          </View>
        )}

        <View style={styles.divider} />

        <View style={styles.calcRow}>
          <Text style={styles.totalLabel}>Total Payable Amount</Text>
          <Text style={styles.totalVal}>₹{totalAmount.toLocaleString('en-IN')}.00</Text>
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
    backgroundColor: '#FAFAFA',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.gray900,
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  summaryCard: {
    flex: 1,
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.gray500,
  },
  rateText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0A5D36',
    marginTop: 4,
  },
  unitText: {
    fontSize: 12,
    color: colors.gray500,
    fontWeight: '600',
  },
  stockText: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.gray900,
    marginTop: 4,
  },
  paymentSelectionCard: {
    backgroundColor: '#FFF7F3',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#FFDDD0',
    padding: 14,
    marginBottom: 16,
  },
  paymentSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentSectionTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#E65100',
  },
  paymentSectionSub: {
    fontSize: 12,
    color: colors.gray600,
    marginTop: 2,
    marginBottom: 12,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: '#F1F5F9',
  },
  selectedPaymentOption: {
    borderColor: '#FF5500',
    backgroundColor: '#FFF5F0',
  },
  radioBox: {
    marginRight: 10,
  },
  paymentOptionContent: {
    flex: 1,
  },
  optionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.gray900,
  },
  selectedOptionTitle: {
    color: '#FF5500',
    fontWeight: '800',
  },
  offerBadge: {
    backgroundColor: '#D32F2F',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6,
    marginLeft: 6,
  },
  offerBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
  },
  optionDesc: {
    fontSize: 12,
    color: colors.gray600,
    marginTop: 3,
  },
  discountPriceText: {
    fontWeight: '800',
    color: '#D32F2F',
  },
  codPriceText: {
    fontWeight: '800',
    color: colors.gray800,
  },
  quantityCard: {
    marginBottom: 14,
    backgroundColor: '#FFFFFF',
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '800',
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
    borderColor: '#FF5500',
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
    backgroundColor: '#FFF0EA',
    borderColor: '#FF5500',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.gray700,
  },
  activeChipText: {
    color: '#FF5500',
    fontWeight: '800',
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
    backgroundColor: '#FFFFFF',
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
    fontSize: 13,
    color: colors.gray600,
  },
  calcLabelGreen: {
    fontSize: 13,
    fontWeight: '700',
    color: '#16A34A',
  },
  calcValGreen: {
    fontSize: 13,
    fontWeight: '800',
    color: '#16A34A',
  },
  calcLabelMuted: {
    fontSize: 13,
    color: colors.gray400,
  },
  calcValMuted: {
    fontSize: 13,
    color: colors.gray400,
  },
  calcVal: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.gray800,
  },
  calcValHighlight: {
    fontSize: 14,
    fontWeight: '800',
    color: '#D32F2F',
  },
  savingsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginTop: 8,
  },
  savingsBannerText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#16A34A',
  },
  savingsBold: {
    fontWeight: '900',
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
    fontSize: 22,
    fontWeight: '900',
    color: '#FF5500',
  },
  continueBtn: {
    marginBottom: 20,
    backgroundColor: '#FF5500',
  },
});

