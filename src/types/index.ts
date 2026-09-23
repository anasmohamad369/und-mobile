export type OrderStatus =
  | 'PLACED'
  | 'CONFIRMED'
  | 'DISPATCHED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'PENDING_PAYMENT'
  | 'FAILED'
  | 'DRIVER_ASSIGNED';

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'UNPAID';

export type PaymentMethod = 'UPI' | 'NET_BANKING' | 'CREDIT_CARD' | 'WALLET' | 'CASH' | 'CARD' | 'BANK_TRANSFER';

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
  shopNumber?: string;
  name: string;
  shopName?: string;
  mobile: string;
  address: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  pincode?: string;
  latitude?: number;
  longitude?: number;
  photoUrl?: string;
  status: 'ACTIVE' | 'INACTIVE';
  isDefault?: boolean;
  createdAt?: string;
}

export interface Farm {
  id: number;
  name: string;
  location: string;
}

export interface ChickenType {
  id: number;
  name: string;
  description: string;
}

export interface LiveRate {
  id: number;
  farmId: number;
  farmName: string;
  ratePerKg: number;
  previousRatePerKg: number;
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

export interface OrderItem {
  id: number;
  chickenTypeId: number;
  chickenTypeName: string;
  quantityKg: number;
  ratePerKg: number;
  subtotal: number;
}

export interface DeliveryDetails {
  shopId: number;
  shopName: string;
  shopAddress: string;
  shopCity: string;
  shopPincode: string;
  deliveryDate: string;
  deliverySlot: string;
  driver?: Driver;
}

export interface Driver {
  id: number;
  name: string;
  mobile: string;
  vehicleNumber: string;
  status: 'ASSIGNED' | 'ON_THE_WAY' | 'ARRIVED' | 'COMPLETED';
}

export interface Order {
  id: string;
  retailerId: number;
  shopId: number;
  items: OrderItem[];
  quantityKg: number;
  ratePerKg: number;
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  delivery: DeliveryDetails;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderPayload {
  shopId: number;
  quantityKg: number;
  deliveryDate: string;
  deliverySlot: string;
  paymentMethod: string;
}

export interface PaymentInitiation {
  orderId: string;
  paymentId?: string;
  keyId?: string;
  amount: number;
  currency: string;
  gatewayKey: string;
  gatewayOrderId: string;
}

export interface DeliverySlotOption {
  id: string;
  label: string;
  available: boolean;
}

export interface DeliveryDateOption {
  date: string;
  label: string;
  isAvailable: boolean;
  slots: DeliverySlotOption[];
}

export interface PaymentVerificationPayload {
  orderId: string;
  paymentId?: string;
  gatewayPaymentId: string;
  gatewaySignature: string;
  success: boolean;
}

export type PaymentVerification = PaymentVerificationPayload;

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
