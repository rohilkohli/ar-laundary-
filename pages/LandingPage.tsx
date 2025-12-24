import React from 'react';
import { Link } from 'react-router-dom';
import { Shirt, Truck, Clock, IndianRupee } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <div className="text-center max-w-3xl py-12 md:py-20">
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
          Premium Laundry, <span className="text-blue-600">Delivered to Your Door.</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-600 mb-8">
          Professional wash & fold, dry cleaning, and ironing services. 
          Book a pickup in seconds and get fresh clothes within 48 hours.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to={user ? (user.role === 'admin' ? '/admin' : '/dashboard') : '/auth'} 
            className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all text-lg"
          >
            {user ? 'Go to Dashboard' : 'Book Now'}
          </Link>
          <a href="#services" className="px-8 py-3 bg-white text-slate-700 border border-slate-200 rounded-xl font-semibold hover:bg-slate-50 transition-all text-lg">
            View Pricing
          </a>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl py-12">
        <FeatureCard 
          icon={Truck} 
          title="Free Pickup & Delivery" 
          desc="We collect from your doorstep and deliver fresh clothes back to you." 
        />
        <FeatureCard 
          icon={Clock} 
          title="Fast Turnaround" 
          desc="Get your clothes back within 48 hours. Express delivery available." 
        />
        <FeatureCard 
          icon={IndianRupee} 
          title="Affordable Pricing" 
          desc="Transparent pricing per KG or per piece. No hidden charges." 
        />
      </div>
      
      {/* How it works */}
      <div className="w-full bg-blue-50 rounded-3xl p-8 md:p-12 my-12 text-center">
        <h2 className="text-3xl font-bold mb-8">How it Works</h2>
        <div className="flex flex-col md:flex-row justify-around items-center gap-8">
            <Step number="1" title="Book Pickup" desc="Select items & time slot" />
            <div className="hidden md:block w-16 h-1 bg-slate-300"></div>
            <Step number="2" title="We Wash" desc="Hygienic processing" />
            <div className="hidden md:block w-16 h-1 bg-slate-300"></div>
            <Step number="3" title="Delivery" desc="Fresh & Folded at your door" />
        </div>
      </div>
    </div>
  );
}

const FeatureCard = ({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) => (
  <div className="p-6 bg-white rounded-2xl shadow-sm border hover:shadow-md transition-shadow">
    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
      <Icon size={24} />
    </div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-slate-600">{desc}</p>
  </div>
);

const Step = ({ number, title, desc }: { number: string, title: string, desc: string }) => (
    <div className="flex flex-col items-center">
        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg mb-3">
            {number}
        </div>
        <h4 className="font-bold text-lg">{title}</h4>
        <p className="text-slate-600 text-sm">{desc}</p>
    </div>
);