import { Order, OrderStatus, User, UserRole, Address } from '../types';
import { MOCK_PRICING } from '../constants';

// Keys for localStorage
const USERS_KEY = 'dhobighat_users';
const ORDERS_KEY = 'dhobighat_orders';

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Safely parse JSON from localStorage, clearing the key on failure.
 */
const safeParse = <T>(key: string, fallback: T): T => {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw);
    if (parsed === null || typeof parsed !== 'object') {
      localStorage.removeItem(key);
      return fallback;
    }
    return parsed;
  } catch (error) {
    console.error(`Failed to parse ${key}`, error);
    localStorage.removeItem(key);
    return fallback;
  }
};

// --- Auth Simulation ---
export const mockLogin = async (email: string, role: UserRole): Promise<User> => {
  await delay(800);
  let users = safeParse<User[]>(USERS_KEY, []);
  
  let user = users.find(u => u.email === email);
  
  if (!user) {
    // Auto-register for demo purposes
    user = {
      id: Math.random().toString(36).substr(2, 9),
      name: email.split('@')[0],
      email,
      role,
      addresses: role === 'customer' ? [{
        id: 'default_addr',
        label: 'Home',
        details: '123, Sample Street, City',
        pincode: '000000',
        isDefault: true
      }] : []
    };
    users.push(user);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }
  
  return user;
};

// --- Orders ---
export const getOrders = async (userId?: string): Promise<Order[]> => {
  await delay(500);
  const orders = safeParse<Order[]>(ORDERS_KEY, []);
  
  if (userId) {
    // If userId is provided (Customer view), filter by user
    return orders.filter(o => o.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  // If no userId (Admin view), return all
  return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const createOrder = async (order: Omit<Order, 'id' | 'createdAt' | 'status' | 'deliveryDate'>): Promise<Order> => {
  await delay(1000);
  const orders = safeParse<Order[]>(ORDERS_KEY, []);

  // Calculate delivery date (Standard 2 days later)
  const pickup = new Date(order.pickupDate);
  const delivery = new Date(pickup);
  delivery.setDate(delivery.getDate() + 2);

  const newOrder: Order = {
    ...order,
    id: `ORD-${Date.now().toString().slice(-6)}`,
    status: OrderStatus.PLACED,
    createdAt: new Date().toISOString(),
    deliveryDate: delivery.toISOString().split('T')[0]
  };

  orders.push(newOrder);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  return newOrder;
};

export const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<void> => {
  await delay(600);
  let orders = safeParse<Order[]>(ORDERS_KEY, []);
  
  orders = orders.map(o => o.id === orderId ? { ...o, status } : o);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
};

export const getPricing = async () => {
  // In a real app, this would fetch from DB
  return MOCK_PRICING;
};

// --- Address Management ---
export const addAddress = async (userId: string, address: Address): Promise<User> => {
    await delay(500);
    let users = safeParse<User[]>(USERS_KEY, []);
    
    users = users.map(u => {
        if (u.id === userId) {
            return { ...u, addresses: [...u.addresses, address] };
        }
        return u;
    });
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return users.find(u => u.id === userId)!;
};
