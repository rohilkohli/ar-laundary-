import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { OrderStatus, Order } from '../types';
import { Check, Truck, Package, XCircle } from 'lucide-react';

export default function AdminDashboard() {
  const { orders, updateStatus } = useStore();
  const [filter, setFilter] = useState<OrderStatus | 'ALL'>('ALL');

  const filteredOrders = filter === 'ALL' 
    ? orders 
    : orders.filter(o => o.status === filter);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    await updateStatus(orderId, newStatus);
  };

  const StatusBadge = ({ status }: { status: OrderStatus }) => {
     let color = 'bg-gray-100 text-gray-800';
     if (status === OrderStatus.PLACED) color = 'bg-yellow-100 text-yellow-800';
     if (status === OrderStatus.PROCESSING) color = 'bg-blue-100 text-blue-800';
     if (status === OrderStatus.READY) color = 'bg-purple-100 text-purple-800';
     if (status === OrderStatus.DELIVERED) color = 'bg-green-100 text-green-800';

     return <span className={`px-2 py-1 rounded text-xs font-bold ${color}`}>{status}</span>
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Shop Dashboard</h1>
          <p className="text-slate-500">Manage orders and workflow</p>
        </div>
        
        {/* Status Filter */}
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2">
            {['ALL', ...Object.values(OrderStatus)].map(s => (
                <button
                    key={s}
                    onClick={() => setFilter(s as any)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                        filter === s ? 'bg-slate-900 text-white' : 'bg-white border text-slate-600 hover:bg-slate-50'
                    }`}
                >
                    {s === 'ALL' ? 'All Orders' : s}
                </button>
            ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl border shadow-sm">
            <p className="text-slate-500 text-xs uppercase font-bold tracking-wider">Today's Orders</p>
            <p className="text-2xl font-bold mt-1">{orders.filter(o => new Date(o.createdAt).toDateString() === new Date().toDateString()).length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border shadow-sm">
            <p className="text-slate-500 text-xs uppercase font-bold tracking-wider">Pending</p>
            <p className="text-2xl font-bold mt-1 text-yellow-600">{orders.filter(o => o.status === OrderStatus.PLACED).length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border shadow-sm">
            <p className="text-slate-500 text-xs uppercase font-bold tracking-wider">Processing</p>
            <p className="text-2xl font-bold mt-1 text-blue-600">{orders.filter(o => o.status === OrderStatus.PROCESSING).length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border shadow-sm">
            <p className="text-slate-500 text-xs uppercase font-bold tracking-wider">Revenue</p>
            <p className="text-2xl font-bold mt-1 text-green-600">₹{orders.reduce((acc, o) => acc + o.totalAmount, 0)}</p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 border-b">
              <tr>
                <th className="px-6 py-4 font-semibold">Order ID</th>
                <th className="px-6 py-4 font-semibold">Customer</th>
                <th className="px-6 py-4 font-semibold">Details</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.map(order => (
                <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {order.id}
                    <div className="text-xs text-slate-400 font-normal mt-1">{new Date(order.createdAt).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{order.userName}</div>
                    <div className="text-xs text-slate-500">{order.address.pincode}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium">₹{order.totalAmount}</div>
                    <div className="text-xs text-slate-500">{order.items.length} items</div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                        {order.status === OrderStatus.PLACED && (
                            <button 
                                onClick={() => handleStatusChange(order.id, OrderStatus.PROCESSING)}
                                className="p-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100" title="Start Processing"
                            >
                                <Package size={16} />
                            </button>
                        )}
                        {order.status === OrderStatus.PROCESSING && (
                             <button 
                                onClick={() => handleStatusChange(order.id, OrderStatus.READY)}
                                className="p-2 bg-purple-50 text-purple-600 rounded hover:bg-purple-100" title="Mark Ready"
                            >
                                <Check size={16} />
                            </button>
                        )}
                        {order.status === OrderStatus.READY && (
                             <button 
                                onClick={() => handleStatusChange(order.id, OrderStatus.DELIVERED)}
                                className="p-2 bg-green-50 text-green-600 rounded hover:bg-green-100" title="Deliver"
                            >
                                <Truck size={16} />
                            </button>
                        )}
                        {order.status !== OrderStatus.DELIVERED && order.status !== OrderStatus.CANCELLED && (
                            <button 
                                onClick={() => handleStatusChange(order.id, OrderStatus.CANCELLED)}
                                className="p-2 bg-red-50 text-red-600 rounded hover:bg-red-100" title="Cancel"
                            >
                                <XCircle size={16} />
                            </button>
                        )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredOrders.length === 0 && (
            <div className="p-12 text-center text-slate-500">
                No orders found in this category.
            </div>
        )}
      </div>
    </div>
  );
}