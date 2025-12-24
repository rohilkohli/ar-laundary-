import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, Phone, ArrowRight } from 'lucide-react';
import { UserRole } from '../types';

export default function AuthPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('customer');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!email) return;
    setIsLoading(true);
    await login(email, role);
    setIsLoading(false);
    navigate(role === 'admin' ? '/admin' : '/dashboard');
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Welcome to DhobiGhat</h2>
          <p className="text-slate-500 mt-2">Sign in to manage your laundry</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Role Selection */}
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setRole('customer')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                role === 'customer' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'
              }`}
            >
              Customer
            </button>
            <button
              type="button"
              onClick={() => setRole('admin')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                role === 'admin' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'
              }`}
            >
              Shop Owner
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email or Mobile Number
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-slate-400" size={20} />
              <input 
                type="text" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email (e.g., user@example.com)"
                className="w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                required
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">
              For demo, use <b>admin@dhobighat.com</b> for Admin view.
            </p>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-all disabled:opacity-70"
          >
            {isLoading ? 'Signing In...' : 'Continue'}
            {!isLoading && <ArrowRight size={20} />}
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-500">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button type="button" className="flex items-center justify-center gap-2 py-2 border rounded-xl hover:bg-slate-50 transition-colors">
              <span className="font-medium text-slate-700">Google</span>
            </button>
            <button type="button" className="flex items-center justify-center gap-2 py-2 border rounded-xl hover:bg-slate-50 transition-colors">
              <Phone size={18} className="text-slate-700" />
              <span className="font-medium text-slate-700">OTP</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}