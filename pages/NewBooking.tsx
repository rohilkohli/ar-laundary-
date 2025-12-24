import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { MOCK_PRICING, DEFAULT_USER_ADDRESSES } from '../constants';
import { TIME_SLOTS, ServiceType } from '../types';
import { Minus, Plus, ShoppingCart, MapPin, Calendar, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';

export default function NewBooking() {
  const navigate = useNavigate();
  const { cart, addToCart, removeFromCart, placeOrder } = useStore();
  const { user } = useAuth();
  
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedCategory, setSelectedCategory] = useState<ServiceType>(ServiceType.WASH_FOLD);
  const [pickupDate, setPickupDate] = useState('');
  const [pickupSlot, setPickupSlot] = useState(TIME_SLOTS[0]);
  const [selectedAddress, setSelectedAddress] = useState(user?.addresses[0] || DEFAULT_USER_ADDRESSES[0]);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setPickupDate(today);
  }, []);

  const cartTotal = cart.reduce((acc, item) => acc + item.totalPrice, 0);

  const handleQuantityChange = (item: any, delta: number) => {
    const inCart = cart.find(c => c.itemId === item.id);
    const currentQty = inCart ? inCart.quantity : 0;
    const newQty = currentQty + delta;

    if (newQty < 0) return;

    if (newQty === 0 && inCart) {
      removeFromCart(item.id);
    } else {
      if(inCart) removeFromCart(item.id);
      if(newQty > 0) {
          addToCart({
            itemId: item.id,
            name: item.name,
            quantity: newQty,
            unitPrice: item.price,
            totalPrice: newQty * item.price,
            unit: item.unit
          });
      }
    }
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-center gap-4 mb-8">
      {[1, 2, 3].map((s) => (
        <React.Fragment key={s}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
            step === s ? 'bg-blue-600 text-white scale-110 shadow-lg' : 
            step > s ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-500'
          }`}>
            {step > s ? <CheckCircle size={16} /> : s}
          </div>
          {s < 3 && <div className={`h-1 w-12 rounded ${step > s ? 'bg-green-500' : 'bg-slate-200'}`} />}
        </React.Fragment>
      ))}
    </div>
  );

  if (step === 1) {
    const categoryItems = MOCK_PRICING.filter(p => p.category === selectedCategory);
    return (
      <div className="max-w-4xl mx-auto animate-fade-in">
        <StepIndicator />
        <h1 className="text-2xl font-bold mb-6">Select Services</h1>
        <div className="flex overflow-x-auto gap-2 pb-4 mb-4 no-scrollbar">
          {Object.values(ServiceType).map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all ${
                selectedCategory === cat ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-slate-600 border hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-24">
          {categoryItems.map(item => {
            const inCart = cart.find(c => c.itemId === item.id);
            const qty = inCart ? inCart.quantity : 0;
            return (
              <div key={item.id} className="bg-white p-4 rounded-xl border flex justify-between items-center shadow-sm hover:border-blue-200 transition-all">
                <div>
                  <h3 className="font-semibold text-slate-900">{item.name}</h3>
                  <p className="text-slate-500 text-sm">₹{item.price} / {item.unit}</p>
                </div>
                <div className="flex items-center gap-3 bg-slate-50 rounded-lg p-1">
                  <button onClick={() => handleQuantityChange(item, -1)} disabled={qty === 0} className="p-1 rounded-md hover:bg-white disabled:opacity-30 transition-all">
                    <Minus size={18} className="text-slate-700" />
                  </button>
                  <span className="w-8 text-center font-semibold">{qty}</span>
                  <button onClick={() => handleQuantityChange(item, 1)} className="p-1 rounded-md hover:bg-white bg-white shadow-sm transition-all">
                    <Plus size={18} className="text-blue-600" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {cart.length > 0 && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-lg px-4">
            <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between border border-slate-700">
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 p-2 rounded-xl shadow-lg">
                  <ShoppingCart size={20} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{cart.length} Items Selected</p>
                  <p className="font-bold text-xl">₹{cartTotal}</p>
                </div>
              </div>
              <button onClick={() => setStep(2)} className="bg-blue-600 hover:bg-blue-500 px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2">
                Next <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="max-w-2xl mx-auto animate-fade-in">
        <StepIndicator />
        <button onClick={() => setStep(1)} className="flex items-center gap-1 text-slate-500 mb-6 hover:text-slate-800 transition-colors">
          <ArrowLeft size={16} /> Back to Services
        </button>
        <h1 className="text-2xl font-bold mb-6">Pickup Details</h1>
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border shadow-sm">
            <h3 className="font-semibold flex items-center gap-2 mb-4">
              <Calendar size={20} className="text-blue-600" /> Pickup Slot
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Select Date</label>
                <input type="date" value={pickupDate} min={new Date().toISOString().split('T')[0]} onChange={(e) => setPickupDate(e.target.value)} className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Select Time</label>
                <select value={pickupSlot} onChange={(e) => setPickupSlot(e.target.value)} className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50">
                  {TIME_SLOTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border shadow-sm">
            <h3 className="font-semibold flex items-center gap-2 mb-4">
              <MapPin size={20} className="text-blue-600" /> Delivery Address
            </h3>
            {user?.addresses.map(addr => (
              <label key={addr.id} className={`flex items-start gap-3 p-4 border rounded-xl mb-3 cursor-pointer transition-all ${selectedAddress.id === addr.id ? 'border-blue-600 bg-blue-50' : 'hover:bg-slate-50'}`}>
                <input type="radio" name="address" checked={selectedAddress.id === addr.id} onChange={() => setSelectedAddress(addr)} className="mt-1 accent-blue-600" />
                <div>
                  <span className="font-bold block text-slate-900">{addr.label}</span>
                  <span className="text-sm text-slate-500 leading-relaxed">{addr.details} - {addr.pincode}</span>
                </div>
              </label>
            ))}
          </div>
          <button onClick={() => setStep(3)} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl flex items-center justify-center gap-2">
            Review Order <ArrowRight size={20} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <StepIndicator />
      <button onClick={() => setStep(2)} className="flex items-center gap-1 text-slate-500 mb-6 hover:text-slate-800 transition-colors">
        <ArrowLeft size={16} /> Back
      </button>
      <h1 className="text-2xl font-bold mb-6">Confirm Your Order</h1>
      <div className="bg-white rounded-3xl border shadow-xl overflow-hidden mb-8">
        <div className="p-8 border-b bg-slate-50 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg">
              <Calendar size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Scheduled Pickup</p>
              <p className="font-bold text-lg">{pickupDate} | {pickupSlot}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Address</p>
            <p className="font-bold">{selectedAddress.label}</p>
          </div>
        </div>
        <div className="p-8 space-y-4">
          {cart.map(item => (
            <div key={item.itemId} className="flex justify-between items-center py-2 border-b border-dashed last:border-0">
              <div className="flex items-center gap-4">
                <span className="bg-slate-100 text-slate-900 w-8 h-8 flex items-center justify-center rounded-lg font-bold text-xs">{item.quantity}x</span>
                <span className="font-medium">{item.name}</span>
              </div>
              <span className="font-bold text-slate-900">₹{item.totalPrice}</span>
            </div>
          ))}
          <div className="bg-blue-50 p-6 rounded-2xl mt-6 flex justify-between items-center">
            <div>
              <p className="text-blue-600 font-bold uppercase tracking-widest text-xs">Total Amount</p>
              <p className="text-slate-400 text-[10px]">Inc. all taxes and pickup charges</p>
            </div>
            <span className="text-3xl font-black text-blue-600">₹{cartTotal}</span>
          </div>
        </div>
      </div>
      <button onClick={async () => {
        const success = await placeOrder(pickupDate, pickupSlot, selectedAddress);
        if (success) navigate('/dashboard');
      }} className="w-full bg-green-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-green-700 transition-all flex items-center justify-center gap-3 shadow-2xl active:scale-[0.98]">
        <CheckCircle size={24} /> PROCEED TO BOOKING
      </button>
      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.4s ease-out; }
      `}</style>
    </div>
  );
}