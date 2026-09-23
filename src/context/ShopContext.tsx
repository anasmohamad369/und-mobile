import React, { createContext, useContext, useState, useEffect } from 'react';
import { Shop } from '../types';
import { shopsApi } from '../api/shops.api';
import { useAuthContext } from './AuthContext';

interface ShopContextType {
  shops: Shop[];
  selectedShop: Shop | null;
  isLoading: boolean;
  selectShop: (shopId: number) => void;
  addNewShop: (data: Partial<Shop>) => Promise<Shop | null>;
  updateShop: (shopId: number, data: Partial<Shop>) => Promise<Shop | null>;
  deleteShop: (shopId: number) => Promise<boolean>;
  refetchShops: () => Promise<void>;
  isSelectorModalVisible: boolean;
  setSelectorModalVisible: (visible: boolean) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthContext();
  const [shops, setShops] = useState<Shop[]>([]);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSelectorModalVisible, setSelectorModalVisible] = useState<boolean>(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchShops();
    } else {
      setShops([]);
      setSelectedShop(null);
    }
  }, [isAuthenticated]);

  const fetchShops = async () => {
    try {
      setIsLoading(true);
      const res = await shopsApi.getShops();
      if (res.success && Array.isArray(res.data)) {
        setShops(res.data);
        if (res.data.length > 0) {
          const defaultShop = res.data.find(s => s.isDefault) || res.data[0];
          setSelectedShop(defaultShop);
        } else {
          setSelectedShop(null);
        }
      }
    } catch (e) {
      console.log('Error fetching shops', e);
    } finally {
      setIsLoading(false);
    }
  };

  const selectShop = (shopId: number) => {
    const target = shops.find(s => s.id === shopId);
    if (target) {
      setSelectedShop(target);
    }
  };

  const addNewShop = async (data: Partial<Shop>): Promise<Shop | null> => {
    try {
      setIsLoading(true);
      const res = await shopsApi.addShop({
        shopNumber: data.shopNumber,
        shopName: data.shopName || data.name || 'New Shop',
        mobile: data.mobile || '9811223344',
        address: data.address || '',
        latitude: data.latitude,
        longitude: data.longitude,
      });

      if (res.success && res.data) {
        setShops(prev => [...prev, res.data]);
        if (!selectedShop) {
          setSelectedShop(res.data);
        }
        return res.data;
      }
      return null;
    } catch (e) {
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateShop = async (shopId: number, data: Partial<Shop>): Promise<Shop | null> => {
    try {
      setIsLoading(true);
      const res = await shopsApi.updateShop(shopId, {
        shopNumber: data.shopNumber,
        shopName: data.shopName || data.name,
        mobile: data.mobile,
        address: data.address,
        latitude: data.latitude,
        longitude: data.longitude,
      });

      if (res.success && res.data) {
        setShops(prev => prev.map(s => s.id === shopId ? res.data : s));
        if (selectedShop?.id === shopId) {
          setSelectedShop(res.data);
        }
        return res.data;
      }
      return null;
    } catch (e) {
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteShop = async (shopId: number): Promise<boolean> => {
    try {
      setIsLoading(true);
      const res = await shopsApi.deleteShop(shopId);
      if (res.success) {
        const remaining = shops.filter(s => s.id !== shopId);
        setShops(remaining);
        if (selectedShop?.id === shopId) {
          setSelectedShop(remaining[0] || null);
        }
        return true;
      }
      return false;
    } catch (e) {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ShopContext.Provider
      value={{
        shops,
        selectedShop,
        isLoading,
        selectShop,
        addNewShop,
        updateShop,
        deleteShop,
        refetchShops: fetchShops,
        isSelectorModalVisible,
        setSelectorModalVisible,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShopContext = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShopContext must be used within a ShopProvider');
  }
  return context;
};
