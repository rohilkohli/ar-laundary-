import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, Shirt, LogOut, LayoutDashboard, PlusCircle, Settings } from 'lucide-react';

export default function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const NavLink = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        onClick={() => setIsMenuOpen(false)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
          isActive 
            ? 'bg-blue-600 text-white' 
            : 'text-slate-600 hover:bg-slate-100'
        }`}
      >
        <Icon size={20} />
        <span className="font-medium">{label}</span>
      </Link>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Navbar */}
      <nav className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2 text-blue-600">
                <Shirt size={28} className="stroke-2" />
                <span className="text-xl font-bold tracking-tight">DhobiGhat</span>
              </Link>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-4">
              {!user ? (
                <Link to="/auth" className="text-sm font-semibold text-blue-600 hover:underline">
                  Login / Sign Up
                </Link>
              ) : (
                <>
                  {user.role === 'customer' ? (
                    <>
                      <NavLink to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
                      <NavLink to="/book" icon={PlusCircle} label="New Booking" />
                    </>
                  ) : (
                    <NavLink to="/admin" icon={Settings} label="Admin Panel" />
                  )}
                  
                  <div className="h-6 w-px bg-slate-200 mx-2"></div>
                  
                  <div className="flex items-center gap-3 pl-2">
                    <div className="text-right hidden lg:block">
                      <p className="text-sm font-medium text-slate-900">{user.name}</p>
                      <p className="text-xs text-slate-500 capitalize">{user.role}</p>
                    </div>
                    <button 
                      onClick={handleLogout}
                      className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                      title="Logout"
                    >
                      <LogOut size={20} />
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center md:hidden">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-slate-600"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav Drawer */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b shadow-lg absolute w-full left-0 top-16 z-40">
            <div className="px-4 py-4 space-y-2">
              {!user ? (
                <Link 
                  to="/auth" 
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full text-center bg-blue-600 text-white py-2 rounded-lg font-medium"
                >
                  Login / Sign Up
                </Link>
              ) : (
                <>
                  <div className="px-4 py-2 bg-slate-50 rounded-lg mb-2">
                    <p className="font-medium text-slate-900">{user.name}</p>
                    <p className="text-xs text-slate-500 capitalize">{user.role}</p>
                  </div>
                  {user.role === 'customer' ? (
                    <>
                      <NavLink to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
                      <NavLink to="/book" icon={PlusCircle} label="New Booking" />
                    </>
                  ) : (
                    <NavLink to="/admin" icon={Settings} label="Admin Panel" />
                  )}
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg mt-2"
                  >
                    <LogOut size={20} />
                    <span className="font-medium">Logout</span>
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>© 2024 DhobiGhat Laundry Services. Built for India.</p>
        </div>
      </footer>
    </div>
  );
}