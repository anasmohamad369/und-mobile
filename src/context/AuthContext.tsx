import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Retailer } from '../types';
import { authApi } from '../api/auth.api';
import { retailerApi } from '../api/retailer.api';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  retailer: Retailer | null;
  verifiedMobile: string;
  verificationToken: string;
  setVerifiedMobile: (mobile: string) => void;
  setVerificationToken: (token: string) => void;
  loginWithExistingAccount: (retailer: Retailer, token: string) => Promise<void>;
  register: (retailerData: Partial<Retailer>) => Promise<boolean>;
  updateProfile: (updated: Partial<Retailer>) => Promise<boolean>;
  logout: () => Promise<void>;
  refetchProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = '@chicken_commerce_token';
const RETAILER_KEY = '@chicken_commerce_retailer';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [retailer, setRetailer] = useState<Retailer | null>(null);
  const [verifiedMobile, setVerifiedMobile] = useState<string>('9876543210');
  const [verificationToken, setVerificationToken] = useState<string>('');

  useEffect(() => {
    loadStorageSession();
  }, []);

  const loadStorageSession = async () => {
    try {
      const storedToken = await AsyncStorage.getItem(TOKEN_KEY);
      if (storedToken) {
        const profileRes = await retailerApi.getProfile();
        if (profileRes.success && profileRes.data) {
          setRetailer(profileRes.data);
          setIsAuthenticated(true);
        }
      }
    } catch (e) {
      console.log('Error restoring auth session', e);
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithExistingAccount = async (retailerAccount: Retailer, token: string) => {
    setRetailer(retailerAccount);
    setIsAuthenticated(true);
    await AsyncStorage.setItem(TOKEN_KEY, token);
    await AsyncStorage.setItem(RETAILER_KEY, JSON.stringify(retailerAccount));
  };

  const register = async (data: Partial<Retailer>): Promise<boolean> => {
    try {
      setIsLoading(true);
      const res = await authApi.registerRetailer({
        ...data,
        mobile: verifiedMobile || data.mobile,
      });

      if (res.success && res.data) {
        setRetailer(res.data.retailer);
        setIsAuthenticated(true);
        await AsyncStorage.setItem(TOKEN_KEY, res.data.token);
        await AsyncStorage.setItem(RETAILER_KEY, JSON.stringify(res.data.retailer));
        return true;
      }
      return false;
    } catch (e) {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: Partial<Retailer>): Promise<boolean> => {
    try {
      const res = await retailerApi.updateProfile(data);
      if (res.success && res.data) {
        setRetailer(res.data);
        await AsyncStorage.setItem(RETAILER_KEY, JSON.stringify(res.data));
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  const refetchProfile = async () => {
    const res = await retailerApi.getProfile();
    if (res.success && res.data) {
      setRetailer(res.data);
    }
  };

  const logout = async () => {
    setIsAuthenticated(false);
    setRetailer(null);
    await AsyncStorage.removeItem(TOKEN_KEY);
    await AsyncStorage.removeItem(RETAILER_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        retailer,
        verifiedMobile,
        verificationToken,
        setVerifiedMobile,
        setVerificationToken,
        loginWithExistingAccount,
        register,
        updateProfile,
        logout,
        refetchProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
