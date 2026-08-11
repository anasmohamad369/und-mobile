import { Order, PaymentInitiation } from '../types';

export type AuthStackParamList = {
  Splash: undefined;
  Welcome: undefined;
  MobileNumber: undefined;
  OtpVerification: undefined;
  RetailerInfo: undefined;
  RetailerAddress: {
    businessName: string;
    ownerName: string;
    alternateMobile?: string;
    email?: string;
    gstNumber?: string;
  };
  AddFirstShop: {
    retailerInfo: {
      businessName: string;
      ownerName: string;
      alternateMobile?: string;
      email?: string;
      gstNumber?: string;
      addressLine1: string;
      addressLine2?: string;
      city: string;
      state: string;
      pincode: string;
    };
  };
};

export type MainTabParamList = {
  HomeTab: undefined;
  OrdersTab: undefined;
  ShopsTab: undefined;
  ProfileTab: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  MainTabs: undefined;
  BuyChicken: undefined;
  DeliverySelection: {
    quantityKg: number;
    ratePerKg: number;
  };
  OrderReview: {
    quantityKg: number;
    ratePerKg: number;
    deliveryDate: string;
    deliverySlot: string;
  };
  Payment: {
    order: Order;
    payment: PaymentInitiation;
  };
  OrderConfirmation: {
    order: Order;
  };
  OrderTracking: {
    orderId: string;
  };
  AddRequirement: undefined;
  RequirementsList: undefined;
  AddShop: undefined;
  EditProfile: undefined;
  Notifications: undefined;
};
