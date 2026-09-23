import React, { createContext, useContext, useState } from 'react';
import { ratesApi } from '../api/rates.api';

interface ToastAlert {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
}

interface NotificationContextType {
  toast: ToastAlert | null;
  showToast: (title: string, message: string, type?: ToastAlert['type']) => void;
  hideToast: () => void;
  triggerMockRateUpdate: (newRate: number) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<ToastAlert | null>(null);

  const showToast = (title: string, message: string, type: ToastAlert['type'] = 'info') => {
    const id = Math.random().toString();
    setToast({ id, title, message, type });

    setTimeout(() => {
      setToast(current => (current?.id === id ? null : current));
    }, 4500);
  };

  const hideToast = () => {
    setToast(null);
  };

  const triggerMockRateUpdate = (newRate: number) => {
    ratesApi.triggerRateUpdate(newRate);
  };

  return (
    <NotificationContext.Provider
      value={{
        toast,
        showToast,
        hideToast,
        triggerMockRateUpdate,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
};
