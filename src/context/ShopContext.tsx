import React, { createContext, useContext, useState, useEffect } from 'react';
import { Shop } from '../types';
import { shopsApi } from '../api/shops.api';
import { useAuthContext } from './AuthContext';

interface ShopContextType {
  shops: Shop[];
  selectedShop: Shop | null;
  isLoading: boolean;
  selectShop: (shopId: number) => void;
  addNewShop: (data: Omit<Shop, 'id' | 'retailerId' | 'status'>) => Promise<Shop | null>;
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
    }
  }, [isAuthenticated]);

  const fetchShops = async () => {
    try {
      setIsLoading(true);
      const res = await shopsApi.getShops();
      if (res.success && res.data.length > 0) {
        setShops(res.data);
        if (!selectedShop) {
          const defaultShop = res.data.find(s => s.isDefault) || res.data[0];
          setSelectedShop(defaultShop);
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

  const addNewShop = async (data: Omit<Shop, 'id' | 'retailerId' | 'status'>): Promise<Shop | null> => {
    try {
      setIsLoading(true);
      const res = await shopsApi.addShop(data);
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

  return (
    <ShopContext.Provider
      value={{
        shops,
        selectedShop,
        isLoading,
        selectShop,
        addNewShop,
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
