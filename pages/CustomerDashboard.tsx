import React from 'react';
import { useStore } from '../context/StoreContext';
import { Package, Clock, Calendar, ChevronRight } from 'lucide-react';
import { OrderStatus } from '../types';

export default function CustomerDashboard() {
  const { orders, loadingOrders } = useStore();

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PLACED: return 'bg-yellow-100 text-yellow-800';
      case OrderStatus.PROCESSING: return 'bg-blue-100 text-blue-800';
      case OrderStatus.READY: return 'bg-purple-100 text-purple-800';
      case OrderStatus.DELIVERED: return 'bg-green-100 text-green-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      
      {loadingOrders ? (
        <div className="text-center py-12 text-slate-500">Loading your orders...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed">
          <Package size={48} className="mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500 text-lg">No orders yet</p>
          <a href="#/book" className="text-blue-600 font-medium hover:underline mt-2 inline-block">Book your first laundry</a>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded-xl border shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-bold text-lg">#{order.id}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(order.createdAt).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1"><Clock size={14} /> Pickup: {order.pickupSlot}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="block text-2xl font-bold text-slate-900">₹{order.totalAmount}</span>
                  <span className="text-xs text-slate-400">{order.items.length} Items</span>
                </div>
              </div>

              <div className="border-t pt-4">
                 <div className="flex flex-wrap gap-2">
                    {order.items.slice(0, 3).map(i => (
                        <span key={i.itemId} className="px-2 py-1 bg-slate-50 text-slate-600 text-xs rounded border">
                            {i.quantity}x {i.name}
                        </span>
                    ))}
                    {order.items.length > 3 && (
                        <span className="px-2 py-1 bg-slate-50 text-slate-400 text-xs rounded border">
                            +{order.items.length - 3} more
                        </span>
                    )}
                 </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}