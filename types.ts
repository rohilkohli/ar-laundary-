export type UserRole = 'customer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  addresses: Address[];
}

export interface Address {
  id: string;
  label: string; // e.g. "Home", "Office"
  details: string;
  pincode: string;
  isDefault: boolean;
}

export enum ServiceType {
  WASH_FOLD = 'Wash & Fold',
  WASH_IRON = 'Wash & Iron',
  DRY_CLEAN = 'Dry Clean',
  IRON_ONLY = 'Iron Only',
}

export interface PricingItem {
  id: string;
  name: string;
  category: ServiceType;
  price: number;
  unit: 'kg' | 'pc';
  icon?: string;
}

export enum OrderStatus {
  PLACED = 'Placed',
  PICKED_UP = 'Picked Up',
  PROCESSING = 'Processing',
  READY = 'Ready',
  OUT_FOR_DELIVERY = 'Out for Delivery',
  DELIVERED = 'Delivered',
  CANCELLED = 'Cancelled'
}

export interface OrderItem {
  itemId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  unit: 'kg' | 'pc';
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  status: OrderStatus;
  items: OrderItem[];
  totalAmount: number;
  pickupDate: string;
  pickupSlot: string;
  deliveryDate: string; // Calculated
  address: Address;
  createdAt: string;
}

export const TIME_SLOTS = [
  '09:00 AM - 12:00 PM',
  '12:00 PM - 03:00 PM',
  '03:00 PM - 06:00 PM',
  '06:00 PM - 09:00 PM'
];