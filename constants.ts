import { PricingItem, ServiceType } from './types';
import { Shirt, Scissors, Archive, ShoppingBag } from 'lucide-react';

export const MOCK_PRICING: PricingItem[] = [
  { id: '1', name: 'Regular Laundry (Kg)', category: ServiceType.WASH_FOLD, price: 60, unit: 'kg' },
  { id: '2', name: 'Premium Wash & Iron (Kg)', category: ServiceType.WASH_IRON, price: 90, unit: 'kg' },
  { id: '3', name: 'Shirt / T-Shirt', category: ServiceType.WASH_IRON, price: 25, unit: 'pc' },
  { id: '4', name: 'Trousers / Jeans', category: ServiceType.WASH_IRON, price: 30, unit: 'pc' },
  { id: '5', name: 'Saree (Cotton)', category: ServiceType.DRY_CLEAN, price: 150, unit: 'pc' },
  { id: '6', name: 'Saree (Silk)', category: ServiceType.DRY_CLEAN, price: 250, unit: 'pc' },
  { id: '7', name: 'Blazer / Coat', category: ServiceType.DRY_CLEAN, price: 300, unit: 'pc' },
  { id: '8', name: 'Blanket (Single)', category: ServiceType.DRY_CLEAN, price: 200, unit: 'pc' },
  { id: '9', name: 'Steam Iron Only', category: ServiceType.IRON_ONLY, price: 15, unit: 'pc' },
];

export const SERVICE_ICONS: Record<ServiceType, any> = {
  [ServiceType.WASH_FOLD]: ShoppingBag,
  [ServiceType.WASH_IRON]: Shirt,
  [ServiceType.DRY_CLEAN]: Archive, // Using Archive as a proxy for delicate/dry clean
  [ServiceType.IRON_ONLY]: Scissors, // Using Scissors or similar utility icon
};

export const DEFAULT_USER_ADDRESSES = [
  {
    id: 'addr_1',
    label: 'Home',
    details: 'Flat 402, Krishna Heights, MG Road, Indiranagar',
    pincode: '560038',
    isDefault: true
  }
];