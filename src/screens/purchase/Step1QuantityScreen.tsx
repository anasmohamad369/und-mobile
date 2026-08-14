import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import { CircleRate, REGIONAL_CIRCLES } from '../../data/circlesData';
import { colors } from '../../theme/colors';
import { useLanguage } from '../../context/LanguageContext';
import { Sparkles, Minus, Plus } from 'lucide-react-native';

interface Step1QuantityScreenProps {
  selectedCircle?: CircleRate;
  initialQuantity?: number;
  onContinue: (quantityKg: number) => void;
}

const QUICK_CHIPS = [50, 100, 250, 500, 1000];

export const Step1QuantityScreen: React.FC<Step1QuantityScreenProps> = ({
  selectedCircle = REGIONAL_CIRCLES[0],
  initialQuantity = 100,
  onContinue,
}) => {
  const { t } = useLanguage();
  const [quantity, setQuantity] = useState<number>(initialQuantity);
  const [inputText, setInputText] = useState<string>(initialQuantity.toString());

  const updateQuantity = (val: number) => {
    const clamped = Math.max(10, val);
    setQuantity(clamped);
    setInputText(clamped.toString());
  };

  const handleInputChange = (text: string) => {
    setInputText(text);
    const parsed = parseInt(text, 10);
    if (!isNaN(parsed)) {
      setQuantity(parsed);
    } else {
      setQuantity(0);
    }
  };

  const handleProceed = () => {
    if (quantity < 10) {
      Alert.alert('Minimum Order', t('minOrderNote'));
      return;
    }
    onContinue(quantity);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>{t('step1Title')}</Text>
        <Text style={styles.subheading}>{t('step1Sub')}</Text>

        {/* Input Card */}
        <View style={styles.inputCard}>
          <Text style={styles.inputLabel}>{t('quantityKgLabel')}</Text>

          <View style={styles.inputRow}>
            <View style={styles.inputBox}>
              <TextInput
                style={styles.textInput}
                keyboardType="number-pad"
                value={inputText}
                onChangeText={handleInputChange}
              />
              <Text style={styles.unitSuffix}>kg</Text>
            </View>

            <View style={styles.stepperBtns}>
              <TouchableOpacity
                style={styles.stepperBtn}
                onPress={() => updateQuantity(quantity - 10)}
                activeOpacity={0.7}
              >
                <Minus size={18} color={colors.gray800} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.stepperBtn}
                onPress={() => updateQuantity(quantity + 10)}
                activeOpacity={0.7}
              >
                <Plus size={18} color={colors.gray800} />
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.minText}>{t('minOrderNote')}</Text>

          {/* Quick Selection Chips */}
          <View style={styles.chipsRow}>
            {QUICK_CHIPS.map((chip) => (
              <TouchableOpacity
                key={chip}
                style={[styles.chip, quantity === chip && styles.activeChip]}
                onPress={() => updateQuantity(chip)}
                activeOpacity={0.7}
              >
                <Text style={[styles.chipText, quantity === chip && styles.activeChipText]}>
                  {chip} kg
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Green Promo Card */}
        <View style={styles.promoCard}>
          <View style={styles.promoLeft}>
            <View style={styles.sparkleRow}>
              <Sparkles size={16} color="#0A5D36" style={{ marginRight: 6 }} />
              <Text style={styles.promoTitle}>{t('bulkOrderTitle')}</Text>
            </View>
            <Text style={styles.promoSub}>{t('bulkOrderSub')}</Text>
          </View>

          <Image
            source={require('../../../assets/special-chicken.png')}
            style={styles.promoImage}
            resizeMode="contain"
          />
        </View>
      </ScrollView>

      {/* Fixed Bottom Continue Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.continueBtn} activeOpacity={0.88} onPress={handleProceed}>
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
  inputCard: {
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
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.gray600,
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 52,
    marginRight: 10,
    backgroundColor: '#FFFFFF',
  },
  textInput: {
    flex: 1,
    fontSize: 22,
    fontWeight: '900',
    color: colors.gray900,
    padding: 0,
  },
  unitSuffix: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.gray500,
  },
  stepperBtns: {
    flexDirection: 'row',
    gap: 8,
  },
  stepperBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  minText: {
    fontSize: 12,
    color: colors.gray500,
    marginTop: 8,
    marginBottom: 14,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  activeChip: {
    backgroundColor: '#E8F5E9',
    borderColor: '#0A5D36',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.gray700,
  },
  activeChipText: {
    color: '#0A5D36',
    fontWeight: '900',
  },
  promoCard: {
    backgroundColor: '#E8F5E9',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  promoLeft: {
    flex: 1,
  },
  sparkleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  promoTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0A5D36',
  },
  promoSub: {
    fontSize: 13,
    color: '#2E7D32',
    fontWeight: '600',
    marginTop: 4,
  },
  promoImage: {
    width: 70,
    height: 70,
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
