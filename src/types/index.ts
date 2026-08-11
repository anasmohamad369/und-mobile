export interface Retailer {
  id: number;
  businessName: string;
  ownerName: string;
  mobile: string;
  alternateMobile?: string;
  email?: string;
  gstNumber?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  latitude?: number;
  longitude?: number;
  status: 'ACTIVE' | 'PENDING' | 'INACTIVE';
  createdAt: string;
}

export interface Shop {
  id: number;
  retailerId: number;
  name: string;
  mobile: string;
  address: string;
  addressLine2?: string;
  city: string;
  state?: string;
  pincode: string;
  latitude?: number;
  longitude?: number;
  status: 'ACTIVE' | 'INACTIVE';
  isDefault?: boolean;
}

export interface Farm {
  id: number;
  name: string;
  location: string;
}

export interface ChickenType {
  id: number;
  name: string; // e.g. "Live Broiler Chicken"
  description: string;
}

export interface LiveRate {
  id: number;
  farmId: number;
  farmName: string;
  ratePerKg: number;
  previousRatePerKg?: number;
  currency: string;
  updatedAt: string;
  isLive: boolean;
}

export interface InventoryAvailability {
  farmId: number;
  chickenTypeId: number;
  availableKg: number;
  reservedKg: number;
  totalKg: number;
  lastUpdated: string;
}

export interface DeliverySlot {
  id: string;
  label: string; // e.g. "10:00 AM - 12:00 PM"
  available: boolean;
}

export interface DeliveryDateOption {
  date: string; // YYYY-MM-DD
  label: string; // e.g. "Today (12 Aug)"
  isAvailable: boolean;
  slots: DeliverySlot[];
}

export type OrderStatus =
  | 'PENDING_PAYMENT'
  | 'CONFIRMED'
  | 'DRIVER_ASSIGNED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'FAILED';

export interface OrderItem {
  id: number;
  chickenTypeId: number;
  chickenTypeName: string;
  quantityKg: number;
  ratePerKg: number;
  subtotal: number;
}

export interface Driver {
  id: number;
  name: string;
  mobile: string;
  vehicleNumber: string;
  status: 'ON_THE_WAY' | 'ARRIVED' | 'COMPLETED';
}

export interface DeliveryDetails {
  shopId: number;
  shopName: string;
  shopAddress: string;
  shopCity: string;
  shopPincode: string;
  deliveryDate: string;
  deliverySlot: string;
  latitude?: number;
  longitude?: number;
  driver?: Driver;
}

export interface Order {
  id: string; // e.g. "ORD-10245"
  retailerId: number;
  shopId: number;
  items: OrderItem[];
  quantityKg: number;
  ratePerKg: number;
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: 'UNPAID' | 'PAID' | 'REFUNDED' | 'FAILED';
  paymentMethod?: 'UPI' | 'CARD' | 'NET_BANKING' | 'BANK_TRANSFER';
  delivery: DeliveryDetails;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentInitiation {
  paymentId: string;
  orderId: string;
  amount: number;
  currency: string;
  gatewayOrderId: string;
  keyId: string;
}

export interface PaymentVerification {
  paymentId: string;
  orderId: string;
  gatewayPaymentId: string;
  gatewaySignature: string;
  success: boolean;
}

export interface Requirement {
  id: number;
  retailerId: number;
  shopId: number;
  shopName: string;
  chickenType: string;
  expectedKg: number;
  fromDate: string;
  toDate: string;
  notes?: string;
  purchasedKg?: number;
  remainingKg?: number;
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'RATE_UPDATE' | 'ORDER_STATUS' | 'DRIVER_ASSIGNED' | 'REQUIREMENT' | 'SYSTEM';
  orderId?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}
