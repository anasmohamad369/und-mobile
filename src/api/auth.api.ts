import { apiClient } from './client';
import { mockBackendEngine } from './mockEngine';
import { retailerApi } from './retailer.api';
import { ApiResponse, Retailer } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface AuthData {
  accessToken: string;
  tokenType: string;
  userId: number;
  username: string;
  fullName: string;
  email: string;
  roles: any[];
  retailerId: number;
}

export interface VerifyOtpData {
  registered: boolean;
  mobile: string;
  authData: AuthData | null;
  message: string;
}

export interface SendOtpData {
  success: boolean;
  mobile: string;
  otp: string;
  message: string;
}

export interface RegisterRetailerPayload {
  mobile: string;
  fullName: string;
  businessName: string;
  email?: string;
  password?: string;
  shopNumber?: string;
  shopName: string;
  address: string;
  latitude?: number;
  longitude?: number;
}

export const authApi = {
  /**
   * Step 1: Send OTP to Mobile Number
   * POST /api/v1/auth/send-otp
   */
  sendOtp: async (mobile: string): Promise<ApiResponse<{ sent: boolean; message: string }>> => {
    try {
      const response = await apiClient.post<ApiResponse<SendOtpData>>('/auth/send-otp', { mobile });
      if (response.data?.success && response.data?.data) {
        return {
          success: true,
          data: {
            sent: response.data.data.success,
            message: response.data.data.message || 'OTP sent successfully',
          },
        };
      }
      return mockBackendEngine.sendOtp(mobile);
    } catch (e: any) {
      console.log('Real backend send-otp failed, falling back to mock engine:', e?.message);
      return mockBackendEngine.sendOtp(mobile);
    }
  },

  /**
   * Step 2: Verify 6-digit OTP
   * POST /api/v1/auth/verify-otp
   */
  verifyOtp: async (
    mobile: string,
    otp: string
  ): Promise<ApiResponse<{ verificationToken: string; retailer?: Retailer; token?: string }>> => {
    try {
      const response = await apiClient.post<ApiResponse<VerifyOtpData>>('/auth/verify-otp', {
        mobile,
        otp,
      });

      if (response.data?.success && response.data?.data) {
        const verifyData = response.data.data;
        const isRegistered = verifyData.registered === true || verifyData.authData != null;

        if (isRegistered && verifyData.authData) {
          const authData = verifyData.authData;

          // Immediately store JWT token so subsequent profile API calls send Bearer header
          await AsyncStorage.setItem('@chicken_commerce_token', authData.accessToken);

          let retailer: Retailer = {
            id: authData.retailerId || authData.userId,
            businessName: authData.fullName || 'NutriFarm Retailer',
            ownerName: authData.fullName || 'Mohammed',
            mobile: authData.username || mobile,
            email: authData.email || '',
            addressLine1: 'Main Wholesale Market',
            city: 'Ahmedabad',
            state: 'Gujarat',
            pincode: '380058',
            status: 'ACTIVE',
            createdAt: new Date().toISOString(),
          };

          try {
            const profileRes = await retailerApi.getProfile();
            if (profileRes.success && profileRes.data) {
              retailer = profileRes.data;
            }
          } catch (profileErr) {
            console.log('Error fetching retailer profile after verify-otp:', profileErr);
          }

          return {
            success: true,
            data: {
              verificationToken: authData.accessToken,
              token: authData.accessToken,
              retailer,
            },
          };
        } else {
          // Unregistered mobile number -> Proceed to Retailer Registration Screen
          return {
            success: true,
            data: {
              verificationToken: `VERIFY_TOKEN_${mobile}_${Date.now()}`,
            },
          };
        }
      }
      return mockBackendEngine.verifyOtp(mobile, otp);
    } catch (e: any) {
      console.log('Real backend verify-otp failed, falling back to mock engine:', e?.message);
      return mockBackendEngine.verifyOtp(mobile, otp);
    }
  },

  /**
   * Step 3: Retailer Self-Registration API (With Initial Primary Shop)
   * POST /api/v1/auth/register-retailer
   */
  registerRetailer: async (
    payload: RegisterRetailerPayload
  ): Promise<ApiResponse<{ retailer: Retailer; token: string }>> => {
    try {
      const response = await apiClient.post<ApiResponse<AuthData>>('/auth/register-retailer', {
        mobile: payload.mobile,
        fullName: payload.fullName,
        businessName: payload.businessName,
        email: payload.email || `${payload.mobile}@nutrifarm.com`,
        password: payload.password || 'Retailer@123',
        shopNumber: payload.shopNumber || `SHOP-${Date.now().toString().slice(-4)}`,
        shopName: payload.shopName || `${payload.businessName} - Main Shop`,
        address: payload.address,
        latitude: payload.latitude || 16.5449,
        longitude: payload.longitude || 81.5212,
      });

      if (response.data?.success && response.data?.data) {
        const authData = response.data.data;
        await AsyncStorage.setItem('@chicken_commerce_token', authData.accessToken);

        let retailer: Retailer = {
          id: authData.retailerId || authData.userId,
          businessName: (authData as any).businessName || payload.businessName,
          ownerName: authData.fullName || payload.fullName,
          mobile: authData.username || payload.mobile,
          email: authData.email || payload.email || '',
          addressLine1: payload.address,
          city: 'Bhimavaram',
          state: 'Andhra Pradesh',
          pincode: '534201',
          status: 'ACTIVE',
          createdAt: new Date().toISOString(),
        };

        try {
          const profileRes = await retailerApi.getProfile();
          if (profileRes.success && profileRes.data) {
            retailer = profileRes.data;
          }
        } catch (profileErr) {
          console.log('Error fetching profile after register:', profileErr);
        }

        return {
          success: true,
          data: {
            token: authData.accessToken,
            retailer,
          },
        };
      }
      return mockBackendEngine.registerRetailer(payload as any);
    } catch (e: any) {
      console.log('Real backend register-retailer failed, falling back to mock engine:', e?.message);
      return mockBackendEngine.registerRetailer(payload as any);
    }
  },

  /**
   * Step 4: Username/Mobile + Password Login
   * POST /api/v1/auth/login
   */
  loginWithPassword: async (
    username: string,
    password: string
  ): Promise<ApiResponse<{ retailer: Retailer; token: string }>> => {
    try {
      const response = await apiClient.post<ApiResponse<AuthData>>('/auth/login', {
        username,
        password,
      });

      if (response.data?.success && response.data?.data) {
        const authData = response.data.data;
        await AsyncStorage.setItem('@chicken_commerce_token', authData.accessToken);

        let retailer: Retailer = {
          id: authData.retailerId || authData.userId,
          businessName: authData.fullName || 'NutriFarm Retailer',
          ownerName: authData.fullName || 'Mohammed',
          mobile: authData.username || username,
          email: authData.email || '',
          addressLine1: 'Main Wholesale Market',
          city: 'Ahmedabad',
          state: 'Gujarat',
          pincode: '380058',
          status: 'ACTIVE',
          createdAt: new Date().toISOString(),
        };

        try {
          const profileRes = await retailerApi.getProfile();
          if (profileRes.success && profileRes.data) {
            retailer = profileRes.data;
          }
        } catch (profileErr) {
          console.log('Error fetching profile after login:', profileErr);
        }

        return {
          success: true,
          data: {
            token: authData.accessToken,
            retailer,
          },
        };
      }
      return { success: false, data: {} as any, error: 'Login failed' };
    } catch (e: any) {
      console.log('Real backend login failed:', e?.message);
      return { success: false, data: {} as any, error: e?.message || 'Login failed' };
    }
  },
};
