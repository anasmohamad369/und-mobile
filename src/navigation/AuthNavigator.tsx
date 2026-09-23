import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SplashScreen } from '../screens/auth/SplashScreen';
import { WelcomeScreen } from '../screens/auth/WelcomeScreen';
import { MobileNumberScreen } from '../screens/auth/MobileNumberScreen';
import { OtpVerificationScreen } from '../screens/auth/OtpVerificationScreen';
import { RetailerInfoScreen } from '../screens/auth/RetailerInfoScreen';
import { RetailerAddressScreen } from '../screens/auth/RetailerAddressScreen';
import { AddFirstShopScreen } from '../screens/auth/AddFirstShopScreen';
import { useAuthContext } from '../context/AuthContext';
import { useShopContext } from '../context/ShopContext';

type AuthStep =
  | 'SPLASH'
  | 'WELCOME'
  | 'MOBILE'
  | 'OTP'
  | 'RETAILER_INFO'
  | 'RETAILER_ADDRESS'
  | 'ADD_FIRST_SHOP';

export const AuthNavigator: React.FC = () => {
  const [step, setStep] = useState<AuthStep>('SPLASH');
  const { register } = useAuthContext();
  const { addNewShop } = useShopContext();
  const [isRegistering, setIsRegistering] = useState<boolean>(false);

  const [formData, setFormData] = useState<any>({});

  const handleFinishSplash = () => setStep('WELCOME');
  const handleGetStarted = () => setStep('MOBILE');
  const handleContinueMobile = () => setStep('OTP');

  const handleVerifiedNewUser = () => setStep('RETAILER_INFO');
  const handleVerifiedExistingUser = () => {}; // Handled by AuthContext login state change

  const handleContinueInfo = (info: any) => {
    setFormData((prev: any) => ({ ...prev, ...info }));
    setStep('RETAILER_ADDRESS');
  };

  const handleContinueAddress = (address: any) => {
    setFormData((prev: any) => ({ ...prev, ...address }));
    setStep('ADD_FIRST_SHOP');
  };

  const handleCompleteRegistration = async (shopData: any) => {
    setIsRegistering(true);
    const success = await register(formData);
    if (success) {
      await addNewShop(shopData);
    }
    setIsRegistering(false);
  };

  return (
    <View style={styles.container}>
      {step === 'SPLASH' && <SplashScreen onFinish={handleFinishSplash} />}
      {step === 'WELCOME' && (
        <WelcomeScreen onGetStarted={handleGetStarted} />
      )}
      {step === 'MOBILE' && (
        <MobileNumberScreen
          onContinue={handleContinueMobile}
          onBack={() => setStep('WELCOME')}
        />
      )}
      {step === 'OTP' && (
        <OtpVerificationScreen
          onVerifiedNewUser={handleVerifiedNewUser}
          onVerifiedExistingUser={handleVerifiedExistingUser}
          onBack={() => setStep('MOBILE')}
        />
      )}
      {step === 'RETAILER_INFO' && (
        <RetailerInfoScreen
          onContinue={handleContinueInfo}
          onBack={() => setStep('OTP')}
        />
      )}
      {step === 'RETAILER_ADDRESS' && (
        <RetailerAddressScreen
          onContinue={handleContinueAddress}
          onBack={() => setStep('RETAILER_INFO')}
        />
      )}
      {step === 'ADD_FIRST_SHOP' && (
        <AddFirstShopScreen
          onCompleteRegistration={handleCompleteRegistration}
          onBack={() => setStep('RETAILER_ADDRESS')}
          loading={isRegistering}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
