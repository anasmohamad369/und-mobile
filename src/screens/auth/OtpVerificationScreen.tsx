import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { colors } from '../../theme/colors';
import { useAuthContext } from '../../context/AuthContext';
import { authApi } from '../../api/auth.api';
import { ShieldCheck, Info, ArrowLeft } from 'lucide-react-native';

interface OtpVerificationScreenProps {
  onVerifiedNewUser: () => void;
  onVerifiedExistingUser: () => void;
  onBack: () => void;
}

export const OtpVerificationScreen: React.FC<OtpVerificationScreenProps> = ({
  onVerifiedNewUser,
  onVerifiedExistingUser,
  onBack,
}) => {
  const insets = useSafeAreaInsets();
  const { verifiedMobile, setVerificationToken, loginWithExistingAccount } = useAuthContext();
  const [otp, setOtp] = useState<string>('123456');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [resendMessage, setResendMessage] = useState<string>('');

  const handleVerifyOtp = async () => {
    setError('');
    if (!otp || otp.length !== 6) {
      setError('Please enter the full 6-digit OTP code');
      return;
    }

    try {
      setLoading(true);
      const res = await authApi.verifyOtp(verifiedMobile, otp);

      if (res.success && res.data) {
        setVerificationToken(res.data.verificationToken);

        if (res.data.retailer && res.data.token) {
          await loginWithExistingAccount(res.data.retailer, res.data.token);
          onVerifiedExistingUser();
        } else {
          onVerifiedNewUser();
        }
      } else {
        setError(res.error || 'Invalid OTP code');
      }
    } catch (e: any) {
      setError(e.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendMessage('Resending OTP...');
    await authApi.sendOtp(verifiedMobile);
    setTimeout(() => {
      setResendMessage('OTP resent successfully to +91 ' + verifiedMobile);
    }, 800);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.topHeader, { paddingTop: Math.max(insets.top, 16) }]}>
        <TouchableOpacity style={styles.backBtn} activeOpacity={0.7} onPress={onBack}>
          <ArrowLeft size={22} color={colors.gray900} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.contentBody}>
          <View style={styles.header}>
            <View style={styles.iconBox}>
              <ShieldCheck size={30} color={colors.primary} />
            </View>
            <Text style={styles.title}>Verify Your Mobile</Text>
            <Text style={styles.subtitle}>
              We sent a 6-digit OTP code to: {'\n'}
              <Text style={styles.mobileHighlight}>+91 {verifiedMobile || '9876543210'}</Text>
            </Text>
          </View>

          <View style={styles.formGroup}>
            <Input
              label="Enter 6-Digit OTP *"
              placeholder="123456"
              keyboardType="number-pad"
              maxLength={6}
              value={otp}
              onChangeText={(val) => {
                setOtp(val);
                if (error) setError('');
              }}
              error={error}
              style={styles.otpInput}
            />

            <View style={styles.devHintBox}>
              <Info size={15} color={colors.info} style={{ marginRight: 6 }} />
              <Text style={styles.devHintText}>
                DEV HINT: Enter <Text style={{ fontWeight: '800' }}>123456</Text> to verify.
              </Text>
            </View>

            {resendMessage ? (
              <Text style={styles.resendSuccessText}>{resendMessage}</Text>
            ) : null}

            <View style={styles.resendRow}>
              <Text style={styles.resendPrompt}>Didn't receive OTP? </Text>
              <TouchableOpacity onPress={handleResend} activeOpacity={0.7}>
                <Text style={styles.resendBtnText}>Resend OTP</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Button
            title="Verify"
            variant="primary"
            size="lg"
            loading={loading}
            onPress={handleVerifyOtp}
            style={styles.button}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 30,
    justifyContent: 'space-between',
  },
  contentBody: {
    paddingTop: 10,
  },
  header: {
    alignItems: 'flex-start',
    marginBottom: 28,
  },
  iconBox: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.gray900,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: colors.gray600,
    marginTop: 6,
    lineHeight: 22,
  },
  mobileHighlight: {
    fontWeight: '800',
    color: colors.gray900,
  },
  formGroup: {
    marginBottom: 24,
  },
  otpInput: {
    letterSpacing: 8,
    fontSize: 22,
    fontWeight: '800',
  },
  devHintBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.infoLight,
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  devHintText: {
    fontSize: 12,
    color: colors.info,
    flex: 1,
  },
  resendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
  },
  resendPrompt: {
    fontSize: 13,
    color: colors.gray500,
  },
  resendBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  resendSuccessText: {
    fontSize: 12,
    color: colors.success,
    textAlign: 'center',
    marginTop: 10,
    fontWeight: '600',
  },
  button: {
    marginTop: 8,
  },
});
