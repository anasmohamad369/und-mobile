import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { colors } from '../../theme/colors';
import { Store, ArrowLeft } from 'lucide-react-native';

interface AddFirstShopScreenProps {
  onCompleteRegistration: (shopData: {
    name: string;
    mobile: string;
    address: string;
    city: string;
    pincode: string;
  }) => void;
  onBack: () => void;
  loading?: boolean;
}

export const AddFirstShopScreen: React.FC<AddFirstShopScreenProps> = ({
  onCompleteRegistration,
  onBack,
  loading = false,
}) => {
  const [name, setName] = useState<string>('NutriFarm - Bopal');
  const [mobile, setMobile] = useState<string>('9876543211');
  const [address, setAddress] = useState<string>('Shop 4, Bopal Main Road, Opp SBI Bank');
  const [city, setCity] = useState<string>('Ahmedabad');
  const [pincode, setPincode] = useState<string>('380058');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSaveShop = () => {
    const errs: { [key: string]: string } = {};

    if (!name.trim()) errs.name = 'Shop Name is required';
    if (!mobile.trim() || mobile.length !== 10) errs.mobile = 'Valid 10-digit mobile required';
    if (!address.trim()) errs.address = 'Shop Address is required';
    if (!city.trim()) errs.city = 'City is required';
    if (!pincode.trim() || pincode.length !== 6) errs.pincode = 'Valid 6-digit Pincode required';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    onCompleteRegistration({
      name,
      mobile,
      address,
      city,
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
            <Store size={32} color={colors.primary} />
          </View>
          <Text style={styles.title}>Add Your First Shop</Text>
          <Text style={styles.subtitle}>You can add more shops later from your profile.</Text>
        </View>

        <View style={styles.formGroup}>
          <Input
            label="Shop Name *"
            placeholder="NutriFarm - Bopal"
            value={name}
            onChangeText={(v) => {
              setName(v);
              if (errors.name) setErrors(e => ({ ...e, name: '' }));
            }}
            error={errors.name}
          />

          <Input
            label="Shop Mobile *"
            prefix="+91"
            placeholder="9876543211"
            keyboardType="phone-pad"
            maxLength={10}
            value={mobile}
            onChangeText={(v) => {
              setMobile(v);
              if (errors.mobile) setErrors(e => ({ ...e, mobile: '' }));
            }}
            error={errors.mobile}
          />

          <Input
            label="Shop Address *"
            placeholder="Shop 4, Main Road, Opp SBI Bank"
            value={address}
            onChangeText={(v) => {
              setAddress(v);
              if (errors.address) setErrors(e => ({ ...e, address: '' }));
            }}
            error={errors.address}
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
          title="Save Shop & Complete Registration"
          variant="primary"
          size="lg"
          loading={loading}
          onPress={handleSaveShop}
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
