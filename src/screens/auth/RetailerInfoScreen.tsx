import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
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
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card style={styles.card}>
        <View style={styles.topRow}>
          <TouchableOpacity style={styles.backBtn} activeOpacity={0.7} onPress={onBack}>
            <ArrowLeft size={22} color={colors.gray900} />
          </TouchableOpacity>
        </View>

        <View style={styles.header}>
          <View style={styles.iconBox}>
            <Building2 size={32} color={colors.primary} />
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
  },
});
