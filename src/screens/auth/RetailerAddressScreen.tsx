import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { colors } from '../../theme/colors';
import { MapPin, ArrowLeft } from 'lucide-react-native';

interface RetailerAddressScreenProps {
  onContinue: (address: {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
  }) => void;
  onBack: () => void;
}

export const RetailerAddressScreen: React.FC<RetailerAddressScreenProps> = ({ onContinue, onBack }) => {
  const insets = useSafeAreaInsets();
  const [addressLine1, setAddressLine1] = useState<string>('Shop 12, Poultry Wholesale Market');
  const [addressLine2, setAddressLine2] = useState<string>('Near Ring Road');
  const [city, setCity] = useState<string>('Ahmedabad');
  const [state, setState] = useState<string>('Gujarat');
  const [pincode, setPincode] = useState<string>('380058');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleNext = () => {
    const errs: { [key: string]: string } = {};

    if (!addressLine1.trim()) errs.addressLine1 = 'Address Line 1 is required';
    if (!city.trim()) errs.city = 'City is required';
    if (!pincode.trim() || pincode.length !== 6) errs.pincode = 'Valid 6-digit Pincode required';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    onContinue({
      addressLine1,
      addressLine2,
      city,
      state,
      pincode,
    });
  };

  return (
    <View style={styles.container}>
      <View style={[styles.topHeader, { paddingTop: Math.max(insets.top, 16) }]}>
        <TouchableOpacity style={styles.backBtn} activeOpacity={0.7} onPress={onBack}>
          <ArrowLeft size={22} color={colors.gray900} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.iconBox}>
            <MapPin size={30} color={colors.primary} />
          </View>
          <Text style={styles.title}>Business Address</Text>
          <Text style={styles.subtitle}>Enter your main registered business location</Text>
        </View>

        <View style={styles.formGroup}>
          <Input
            label="Address Line 1 *"
            placeholder="Shop 12, Market Complex"
            value={addressLine1}
            onChangeText={(v) => {
              setAddressLine1(v);
              if (errors.addressLine1) setErrors(e => ({ ...e, addressLine1: '' }));
            }}
            error={errors.addressLine1}
          />

          <Input
            label="Address Line 2"
            placeholder="Opposite Central Bus Stop"
            value={addressLine2}
            onChangeText={setAddressLine2}
          />

          <Input
            label="City *"
            placeholder="Ahmedabad"
            value={city}
            onChangeText={(v) => {
              setCity(v);
              if (errors.city) setErrors(e => ({ ...e, city: '' }));
            }}
            error={errors.city}
          />

          <Input
            label="State *"
            placeholder="Gujarat"
            value={state}
            onChangeText={setState}
          />

          <Input
            label="Pincode *"
            placeholder="380058"
            keyboardType="number-pad"
            maxLength={6}
            value={pincode}
            onChangeText={(v) => {
              setPincode(v);
              if (errors.pincode) setErrors(e => ({ ...e, pincode: '' }));
            }}
            error={errors.pincode}
          />
        </View>

        <Button
          title="Continue"
          variant="primary"
          size="lg"
          onPress={handleNext}
          style={styles.button}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  topHeader: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 30,
  },
  header: {
    marginBottom: 20,
  },
  iconBox: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: colors.gray900,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: colors.gray500,
    marginTop: 4,
  },
  formGroup: {
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
    marginBottom: 20,
  },
});
