import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { colors } from '../../theme/colors';
import { useAuthContext } from '../../context/AuthContext';
import { Lock, ShieldCheck } from 'lucide-react-native';

interface EditProfileScreenProps {
  onSuccess: () => void;
}

export const EditProfileScreen: React.FC<EditProfileScreenProps> = ({ onSuccess }) => {
  const { retailer, updateProfile } = useAuthContext();

  const [businessName, setBusinessName] = useState<string>(retailer?.businessName || '');
  const [ownerName, setOwnerName] = useState<string>(retailer?.ownerName || '');
  const [alternateMobile, setAlternateMobile] = useState<string>(retailer?.alternateMobile || '');
  const [email, setEmail] = useState<string>(retailer?.email || '');
  const [addressLine1, setAddressLine1] = useState<string>(retailer?.addressLine1 || '');
  const [city, setCity] = useState<string>(retailer?.city || '');
  const [pincode, setPincode] = useState<string>(retailer?.pincode || '');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSave = async () => {
    setLoading(true);
    const updated = await updateProfile({
      businessName,
      ownerName,
      alternateMobile,
      email,
      addressLine1,
      city,
      pincode,
    });
    setLoading(false);

    if (updated) {
      Alert.alert('Profile Updated', 'Your business details have been saved successfully.');
      onSuccess();
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.screenTitle}>Edit Business Profile</Text>

      <View style={styles.formGroup}>
        <Input
          label="Business / Retailer Name *"
          value={businessName}
          onChangeText={setBusinessName}
        />

        <Input
          label="Owner Name *"
          value={ownerName}
          onChangeText={setOwnerName}
        />

        <View style={styles.lockedBox}>
          <View style={styles.lockedHeader}>
            <Lock size={14} color={colors.gray600} style={{ marginRight: 6 }} />
            <Text style={styles.lockedTitle}>Primary Verified Mobile Number (Locked)</Text>
          </View>
          <Text style={styles.lockedValue}>+91 {retailer?.mobile || '9876543210'}</Text>
          <Text style={styles.lockedSub}>
            Primary verified mobile cannot be changed without re-verifying via OTP.
          </Text>
        </View>

        <Input
          label="Alternate Contact Mobile"
          prefix="+91"
          value={alternateMobile}
          onChangeText={setAlternateMobile}
        />

        <Input
          label="Email Address"
          value={email}
          onChangeText={setEmail}
        />

        <Input
          label="Business Address Line 1"
          value={addressLine1}
          onChangeText={setAddressLine1}
        />

        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 6 }}>
            <Input
              label="City"
              value={city}
              onChangeText={setCity}
            />
          </View>
          <View style={{ flex: 1, marginLeft: 6 }}>
            <Input
              label="Pincode"
              value={pincode}
              onChangeText={setPincode}
            />
          </View>
        </View>
      </View>

      <Button
        title="Save Changes"
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
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 10,
  },
  lockedBox: {
    backgroundColor: colors.gray100,
    borderWidth: 1.5,
    borderColor: colors.gray300,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  lockedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lockedTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.gray700,
  },
  lockedValue: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.gray900,
    marginTop: 4,
  },
  lockedSub: {
    fontSize: 11,
    color: colors.gray500,
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
  },
  saveBtn: {
    marginTop: 10,
    marginBottom: 20,
  },
});
