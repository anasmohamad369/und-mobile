import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
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
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card style={styles.card}>
        <View style={styles.topRow}>
          <TouchableOpacity style={styles.backBtn} activeOpacity={0.7} onPress={onBack}>
            <ArrowLeft size={22} color={colors.gray900} />
          </TouchableOpacity>
        </View>

        <View style={styles.header}>
          <View style={styles.iconBox}>
            <MapPin size={32} color={colors.primary} />
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
      </Card>
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
  card: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 20,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
  },
  topRow: {
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    marginBottom: 16,
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.gray900,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: colors.gray500,
    marginTop: 4,
  },
  formGroup: {
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
  },
});
