import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { colors } from '../../theme/colors';
import { useShopContext } from '../../context/ShopContext';
import { Store, Navigation } from 'lucide-react-native';

interface AddShopScreenProps {
  onSuccess: () => void;
}

export const AddShopScreen: React.FC<AddShopScreenProps> = ({ onSuccess }) => {
  const { addNewShop } = useShopContext();

  const [name, setName] = useState<string>('ABC Chicken - SG Highway');
  const [mobile, setMobile] = useState<string>('9876543213');
  const [address, setAddress] = useState<string>('G-12, Titanium City Centre, SG Highway');
  const [city, setCity] = useState<string>('Ahmedabad');
  const [pincode, setPincode] = useState<string>('380054');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState<boolean>(false);

  const handleUseCurrentLocation = () => {
    Alert.alert('GPS Location Fetched', 'Location set to SG Highway, Ahmedabad (23.0415° N, 72.5112° E)');
  };

  const handleSave = async () => {
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

    setLoading(true);
    const created = await addNewShop({
      name,
      mobile,
      address,
      city,
      pincode,
      latitude: 23.0415,
      longitude: 72.5112,
    });
    setLoading(false);

    if (created) {
      onSuccess();
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.screenTitle}>Add New Shop</Text>
      <Text style={styles.screenSub}>Add another shop location for wholesale delivery.</Text>

      <TouchableOpacity
        style={styles.locationBtn}
        activeOpacity={0.8}
        onPress={handleUseCurrentLocation}
      >
        <Navigation size={18} color={colors.primary} style={{ marginRight: 8 }} />
        <Text style={styles.locationBtnText}>Use Current Location (GPS)</Text>
      </TouchableOpacity>

      <View style={styles.formGroup}>
        <Input
          label="Shop Name *"
          placeholder="e.g. ABC Chicken - Satellite"
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
          placeholder="9876543212"
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
          placeholder="Plot 18, Main Road"
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
          placeholder="380054"
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
        title="Save Shop"
        variant="primary"
        size="lg"
        loading={loading}
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
  locationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryLight,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  locationBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  formGroup: {
    marginBottom: 10,
  },
  saveBtn: {
    marginTop: 10,
    marginBottom: 20,
  },
});
