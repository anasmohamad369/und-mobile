import {
  Retailer,
  Shop,
  LiveRate,
  InventoryAvailability,
  Order,
  Requirement,
  NotificationItem,
  CreateOrderPayload,
  PaymentInitiation,
  PaymentVerificationPayload,
  ApiResponse,
  DeliveryDateOption,
} from '../types';
import {
  INITIAL_RETAILER,
  INITIAL_SHOPS,
  INITIAL_LIVE_RATE,
  INITIAL_INVENTORY,
  INITIAL_ORDERS,
  INITIAL_REQUIREMENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_DELIVERY_OPTIONS,
} from './mockData';

class MockBackendEngine {
  private retailer: Retailer | null = INITIAL_RETAILER;
  private shops: Shop[] = [...INITIAL_SHOPS];
  private liveRate: LiveRate = { ...INITIAL_LIVE_RATE };
  private inventory: InventoryAvailability = { ...INITIAL_INVENTORY };
  private orders: Order[] = [...INITIAL_ORDERS];
  private requirements: Requirement[] = [...INITIAL_REQUIREMENTS];
  private notifications: NotificationItem[] = [...INITIAL_NOTIFICATIONS];
  private deliveryOptions: DeliveryDateOption[] = [...INITIAL_DELIVERY_OPTIONS];

  private processedIdempotencyKeys: Set<string> = new Set();
  private rateTimer: any = null;
  private rateListeners: Array<(rate: LiveRate) => void> = [];

  constructor() {
    this.startLiveRateFluctuation();
  }

  private startLiveRateFluctuation() {
    if (this.rateTimer) clearInterval(this.rateTimer);
    this.rateTimer = setInterval(() => {
      const delta = Math.random() > 0.5 ? 1 : -1;
      const newRate = Math.max(90, Math.min(120, this.liveRate.ratePerKg + delta));

      if (newRate !== this.liveRate.ratePerKg) {
        this.liveRate = {
          ...this.liveRate,
          previousRatePerKg: this.liveRate.ratePerKg,
          ratePerKg: newRate,
          updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        this.rateListeners.forEach(cb => cb(this.liveRate));

        this.notifications.unshift({
          id: `notif-rate-${Date.now()}`,
          title: 'Live Rate Alert',
          message: `Chicken rate changed to ₹${newRate}/KG (${delta > 0 ? '+₹' + delta : '-₹' + Math.abs(delta)})`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          read: false,
          type: 'RATE_UPDATE',
        });
      }
    }, 15000);
  }

  subscribeToRateChanges(callback: (rate: LiveRate) => void): () => void {
    this.rateListeners.push(callback);
    return () => {
      this.rateListeners = this.rateListeners.filter(cb => cb !== callback);
    };
  }

  triggerRateUpdate(newRate: number) {
    const delta = newRate - this.liveRate.ratePerKg;
    this.liveRate = {
      ...this.liveRate,
      previousRatePerKg: this.liveRate.ratePerKg,
      ratePerKg: newRate,
      updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    this.rateListeners.forEach(cb => cb(this.liveRate));
  }

  // --- Auth & Retailer Profile APIs ---
  async sendOtp(mobile: string): Promise<ApiResponse<{ sent: boolean; message: string }>> {
    await this.delay(500);
    return {
      success: true,
      data: { sent: true, message: `OTP sent successfully to +91 ${mobile}` },
    };
  }

  async verifyOtp(
    mobile: string,
    otp: string
  ): Promise<ApiResponse<{ verificationToken: string; retailer?: Retailer; token?: string }>> {
    await this.delay(600);
    if (otp !== '123456') {
      return { success: false, data: null as any, error: 'Invalid OTP code. Enter 123456 for DEV.' };
    }

    // Known registered mobile numbers in database
    const registeredDatabaseMobiles = ['7981148978', '9811223344', '9988776655', '9876543212', '9110343436'];

    if (registeredDatabaseMobiles.includes(mobile)) {
      const activeRetailer: Retailer = {
        id: 3,
        businessName: 'NutriFarm Chicken Traders',
        ownerName: 'Mohammed',
        mobile: mobile,
        email: 'owner@nutrifarm.com',
        addressLine1: 'Main Wholesale Market',
        city: 'Ahmedabad',
        state: 'Gujarat',
        pincode: '380058',
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
      };

      return {
        success: true,
        data: {
          verificationToken: `TOKEN_VERIFIED_${mobile}`,
          token: `JWT_RETAILER_SESSION_${mobile}_VALID`,
          retailer: activeRetailer,
        },
      };
    }

    // Unregistered / NEW Mobile Number (e.g. 8309877006) -> Takes user to Retailer Registration & Shop setup!
    return {
      success: true,
      data: {
        verificationToken: `VERIFY_TOKEN_${mobile}_${Date.now()}`,
      },
    };
  }

  async registerRetailer(data: Partial<Retailer>): Promise<ApiResponse<{ retailer: Retailer; token: string }>> {
    await this.delay(800);
    const newRetailer: Retailer = {
      id: Math.floor(100 + Math.random() * 900),
      businessName: data.businessName || 'NutriFarm Retailer',
      ownerName: data.ownerName || 'Mohammed',
      mobile: data.mobile || '8309877006',
      alternateMobile: data.alternateMobile || '',
      email: data.email || 'retailer@nutrifarm.com',
      gstNumber: data.gstNumber || '24ABCDE1234F1Z5',
      addressLine1: data.addressLine1 || 'Main Wholesale Market',
      addressLine2: data.addressLine2 || '',
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
        token: `JWT_RETAILER_REGISTERED_${newRetailer.id}`,
      },
    };
  }

  async getProfile(): Promise<ApiResponse<Retailer>> {
    await this.delay(300);
    if (!this.retailer) {
      return { success: false, data: null as any, error: 'Unauthenticated session' };
    }
    return { success: true, data: this.retailer };
  }

  async getRetailerProfile(): Promise<ApiResponse<Retailer>> {
    return this.getProfile();
  }

  async updateProfile(data: Partial<Retailer>): Promise<ApiResponse<Retailer>> {
    await this.delay(500);
    if (!this.retailer) {
      return { success: false, data: null as any, error: 'Unauthenticated session' };
    }

    this.retailer = { ...this.retailer, ...data };
    return { success: true, data: this.retailer };
  }

  async updateRetailerProfile(data: Partial<Retailer>): Promise<ApiResponse<Retailer>> {
    return this.updateProfile(data);
  }

  // --- Shops CRUD APIs ---
  async getShops(): Promise<ApiResponse<Shop[]>> {
    await this.delay(300);
    return { success: true, data: this.shops };
  }

  async addShop(shopData: Omit<Shop, 'id' | 'retailerId' | 'status'>): Promise<ApiResponse<Shop>> {
    await this.delay(500);
    const newShop: Shop = {
      ...shopData,
      id: Math.floor(10 + Math.random() * 90),
      retailerId: this.retailer?.id || 101,
      status: 'ACTIVE',
      isDefault: this.shops.length === 0,
    };
    this.shops.push(newShop);
    return { success: true, data: newShop };
  }

  async updateShop(shopId: number, shopData: Partial<Shop>): Promise<ApiResponse<Shop>> {
    await this.delay(500);
    const index = this.shops.findIndex(s => s.id === shopId);
    if (index === -1) {
      return { success: false, data: null as any, error: 'Shop location not found' };
    }

    this.shops[index] = { ...this.shops[index], ...shopData };
    return { success: true, data: this.shops[index] };
  }

  async deleteShop(shopId: number): Promise<ApiResponse<{ deleted: boolean }>> {
    await this.delay(400);
    this.shops = this.shops.filter(s => s.id !== shopId);
    return { success: true, data: { deleted: true } };
  }

  // --- Rates & Inventory APIs ---
  async getLiveRate(): Promise<ApiResponse<LiveRate>> {
    return { success: true, data: this.liveRate };
  }

  async getInventory(): Promise<ApiResponse<InventoryAvailability>> {
    return { success: true, data: this.inventory };
  }

  async getInventoryAvailability(): Promise<ApiResponse<InventoryAvailability>> {
    return this.getInventory();
  }

  async getDeliveryOptions(): Promise<ApiResponse<DeliveryDateOption[]>> {
    return { success: true, data: this.deliveryOptions };
  }

  // --- Order Management APIs ---
  async createOrder(
    payload: CreateOrderPayload,
    idempotencyKey?: string
  ): Promise<ApiResponse<{ order: Order; payment: PaymentInitiation }>> {
    await this.delay(700);

    if (idempotencyKey && this.processedIdempotencyKeys.has(idempotencyKey)) {
      const existingOrder = this.orders[0];
      return {
        success: true,
        data: {
          order: existingOrder,
          payment: {
            paymentId: `PAY_${existingOrder.id}`,
            orderId: existingOrder.id,
            amount: existingOrder.totalAmount,
            currency: 'INR',
            gatewayKey: 'rzp_test_retailer_key',
            gatewayOrderId: `rzp_order_${existingOrder.id}`,
            keyId: 'rzp_test_retailer_key',
          },
        },
      };
    }

    const shop = this.shops.find(s => s.id === payload.shopId) || this.shops[0] || {
      id: 1,
      name: 'Main Shop',
      address: 'Station Road',
      city: 'Bhimavaram',
      pincode: '534201',
    };

    if (payload.quantityKg > this.inventory.availableKg) {
      return {
        success: false,
        data: null as any,
        error: `Insufficient farm inventory. Only ${this.inventory.availableKg} KG available. Requested: ${payload.quantityKg} KG.`,
      };
    }

    const ratePerKg = this.liveRate.ratePerKg;
    const subtotal = payload.quantityKg * ratePerKg;
    const deliveryFee = 0;
    const totalAmount = subtotal + deliveryFee;

    const orderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;

    const newOrder: Order = {
      id: orderId,
      retailerId: this.retailer?.id || 3,
      shopId: shop.id,
      items: [
        {
          id: 1,
          chickenTypeId: 1,
          chickenTypeName: 'Live Broiler Chicken',
          quantityKg: payload.quantityKg,
          ratePerKg: ratePerKg,
          subtotal: subtotal,
        },
      ],
      quantityKg: payload.quantityKg,
      ratePerKg: ratePerKg,
      subtotal: subtotal,
      deliveryFee: deliveryFee,
      totalAmount: totalAmount,
      status: 'PLACED',
      paymentStatus: 'PENDING',
      paymentMethod: (payload.paymentMethod as any) || 'UPI',
      delivery: {
        shopId: shop.id,
        shopName: shop.name || 'Main Shop',
        shopAddress: shop.address || 'Station Road',
        shopCity: shop.city || 'Bhimavaram',
        shopPincode: shop.pincode || '534201',
        deliveryDate: payload.deliveryDate,
        deliverySlot: payload.deliverySlot,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

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
      gatewayKey: 'rzp_test_retailer_key',
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

  async verifyPayment(payload: PaymentVerificationPayload): Promise<ApiResponse<{ order: Order }>> {
    await this.delay(800);
    const orderIndex = this.orders.findIndex(o => o.id === payload.orderId);

    if (orderIndex === -1) {
      return { success: false, data: null as any, error: 'Order reference not found' };
    }

    if (!payload.success) {
      const failedOrder = this.orders[orderIndex];
      this.inventory.availableKg += failedOrder.quantityKg;
      this.inventory.reservedKg -= failedOrder.quantityKg;

      this.orders[orderIndex].status = 'CANCELLED';
      this.orders[orderIndex].paymentStatus = 'FAILED';

      return {
        success: false,
        data: { order: this.orders[orderIndex] },
        error: 'Payment failed or was cancelled by user.',
      };
    }

    this.orders[orderIndex].paymentStatus = 'PAID';
    this.orders[orderIndex].status = 'CONFIRMED';
    this.orders[orderIndex].updatedAt = new Date().toISOString();

    this.inventory.reservedKg -= this.orders[orderIndex].quantityKg;
    this.inventory.totalKg -= this.orders[orderIndex].quantityKg;

    this.notifications.unshift({
      id: `notif-ord-${Date.now()}`,
      title: 'Order Confirmed! 🚚',
      message: `Order #${payload.orderId} for ${this.orders[orderIndex].quantityKg} KG is confirmed and scheduled.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
      type: 'ORDER_STATUS',
      orderId: payload.orderId,
    });

    return {
      success: true,
      data: { order: this.orders[orderIndex] },
    };
  }

  async getOrders(filter?: 'ALL' | 'ACTIVE' | 'COMPLETED'): Promise<ApiResponse<Order[]>> {
    await this.delay(300);
    let result = [...this.orders];
    if (filter === 'ACTIVE') {
      result = result.filter(o => o.status !== 'DELIVERED' && o.status !== 'CANCELLED');
    } else if (filter === 'COMPLETED') {
      result = result.filter(o => o.status === 'DELIVERED');
    }
    return { success: true, data: result };
  }

  async getOrderById(orderId: string): Promise<ApiResponse<Order>> {
    await this.delay(300);
    const order = this.orders.find(o => o.id === orderId);
    if (!order) {
      return { success: false, data: null as any, error: 'Order not found' };
    }
    return { success: true, data: order };
  }

  // --- Requirements APIs ---
  async getRequirements(): Promise<ApiResponse<Requirement[]>> {
    await this.delay(300);
    return { success: true, data: this.requirements };
  }

  async addRequirement(data: any): Promise<ApiResponse<Requirement>> {
    await this.delay(500);
    const newReq: Requirement = {
      ...data,
      id: Math.floor(500 + Math.random() * 500),
      retailerId: this.retailer?.id || 101,
      shopName: data.shopName || 'Main Shop',
      status: 'IN_PROGRESS',
      purchasedKg: 0,
      remainingKg: data.expectedKg,
      createdAt: new Date().toISOString(),
    };

    this.requirements.unshift(newReq);
    return { success: true, data: newReq };
  }

  // --- Notifications APIs ---
  async getNotifications(): Promise<ApiResponse<NotificationItem[]>> {
    await this.delay(200);
    return { success: true, data: this.notifications };
  }

  async markNotificationRead(id: string): Promise<ApiResponse<{ success: boolean }>> {
    const notif = this.notifications.find(n => n.id === id);
    if (notif) notif.read = true;
    return { success: true, data: { success: true } };
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const mockBackendEngine = new MockBackendEngine();
