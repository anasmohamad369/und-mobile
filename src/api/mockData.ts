import { Retailer, Shop, LiveRate, InventoryAvailability, Order, Requirement, NotificationItem, DeliveryDateOption } from '../types';

export const INITIAL_RETAILER: Retailer = {
  id: 101,
  businessName: 'NutriFarm Chicken Traders',
  ownerName: 'Mohammed',
  mobile: '9876543210',
  alternateMobile: '9876543211',
  email: 'owner@nutrifarm.com',
  gstNumber: '24ABCDE1234F1Z5',
  addressLine1: 'Shop 12, Poultry Market',
  addressLine2: 'Near Ring Road',
  city: 'Ahmedabad',
  state: 'Gujarat',
  pincode: '380058',
  latitude: 23.0225,
  longitude: 72.5714,
  status: 'ACTIVE',
  createdAt: '2026-01-15T08:00:00Z',
};

// Removed all static mock shops - Shops are strictly fetched & stored via real Spring Boot REST APIs (/api/v1/retailer/shops)
export const INITIAL_SHOPS: Shop[] = [];

export const INITIAL_LIVE_RATE: LiveRate = {
  id: 1,
  farmId: 10,
  farmName: 'NutriFarm Central Wholesale Farm',
  ratePerKg: 102,
  previousRatePerKg: 100,
  currency: 'INR',
  updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  isLive: true,
};

export const INITIAL_INVENTORY: InventoryAvailability = {
  farmId: 10,
  chickenTypeId: 1,
  availableKg: 4250,
  reservedKg: 750,
  totalKg: 5000,
  lastUpdated: new Date().toISOString(),
};

export const INITIAL_DELIVERY_OPTIONS: DeliveryDateOption[] = [
  {
    date: '2026-08-11',
    label: 'Today (11 Aug)',
    isAvailable: true,
    slots: [
      { id: 'slot-1', label: '10:00 AM - 12:00 PM', available: true },
      { id: 'slot-2', label: '12:00 PM - 02:00 PM', available: true },
      { id: 'slot-3', label: '02:00 PM - 04:00 PM', available: true },
      { id: 'slot-4', label: '04:00 PM - 06:00 PM', available: true },
    ],
  },
  {
    date: '2026-08-12',
    label: 'Tomorrow (12 Aug)',
    isAvailable: true,
    slots: [
      { id: 'slot-1', label: '08:00 AM - 10:00 AM', available: true },
      { id: 'slot-2', label: '10:00 AM - 12:00 PM', available: true },
      { id: 'slot-3', label: '12:00 PM - 02:00 PM', available: true },
      { id: 'slot-4', label: '04:00 PM - 06:00 PM', available: true },
    ],
  },
];

export const INITIAL_ORDERS: Order[] = [];

export const INITIAL_REQUIREMENTS: Requirement[] = [];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Chicken Rate Update',
    message: 'NutriFarm Live Chicken rate updated to ₹102/KG.',
    timestamp: '10:32 AM',
    read: false,
    type: 'RATE_UPDATE',
  },
];
