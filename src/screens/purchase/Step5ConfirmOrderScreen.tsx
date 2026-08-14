import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { CircleRate, REGIONAL_CIRCLES } from '../../data/circlesData';
import { colors } from '../../theme/colors';
import { useLanguage } from '../../context/LanguageContext';
import { ShieldCheck } from 'lucide-react-native';

interface Step5ConfirmOrderScreenProps {
  quantityKg: number;
  deliveryDate: string;
  paymentOption: 'ONLINE' | 'COD';
  selectedCircle?: CircleRate;
  isPlacingOrder?: boolean;
  onPlaceOrder: () => void;
}

export const Step5ConfirmOrderScreen: React.FC<Step5ConfirmOrderScreenProps> = ({
  quantityKg = 100,
  deliveryDate = '10 Aug 2025 (Sunday)',
  paymentOption = 'ONLINE',
  selectedCircle = REGIONAL_CIRCLES[0],
  isPlacingOrder = false,
  onPlaceOrder,
}) => {
  const { t } = useLanguage();
  const marketRate = selectedCircle.marketPrice;
  const discountPerKg = paymentOption === 'ONLINE' ? 5 : 0;
  const marketTotal = quantityKg * marketRate;
  const discountTotal = quantityKg * discountPerKg;
  const finalPayable = marketTotal - discountTotal;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>{t('step5Title')}</Text>
        <Text style={styles.subheading}>{t('step5Sub')}</Text>

        {/* Confirmation Summary Card */}
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <Text style={styles.rowLabel}>{t('deliveryArea')}</Text>
            <Text style={styles.rowValBold}>{selectedCircle.name}</Text>
          </View>

          <View style={styles.cardRow}>
            <Text style={styles.rowLabel}>{t('deliveryDate')}</Text>
            <Text style={styles.rowValBold}>{deliveryDate}</Text>
          </View>

          <View style={styles.cardRow}>
            <Text style={styles.rowLabel}>{t('quantity')}</Text>
            <Text style={styles.rowValBold}>{quantityKg} Kg</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.cardRow}>
            <Text style={styles.rowLabel}>{t('marketPriceRate')} (₹{marketRate}.00 /kg)</Text>
            <Text style={styles.rowVal}>₹{marketTotal.toLocaleString('en-IN')}.00</Text>
          </View>

          {discountTotal > 0 && (
            <View style={styles.cardRow}>
              <Text style={styles.rowLabelGreen}>{t('nutrifarmDiscount')} (₹{discountPerKg}.00 /kg)</Text>
              <Text style={styles.rowValGreen}>- ₹{discountTotal.toLocaleString('en-IN')}.00</Text>
            </View>
          )}

          <View style={styles.divider} />

          <View style={styles.cardRow}>
            <Text style={styles.finalLabel}>{t('finalPayableAmount')}</Text>
            <Text style={styles.finalPriceText}>
              ₹{finalPayable.toLocaleString('en-IN')}.00
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.cardRow}>
            <Text style={styles.rowLabel}>{t('paymentMethod')}</Text>
            <Text style={styles.paymentVal}>
              {paymentOption === 'ONLINE' ? t('payOnlineSave') : t('cashOnDelivery')}
            </Text>
          </View>
        </View>

        {/* Terms Box */}
        <View style={styles.termsBox}>
          <ShieldCheck size={18} color="#0A5D36" style={{ marginRight: 8 }} />
          <Text style={styles.termsText}>{t('termsNote')}</Text>
        </View>
      </ScrollView>

      {/* Fixed Bottom Place Order Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.continueBtn}
          activeOpacity={0.88}
          onPress={onPlaceOrder}
          disabled={isPlacingOrder}
        >
          <Text style={styles.continueBtnText}>
            {isPlacingOrder ? 'PLACING ORDER...' : t('placeOrder')}
          </Text>
        </TouchableOpacity>
      </View>
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
  content: {
    padding: 16,
    paddingBottom: 20,
  },
  heading: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.gray900,
    marginTop: 4,
  },
  subheading: {
    fontSize: 14,
    color: colors.gray600,
    marginTop: 4,
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  rowLabel: {
    fontSize: 13,
    color: colors.gray600,
  },
  rowVal: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.gray800,
  },
  rowValBold: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.gray900,
  },
  rowLabelGreen: {
    fontSize: 13,
    fontWeight: '700',
    color: '#16A34A',
  },
  rowValGreen: {
    fontSize: 14,
    fontWeight: '800',
    color: '#16A34A',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 8,
  },
  finalLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.gray900,
  },
  finalPriceText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#D32F2F',
  },
  paymentVal: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0A5D36',
  },
  termsBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  termsText: {
    flex: 1,
    fontSize: 12,
    color: '#0A5D36',
    fontWeight: '600',
  },
  termsLink: {
    fontWeight: '800',
    textDecorationLine: 'underline',
  },
  bottomBar: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  continueBtn: {
    backgroundColor: '#0A5D36',
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0A5D36',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  continueBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
});
