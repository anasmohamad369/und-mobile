import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { colors } from '../../theme/colors';
import { useAuthContext } from '../../context/AuthContext';
import { authApi } from '../../api/auth.api';
import { Smartphone, ShieldCheck, ArrowLeft } from 'lucide-react-native';

interface MobileNumberScreenProps {
  onContinue: () => void;
  onBack: () => void;
}

export const MobileNumberScreen: React.FC<MobileNumberScreenProps> = ({ onContinue, onBack }) => {
  const { setVerifiedMobile } = useAuthContext();
  const [mobile, setMobile] = useState<string>('9876543210');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSendOtp = async () => {
    setError('');
    if (!mobile || mobile.length !== 10 || !/^[6-9]\d{9}$/.test(mobile)) {
      setError('Please enter a valid 10-digit Indian mobile number starting with 6-9');
      return;
    }

    try {
      setLoading(true);
      const res = await authApi.sendOtp(mobile);
      if (res.success) {
        setVerifiedMobile(mobile);
        onContinue();
      } else {
        setError(res.error || 'Failed to send verification OTP');
      }
    } catch (e: any) {
      setError(e.message || 'Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Card style={styles.card}>
          <View style={styles.topRow}>
            <TouchableOpacity style={styles.backBtn} activeOpacity={0.7} onPress={onBack}>
              <ArrowLeft size={22} color={colors.gray900} />
            </TouchableOpacity>
          </View>

          <View style={styles.header}>
            <View style={styles.iconBox}>
              <Smartphone size={32} color={colors.primary} />
            </View>
            <Text style={styles.title}>Create Your Account</Text>
            <Text style={styles.subtitle}>Enter your mobile number to get started with NutriFarm</Text>
          </View>

          <View style={styles.formGroup}>
            <Input
              label="Mobile Number *"
              prefix="+91"
              placeholder="9876543210"
              keyboardType="phone-pad"
              maxLength={10}
              value={mobile}
              onChangeText={(val) => {
                setMobile(val);
                if (error) setError('');
              }}
              error={error}
            />
            <Text style={styles.disclaimerText}>
              We'll send you a 6-digit verification code via SMS.
            </Text>
          </View>

          <Button
            title="Continue"
            variant="primary"
            size="lg"
            loading={loading}
            onPress={handleSendOtp}
            style={styles.button}
          />

          <View style={styles.securityNote}>
            <ShieldCheck size={14} color={colors.gray500} style={{ marginRight: 6 }} />
            <Text style={styles.securityText}>Verified NutriFarm Registration</Text>
          </View>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 24,
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
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  iconBox: {
    width: 60,
    height: 60,
    borderRadius: 30,
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
    fontWeight: '500',
  },
  formGroup: {
    marginBottom: 20,
  },
  disclaimerText: {
    fontSize: 12,
    color: colors.gray500,
    marginTop: -8,
  },
  button: {
    marginTop: 4,
    marginBottom: 16,
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
  },
  securityText: {
    fontSize: 12,
    color: colors.gray500,
    fontWeight: '600',
  },
});
