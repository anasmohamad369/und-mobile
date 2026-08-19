import {
  Retailer,
  Shop,
  LiveRate,
  InventoryAvailability,
  Order,
  Requirement,
  NotificationItem,
  DeliveryDateOption,
  PaymentInitiation,
  PaymentVerification,
  ApiResponse,
} from '../types';
import {
  INITIAL_RETAILER,
  INITIAL_SHOPS,
  INITIAL_LIVE_RATE,
  INITIAL_INVENTORY,
  INITIAL_DELIVERY_OPTIONS,
  INITIAL_ORDERS,
  INITIAL_REQUIREMENTS,
  INITIAL_NOTIFICATIONS,
} from './mockData';

class MockBackendEngine {
  private retailer: Retailer | null = INITIAL_RETAILER;
  private shops: Shop[] = [...INITIAL_SHOPS];
  private liveRate: LiveRate = { ...INITIAL_LIVE_RATE };
  private inventory: InventoryAvailability = { ...INITIAL_INVENTORY };
  private deliveryOptions: DeliveryDateOption[] = [...INITIAL_DELIVERY_OPTIONS];
  private orders: Order[] = [...INITIAL_ORDERS];
  private requirements: Requirement[] = [...INITIAL_REQUIREMENTS];
  private notifications: NotificationItem[] = [...INITIAL_NOTIFICATIONS];
  private processedIdempotencyKeys: Set<string> = new Set();
  
  // Rate Subscribers for WebSocket simulation
  private rateSubscribers: Array<(rate: LiveRate) => void> = [];

  constructor() {
    // Start subtle rate simulation every 45s or on manual trigger
  }

  // --- Auth APIs ---
  public async sendOtp(mobile: string): Promise<ApiResponse<{ sent: boolean; message: string }>> {
    await this.delay(400);
    if (!mobile || mobile.length < 10) {
      return { success: false, data: { sent: false, message: 'Invalid mobile number' }, error: 'Mobile number must be 10 digits' };
    }
    return {
      success: true,
      data: { sent: true, message: 'OTP sent successfully to +91 ' + mobile },
    };
  }

  public async verifyOtp(mobile: string, otp: string): Promise<ApiResponse<{ verificationToken: string; retailer?: Retailer; token?: string }>> {
    await this.delay(500);
    // Dev OTP check: "123456" is allowed for any mobile number
    if (otp !== '123456' && otp !== '654321') {
      return {
        success: false,
        data: { verificationToken: '' },
        error: 'Invalid OTP entered. Please try 123456 for dev testing.',
      };
    }

    const verificationToken = `token_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    // Check if retailer exists for this mobile
    if (this.retailer && (this.retailer.mobile === mobile || mobile === '9876543210')) {
      return {
        success: true,
        data: {
          verificationToken,
          token: `jwt_session_${Date.now()}`,
          retailer: this.retailer,
        },
      };
    }

    return {
      success: true,
      data: { verificationToken },
    };
  }

  public async registerRetailer(data: Partial<Retailer>): Promise<ApiResponse<{ retailer: Retailer; token: string }>> {
    await this.delay(600);
    const newRetailer: Retailer = {
      id: Date.now(),
      businessName: data.businessName || 'My Chicken Store',
      ownerName: data.ownerName || 'Retailer Owner',
      mobile: data.mobile || '9876543210',
      alternateMobile: data.alternateMobile,
      email: data.email,
      gstNumber: data.gstNumber,
      addressLine1: data.addressLine1 || 'Business Address',
      addressLine2: data.addressLine2,
      city: data.city || 'Ahmedabad',
      state: data.state || 'Gujarat',
      pincode: data.pincode || '380058',
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
    };

    this.retailer = newRetailer;

    return {
      success: true,
      data: {
        retailer: newRetailer,
        token: `jwt_session_${Date.now()}`,
      },
    };
  }

  // --- Retailer Profile APIs ---
  public async getRetailerProfile(): Promise<ApiResponse<Retailer>> {
    await this.delay(300);
    if (!this.retailer) {
      return { success: false, data: null as any, error: 'Retailer profile not found' };
    }
    return { success: true, data: this.retailer };
  }

  public async updateRetailerProfile(data: Partial<Retailer>): Promise<ApiResponse<Retailer>> {
    await this.delay(400);
    if (!this.retailer) {
      return { success: false, data: null as any, error: 'Retailer profile not found' };
    }
    // Mobile number verified through OTP should not be changed without separate OTP
    const updated: Retailer = {
      ...this.retailer,
      businessName: data.businessName || this.retailer.businessName,
      ownerName: data.ownerName || this.retailer.ownerName,
      alternateMobile: data.alternateMobile ?? this.retailer.alternateMobile,
      email: data.email ?? this.retailer.email,
      addressLine1: data.addressLine1 || this.retailer.addressLine1,
      addressLine2: data.addressLine2 ?? this.retailer.addressLine2,
      city: data.city || this.retailer.city,
      state: data.state || this.retailer.state,
      pincode: data.pincode || this.retailer.pincode,
    };
    this.retailer = updated;
    return { success: true, data: updated };
  }

  // --- Shops APIs ---
  public async getShops(): Promise<ApiResponse<Shop[]>> {
    await this.delay(300);
    return { success: true, data: [...this.shops] };
  }

  public async addShop(shopData: Omit<Shop, 'id' | 'retailerId' | 'status'>): Promise<ApiResponse<Shop>> {
    await this.delay(500);
    if (!this.retailer) {
      return { success: false, data: null as any, error: 'Unauthenticated retailer' };
    }

    const newShop: Shop = {
      id: Date.now(),
      retailerId: this.retailer.id,
      name: shopData.name,
      mobile: shopData.mobile,
      address: shopData.address,
      addressLine2: shopData.addressLine2,
      city: shopData.city,
      state: shopData.state || 'Andhra Pradesh',
      pincode: shopData.pincode,
      latitude: shopData.latitude || 16.9891,
      longitude: shopData.longitude || 81.7838,
      status: 'ACTIVE',
      isDefault: this.shops.length === 0,
    };

    this.shops.push(newShop);
    return { success: true, data: newShop };
  }

  public async updateShop(shopId: number, shopData: Partial<Shop>): Promise<ApiResponse<Shop>> {
    await this.delay(400);
    const index = this.shops.findIndex(s => s.id === shopId);
    if (index === -1) {
      return { success: false, data: null as any, error: 'Shop not found' };
    }

    const updatedShop: Shop = {
      ...this.shops[index],
      ...shopData,
    };

    this.shops[index] = updatedShop;
    return { success: true, data: updatedShop };
  }

  public async deleteShop(shopId: number): Promise<ApiResponse<{ deleted: boolean }>> {
    await this.delay(400);
    const index = this.shops.findIndex(s => s.id === shopId);
    if (index === -1) {
      return { success: false, data: { deleted: false }, error: 'Shop not found' };
    }

    this.shops.splice(index, 1);
    return { success: true, data: { deleted: true } };
  }

  // --- Rates & Inventory APIs ---
  public async getLiveRate(): Promise<ApiResponse<LiveRate>> {
    await this.delay(200);
    return { success: true, data: { ...this.liveRate } };
  }

  public async getInventoryAvailability(): Promise<ApiResponse<InventoryAvailability>> {
    await this.delay(200);
    return { success: true, data: { ...this.inventory } };
  }

  public subscribeToRateChanges(callback: (rate: LiveRate) => void): () => void {
    this.rateSubscribers.push(callback);
    return () => {
      this.rateSubscribers = this.rateSubscribers.filter(sub => sub !== callback);
    };
  }

  public triggerRateUpdate(newRate: number): void {
    const prev = this.liveRate.ratePerKg;
    this.liveRate = {
      ...this.liveRate,
      previousRatePerKg: prev,
      ratePerKg: newRate,
      updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const notif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: 'Rate Change Alert',
      message: `Live Chicken rate updated to ₹${newRate}/KG`,
      timestamp: this.liveRate.updatedAt,
      read: false,
      type: 'RATE_UPDATE',
    };
    this.notifications.unshift(notif);

    this.rateSubscribers.forEach(cb => cb(this.liveRate));
  }

  public async getDeliveryOptions(): Promise<ApiResponse<DeliveryDateOption[]>> {
    await this.delay(200);
    return { success: true, data: [...this.deliveryOptions] };
  }

  // --- Order & Payment Flow ---
  public async createOrder(
    payload: {
      shopId: number;
      quantityKg: number;
      deliveryDate: string;
      deliverySlot: string;
      paymentMethod?: 'UPI' | 'CARD' | 'NET_BANKING' | 'BANK_TRANSFER';
    },
    idempotencyKey?: string
  ): Promise<ApiResponse<{ order: Order; payment: PaymentInitiation }>> {
    await this.delay(600);

    // 1. Idempotency Check
    if (idempotencyKey && this.processedIdempotencyKeys.has(idempotencyKey)) {
      const existingOrder = this.orders[0]; // return latest
      return {
        success: true,
        data: {
          order: existingOrder,
          payment: {
            paymentId: `PAY_${existingOrder.id}`,
            orderId: existingOrder.id,
            amount: existingOrder.totalAmount,
            currency: 'INR',
            gatewayOrderId: `rzp_order_${existingOrder.id}`,
            keyId: 'rzp_test_retailer_key',
          },
        },
      };
    }

    // 2. Validate Retailer & Shop
    if (!this.retailer) {
      return { success: false, data: null as any, error: 'Unauthenticated retailer' };
    }

    const shop = this.shops.find(s => s.id === payload.shopId);
    if (!shop) {
      return { success: false, data: null as any, error: 'Selected shop does not exist' };
    }

    if (shop.retailerId !== this.retailer.id) {
      return { success: false, data: null as any, error: 'Shop does not belong to currently logged in retailer' };
    }

    // 3. Validate Quantity & Inventory
    if (payload.quantityKg <= 0) {
      return { success: false, data: null as any, error: 'Quantity must be greater than 0 KG' };
    }

    if (payload.quantityKg > this.inventory.availableKg) {
      return {
        success: false,
        data: null as any,
        error: `Not Enough Stock! Only ${this.inventory.availableKg.toLocaleString()} KG is currently available. Please reduce your quantity.`,
      };
    }

    // 4. Calculate exact price on backend (ignoring client calculations)
    const rate = this.liveRate.ratePerKg;
    const subtotal = payload.quantityKg * rate;
    const deliveryFee = 0;
    const totalAmount = subtotal + deliveryFee;

    const orderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;

    const newOrder: Order = {
      id: orderId,
      retailerId: this.retailer.id,
      shopId: shop.id,
      items: [
        {
          id: 1,
          chickenTypeId: 1,
          chickenTypeName: 'Live Broiler Chicken',
          quantityKg: payload.quantityKg,
          ratePerKg: rate,
          subtotal,
        },
      ],
      quantityKg: payload.quantityKg,
      ratePerKg: rate,
      subtotal,
      deliveryFee,
      totalAmount,
      status: 'PENDING_PAYMENT',
      paymentStatus: 'UNPAID',
      paymentMethod: payload.paymentMethod || 'UPI',
      delivery: {
        shopId: shop.id,
        shopName: shop.name,
        shopAddress: shop.address,
        shopCity: shop.city,
        shopPincode: shop.pincode,
        deliveryDate: payload.deliveryDate,
        deliverySlot: payload.deliverySlot,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Temporarily Reserve Stock
    this.inventory.availableKg -= payload.quantityKg;
    this.inventory.reservedKg += payload.quantityKg;

    this.orders.unshift(newOrder);

    if (idempotencyKey) {
      this.processedIdempotencyKeys.add(idempotencyKey);
    }

    const paymentInitiation: PaymentInitiation = {
      paymentId: `PAY_${orderId}`,
      orderId,
      amount: totalAmount,
      currency: 'INR',
      gatewayOrderId: `rzp_order_${orderId}`,
      keyId: 'rzp_test_retailer_key',
    };

    return {
      success: true,
      data: {
        order: newOrder,
        payment: paymentInitiation,
      },
    };
  }

  public async verifyPayment(verification: PaymentVerification): Promise<ApiResponse<Order>> {
    await this.delay(700);

    const order = this.orders.find(o => o.id === verification.orderId);
    if (!order) {
      return { success: false, data: null as any, error: 'Order not found' };
    }

    if (!verification.success) {
      // Payment Failed -> Release stock reservation
      order.status = 'FAILED';
      order.paymentStatus = 'FAILED';
      this.inventory.availableKg += order.quantityKg;
      this.inventory.reservedKg -= order.quantityKg;

      return {
        success: false,
        data: order,
        error: 'Payment authorization failed. Stock reservation released.',
      };
    }

    // Backend Payment Signature Verification Success
    order.status = 'CONFIRMED';
    order.paymentStatus = 'PAID';
    order.updatedAt = new Date().toISOString();

    // Confirm inventory consumption
    this.inventory.reservedKg -= order.quantityKg;
    this.inventory.totalKg -= order.quantityKg;

    // Notification
    const notif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: 'Order Confirmed',
      message: `Order #${order.id} for ${order.quantityKg} KG (₹${order.totalAmount.toLocaleString()}) has been confirmed!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
      type: 'ORDER_STATUS',
      orderId: order.id,
    };
    this.notifications.unshift(notif);

    // Schedule driver assignment simulation after 10 seconds
    setTimeout(() => {
      order.status = 'DRIVER_ASSIGNED';
      order.delivery.driver = {
        id: 405,
        name: 'Ravi Kumar',
        mobile: '+91 9898989898',
        vehicleNumber: 'GJ01XX1234',
        status: 'ON_THE_WAY',
      };
      order.updatedAt = new Date().toISOString();

      this.notifications.unshift({
        id: `notif_driver_${Date.now()}`,
        title: 'Driver Assigned',
        message: `Driver Ravi Kumar has been assigned to Order #${order.id}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: false,
        type: 'DRIVER_ASSIGNED',
        orderId: order.id,
      });
    }, 10000);

    return {
      success: true,
      data: order,
    };
  }

  // --- Orders Query APIs ---
  public async getOrders(filter?: 'ALL' | 'ACTIVE' | 'COMPLETED'): Promise<ApiResponse<Order[]>> {
    await this.delay(300);
    let result = [...this.orders];
    if (filter === 'ACTIVE') {
      result = result.filter(o => ['PENDING_PAYMENT', 'CONFIRMED', 'DRIVER_ASSIGNED', 'OUT_FOR_DELIVERY'].includes(o.status));
    } else if (filter === 'COMPLETED') {
      result = result.filter(o => o.status === 'DELIVERED');
    }
    return { success: true, data: result };
  }

  public async getOrderById(orderId: string): Promise<ApiResponse<Order>> {
    await this.delay(200);
    const order = this.orders.find(o => o.id === orderId);
    if (!order) {
      return { success: false, data: null as any, error: 'Order not found' };
    }
    return { success: true, data: order };
  }

  // --- Requirements (Demand Forecasting) APIs ---
  // Note: Expected KG Requirements MUST NEVER deduct or reserve inventory!
  public async getRequirements(): Promise<ApiResponse<Requirement[]>> {
    await this.delay(300);
    return { success: true, data: [...this.requirements] };
  }

  public async addRequirement(payload: {
    shopId: number;
    chickenType: string;
    expectedKg: number;
    fromDate: string;
    toDate: string;
    notes?: string;
  }): Promise<ApiResponse<Requirement>> {
    await this.delay(450);

    const shop = this.shops.find(s => s.id === payload.shopId);
    const newReq: Requirement = {
      id: Date.now(),
      retailerId: this.retailer?.id || 101,
      shopId: payload.shopId,
      shopName: shop ? shop.name : 'Selected Shop',
      chickenType: payload.chickenType || 'Live Broiler Chicken',
      expectedKg: payload.expectedKg,
      fromDate: payload.fromDate,
      toDate: payload.toDate,
      notes: payload.notes,
      purchasedKg: 0,
      remainingKg: payload.expectedKg,
      status: 'PLANNED',
      createdAt: new Date().toISOString(),
    };

    this.requirements.unshift(newReq);
    return { success: true, data: newReq };
  }

  // --- Notifications APIs ---
  public async getNotifications(): Promise<ApiResponse<NotificationItem[]>> {
    await this.delay(200);
    return { success: true, data: [...this.notifications] };
  }

  public async markNotificationRead(id: string): Promise<ApiResponse<boolean>> {
    const notif = this.notifications.find(n => n.id === id);
    if (notif) notif.read = true;
    return { success: true, data: true };
  }

  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const mockBackendEngine = new MockBackendEngine();
