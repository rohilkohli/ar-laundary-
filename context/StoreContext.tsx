
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Order, OrderItem, Address } from '../types';
import { getOrders, createOrder, updateOrderStatus, addAddress } from '../services/mockDb';
import { useAuth } from './AuthContext';
import Toast, { ToastType } from '../components/Toast';

interface ToastState {
  message: string;
  type: ToastType;
}

interface StoreContextType {
  orders: Order[];
  loadingOrders: boolean;
  cart: OrderItem[];
  addToCart: (item: OrderItem) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  placeOrder: (pickupDate: string, pickupSlot: string, address: Address) => Promise<boolean>;
  refreshOrders: () => void;
  updateStatus: (orderId: string, status: any) => Promise<void>;
  showToast: (message: string, type?: ToastType) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Fix: Added optional modifier to children prop to resolve TS errors in consumers
export const StoreProvider = ({ children }: { children?: React.ReactNode }) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = (message: string, type: ToastType = 'info') => {
    setToast({ message, type });
  };

  const refreshOrders = useCallback(async () => {
    if (!user) {
        setOrders([]);
        return;
    }
    setLoadingOrders(true);
    try {
      const fetchedOrders = await getOrders(user.role === 'customer' ? user.id : undefined);
      setOrders(fetchedOrders);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingOrders(false);
    }
  }, [user]);

  useEffect(() => {
    refreshOrders();
  }, [refreshOrders]);

  const addToCart = (item: OrderItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.itemId === item.itemId);
      if (existing) {
        return prev.map(i => i.itemId === item.itemId ? { ...i, quantity: i.quantity + item.quantity, totalPrice: (i.quantity + item.quantity) * i.unitPrice } : i);
      }
      return [...prev, item];
    });
    showToast(`Added ${item.name} to cart`, 'success');
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(i => i.itemId !== itemId));
  };

  const clearCart = () => setCart([]);

  const placeOrder = async (pickupDate: string, pickupSlot: string, address: Address) => {
    if (!user) return false;
    const totalAmount = cart.reduce((acc, curr) => acc + curr.totalPrice, 0);
    try {
      await createOrder({
        userId: user.id,
        userName: user.name,
        items: cart,
        totalAmount,
        pickupDate,
        pickupSlot,
        address
      });
      clearCart();
      await refreshOrders();
      showToast("Order placed successfully!", "success");
      return true;
    } catch (e) {
      console.error(e);
      showToast("Failed to place order", "error");
      return false;
    }
  };

  const updateStatus = async (orderId: string, status: any) => {
    await updateOrderStatus(orderId, status);
    showToast(`Order ${orderId} status updated to ${status}`, 'info');
    refreshOrders();
  };

  return (
    <StoreContext.Provider value={{ 
      orders, loadingOrders, cart, addToCart, removeFromCart, clearCart, placeOrder, refreshOrders, updateStatus, showToast 
    }}>
      {children}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within a StoreProvider');
  return context;
};
