import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { CircleRate, REGIONAL_CIRCLES } from '../../data/circlesData';
import { colors } from '../../theme/colors';
import { useLanguage } from '../../context/LanguageContext';
import { Tag } from 'lucide-react-native';

interface Step3OrderSummaryScreenProps {
  quantityKg: number;
  deliveryDate: string;
  selectedCircle?: CircleRate;
  onChangeCircle?: () => void;
  onContinue: () => void;
}

export const Step3OrderSummaryScreen: React.FC<Step3OrderSummaryScreenProps> = ({
  quantityKg = 100,
  deliveryDate = '10 Aug 2025 (Sunday)',
  selectedCircle = REGIONAL_CIRCLES[0],
  onChangeCircle,
  onContinue,
}) => {
  const { t } = useLanguage();
  const marketRate = selectedCircle.marketPrice;
  const discountPerKg = 5;
  const marketTotal = quantityKg * marketRate;
  const discountTotal = quantityKg * discountPerKg;
  const finalPayable = marketTotal - discountTotal;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>{t('step3Title')}</Text>
        <Text style={styles.subheading}>{t('step3Sub')}</Text>

        {/* Card 1: Area, Date, Quantity */}
        <View style={styles.summaryCard}>
          <View style={styles.cardRowBetween}>
            <Text style={styles.rowLabel}>{t('deliveryArea')}</Text>
            <View style={styles.areaRight}>
              <Text style={styles.rowValueBold}>{selectedCircle.name}</Text>
              {onChangeCircle && (
                <TouchableOpacity onPress={onChangeCircle} activeOpacity={0.7}>
                  <Text style={styles.changeLink}>{t('change')}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={styles.cardRowBetween}>
            <Text style={styles.rowLabel}>{t('deliveryDate')}</Text>
            <Text style={styles.rowValueBold}>{deliveryDate}</Text>
          </View>

          <View style={styles.cardRowBetween}>
            <Text style={styles.rowLabel}>{t('quantity')}</Text>
            <Text style={styles.rowValueBold}>{quantityKg} Kg</Text>
          </View>
        </View>

        {/* Card 2: Price Calculation */}
        <View style={styles.summaryCard}>
          <View style={styles.cardRowBetween}>
            <Text style={styles.rowLabel}>{t('marketPriceRate')} (₹{marketRate}.00 /kg)</Text>
            <Text style={styles.rowValue}>₹{marketTotal.toLocaleString('en-IN')}.00</Text>
          </View>

          <View style={styles.cardRowBetween}>
            <Text style={styles.rowLabelGreen}>{t('nutrifarmDiscount')} (₹{discountPerKg}.00 /kg)</Text>
            <Text style={styles.rowValueGreen}>- ₹{discountTotal.toLocaleString('en-IN')}.00</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.cardRowBetween}>
            <Text style={styles.rowLabel}>{t('subtotal')}</Text>
            <Text style={styles.rowValue}>₹{marketTotal.toLocaleString('en-IN')}.00</Text>
          </View>

          <View style={styles.cardRowBetween}>
            <Text style={styles.rowLabelGreen}>{t('discount')}</Text>
            <Text style={styles.rowValueGreen}>- ₹{discountTotal.toLocaleString('en-IN')}.00</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.cardRowBetween}>
            <Text style={styles.finalLabel}>{t('finalPayableAmount')}</Text>
            <Text style={styles.finalPriceText}>
              ₹{finalPayable.toLocaleString('en-IN')}.00
            </Text>
          </View>

          <Text style={styles.savingSubtext}>
            {t('youAreSaving')} ₹{discountTotal.toLocaleString('en-IN')}.00
          </Text>
        </View>

        {/* Banner Tag */}
        <View style={styles.tagBanner}>
          <Tag size={16} color="#0A5D36" style={{ marginRight: 8 }} />
          <Text style={styles.tagText}>{t('onlineOfferTag')}</Text>
        </View>
      </ScrollView>

      {/* Fixed Bottom Continue Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.continueBtn} activeOpacity={0.88} onPress={onContinue}>
          <Text style={styles.continueBtnText}>{t('continueBtn')}</Text>
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
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  cardRowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 7,
  },
  rowLabel: {
    fontSize: 13,
    color: colors.gray600,
  },
  rowValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.gray800,
  },
  rowValueBold: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.gray900,
  },
  areaRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  changeLink: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0A5D36',
  },
  rowLabelGreen: {
    fontSize: 13,
    fontWeight: '700',
    color: '#16A34A',
  },
  rowValueGreen: {
    fontSize: 14,
    fontWeight: '800',
    color: '#16A34A',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 6,
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
  savingSubtext: {
    fontSize: 12,
    fontWeight: '800',
    color: '#16A34A',
    marginTop: 2,
  },
  tagBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  tagText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    color: '#0A5D36',
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
