import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { colors } from '../../theme/colors';
import { useAuthContext } from '../../context/AuthContext';
import { Building2, CheckCircle, ArrowLeft } from 'lucide-react-native';

interface RetailerInfoScreenProps {
  onContinue: (info: {
    businessName: string;
    ownerName: string;
    alternateMobile?: string;
    email?: string;
    gstNumber?: string;
  }) => void;
  onBack: () => void;
}

export const RetailerInfoScreen: React.FC<RetailerInfoScreenProps> = ({ onContinue, onBack }) => {
  const insets = useSafeAreaInsets();
  const { verifiedMobile } = useAuthContext();
  const [businessName, setBusinessName] = useState<string>('NutriFarm Chicken Traders');
  const [ownerName, setOwnerName] = useState<string>('Mohammed');
  const [alternateMobile, setAlternateMobile] = useState<string>('9876543211');
  const [email, setEmail] = useState<string>('owner@nutrifarm.com');
  const [gstNumber, setGstNumber] = useState<string>('24ABCDE1234F1Z5');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleNext = () => {
    const errs: { [key: string]: string } = {};

    if (!businessName.trim()) {
      errs.businessName = 'Business/Retailer name is required';
    }
    if (!ownerName.trim()) {
      errs.ownerName = 'Owner name is required';
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    onContinue({
      businessName,
      ownerName,
      alternateMobile,
      email,
      gstNumber,
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
            <Building2 size={30} color={colors.primary} />
          </View>
          <Text style={styles.title}>Tell Us About Your Business</Text>
          <Text style={styles.subtitle}>Enter your NutriFarm retailer details</Text>
        </View>

        <View style={styles.formGroup}>
          <Input
            label="Business / Retailer Name *"
            placeholder="NutriFarm Chicken Traders"
            value={businessName}
            onChangeText={(v) => {
              setBusinessName(v);
              if (errors.businessName) setErrors(e => ({ ...e, businessName: '' }));
            }}
            error={errors.businessName}
          />

          <Input
            label="Owner Name *"
            placeholder="Mohammed"
            value={ownerName}
            onChangeText={(v) => {
              setOwnerName(v);
              if (errors.ownerName) setErrors(e => ({ ...e, ownerName: '' }));
            }}
            error={errors.ownerName}
          />

          <View style={styles.verifiedMobileBox}>
            <Text style={styles.verifiedMobileLabel}>Verified Mobile Number</Text>
            <View style={styles.verifiedMobileRow}>
              <Text style={styles.verifiedMobileText}>+91 {verifiedMobile || '9876543210'}</Text>
              <View style={styles.verifiedBadge}>
                <CheckCircle size={14} color={colors.success} style={{ marginRight: 4 }} />
                <Text style={styles.verifiedBadgeText}>Verified</Text>
              </View>
            </View>
          </View>

          <Input
            label="Alternate Mobile"
            prefix="+91"
            placeholder="9876543211"
            keyboardType="phone-pad"
            maxLength={10}
            value={alternateMobile}
            onChangeText={setAlternateMobile}
          />

          <Input
            label="Email Address"
            placeholder="owner@business.com"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          <Input
            label="GST / Tax Number"
            placeholder="24ABCDE1234F1Z5"
            value={gstNumber}
            onChangeText={setGstNumber}
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
  verifiedMobileBox: {
    backgroundColor: colors.gray50,
    borderWidth: 1.5,
    borderColor: colors.gray200,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  verifiedMobileLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.gray500,
  },
  verifiedMobileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  verifiedMobileText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.gray900,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.successLight,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  verifiedBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.success,
  },
  button: {
    marginTop: 10,
    marginBottom: 20,
  },
});
