import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '../../theme/colors';
import { useLanguage } from '../../context/LanguageContext';
import { CheckCircle2, Circle, ShieldCheck, AlertCircle } from 'lucide-react-native';

interface Step4PaymentOptionScreenProps {
  quantityKg?: number;
  initialOption?: 'ONLINE' | 'COD';
  onContinue: (paymentOption: 'ONLINE' | 'COD') => void;
}

export const Step4PaymentOptionScreen: React.FC<Step4PaymentOptionScreenProps> = ({
  quantityKg = 100,
  initialOption = 'ONLINE',
  onContinue,
}) => {
  const { t } = useLanguage();
  const [selectedOption, setSelectedOption] = useState<'ONLINE' | 'COD'>(initialOption);
  const totalSavings = quantityKg * 5;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>{t('step4Title')}</Text>
        <Text style={styles.subheading}>{t('step4Sub')}</Text>

        {/* Option 1: Pay Online & Save (Recommended) */}
        <TouchableOpacity
          style={[
            styles.optionCard,
            selectedOption === 'ONLINE' && styles.selectedOptionCard,
          ]}
          activeOpacity={0.85}
          onPress={() => setSelectedOption('ONLINE')}
        >
          <View style={styles.optionHeader}>
            <View style={styles.titleRow}>
              {selectedOption === 'ONLINE' ? (
                <CheckCircle2 size={20} color="#0A5D36" style={{ marginRight: 10 }} />
              ) : (
                <Circle size={20} color={colors.gray300} style={{ marginRight: 10 }} />
              )}
              <Text style={styles.optionTitle}>{t('payOnlineSave')}</Text>
              <View style={styles.recommendedBadge}>
                <Text style={styles.recommendedText}>{t('recommended')}</Text>
              </View>
            </View>
          </View>

          <Text style={styles.optionSub}>{t('payOnlineSub')}</Text>

          <View style={styles.savingsPill}>
            <Text style={styles.savingsPillText}>{t('youAreSaving')} ₹{totalSavings.toLocaleString('en-IN')}.00</Text>
          </View>
        </TouchableOpacity>

        {/* Option 2: Cash on Delivery */}
        <TouchableOpacity
          style={[
            styles.optionCard,
            selectedOption === 'COD' && styles.selectedOptionCard,
          ]}
          activeOpacity={0.85}
          onPress={() => setSelectedOption('COD')}
        >
          <View style={styles.optionHeader}>
            <View style={styles.titleRow}>
              {selectedOption === 'COD' ? (
                <CheckCircle2 size={20} color="#0A5D36" style={{ marginRight: 10 }} />
              ) : (
                <Circle size={20} color={colors.gray300} style={{ marginRight: 10 }} />
              )}
              <Text style={styles.optionTitle}>{t('cashOnDelivery')}</Text>
            </View>
          </View>

          <Text style={styles.optionSub}>{t('codSub')}</Text>

          {/* Warning Box when COD selected or shown below */}
          <View style={styles.warningBox}>
            <AlertCircle size={16} color="#D97706" style={{ marginRight: 8, marginTop: 1 }} />
            <Text style={styles.warningText}>{t('codWarning')}</Text>
          </View>
        </TouchableOpacity>

        {/* Security Banner Box */}
        <View style={styles.securityBox}>
          <ShieldCheck size={20} color="#0A5D36" style={{ marginRight: 10 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.securityTitle}>{t('safeSecureTitle')}</Text>
            <Text style={styles.securitySub}>{t('safeSecureSub')}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom Continue Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.continueBtn}
          activeOpacity={0.88}
          onPress={() => onContinue(selectedOption)}
        >
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
  optionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  selectedOptionCard: {
    borderColor: '#0A5D36',
    backgroundColor: '#FFFFFF',
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.gray900,
  },
  recommendedBadge: {
    backgroundColor: '#DCFCE7',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 10,
    marginLeft: 8,
  },
  recommendedText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0A5D36',
  },
  optionSub: {
    fontSize: 13,
    color: colors.gray600,
    marginLeft: 30,
    marginBottom: 10,
  },
  savingsPill: {
    backgroundColor: '#E8F5E9',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginLeft: 30,
    alignSelf: 'flex-start',
  },
  savingsPillText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0A5D36',
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFBEB',
    padding: 12,
    borderRadius: 12,
    marginLeft: 30,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  warningText: {
    flex: 1,
    fontSize: 12,
    color: '#B45309',
    fontWeight: '600',
    lineHeight: 16,
  },
  securityBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#C8E6C9',
    marginTop: 6,
  },
  securityTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0A5D36',
  },
  securitySub: {
    fontSize: 11,
    color: '#2E7D32',
    marginTop: 2,
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
