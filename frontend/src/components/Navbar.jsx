import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, 
  ShoppingBag, 
  Bot, 
  Store, 
  TrendingUp, 
  Layers, 
  User, 
  Zap, 
  LogIn, 
  LogOut, 
  ChevronDown, 
  ShieldCheck, 
  Sliders,
  Menu,
  X
} from 'lucide-react';

export default function Navbar() {
  const { role, switchRole, cart, user, openAuthModal, logout } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const isMerchantRoute = location.pathname.startsWith('/merchant');
  const cartItemCount = cart.reduce((acc, i) => acc + i.quantity, 0);

  const handleRoleToggle = (targetRole) => {
    switchRole(targetRole);
    if (targetRole === 'merchant') {
      navigate('/merchant/dashboard');
    } else {
      navigate('/');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/90 backdrop-blur-2xl transition-all shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 rounded-xl blur-sm opacity-35 group-hover:opacity-75 transition duration-300" />
              <div className="relative w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-200 shadow-sm">
                <Sparkles className="w-5 h-5 text-blue-600 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight text-slate-900 flex items-center gap-1.5">
                IntelliCart <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-violet-50 text-violet-700 border border-violet-200 font-bold uppercase tracking-wider">AI</span>
              </span>
              <p className="text-[10px] text-slate-500 font-medium -mt-0.5 hidden sm:block">Autonomous Commerce Growth Engine</p>
            </div>
          </Link>

          {/* Navigation Links for Customer */}
          {!isMerchantRoute && (
            <nav className="hidden md:flex items-center gap-1 ml-3">
              <Link
                to="/"
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  location.pathname === '/' ? 'text-blue-600 bg-blue-50/80 border border-blue-100 shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                Storefront
              </Link>
              <Link
                to="/products"
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  location.pathname === '/products' ? 'text-blue-600 bg-blue-50/80 border border-blue-100 shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                Products
              </Link>
              <Link
                to="/ai-shopping"
                className={`relative px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  location.pathname === '/ai-shopping'
                    ? 'text-violet-700 bg-violet-50 border border-violet-300 shadow-sm'
                    : 'text-violet-600 hover:text-violet-700 hover:bg-violet-50/60 border border-violet-200'
                }`}
              >
                <Bot className="w-3.5 h-3.5 animate-pulse text-violet-600" />
                <span>AI Shopper</span>
                <span className="flex h-1.5 w-1.5 rounded-full bg-cyan-500 animate-ping" />
              </Link>
              <Link
                to="/orders"
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  location.pathname === '/orders' ? 'text-blue-600 bg-blue-50/80 border border-blue-100 shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                Orders
              </Link>
            </nav>
          )}
        </div>

        {/* Right Controls: Role Switcher & Profile */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          {/* Animated 1-Click Role Switcher Pill */}
          <div className="relative p-1 rounded-2xl bg-slate-100 border border-slate-200 shadow-inner flex items-center gap-1">
            <button
              onClick={() => handleRoleToggle('customer')}
              className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all duration-300 ${
                role === 'customer'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-sm scale-100'
                  : 'text-slate-600 hover:text-slate-900 scale-95'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Customer Store</span>
            </button>
            <button
              onClick={() => handleRoleToggle('merchant')}
              className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all duration-300 ${
                role === 'merchant'
                  ? 'bg-gradient-to-r from-blue-600 via-cyan-600 to-cyan-700 text-white shadow-sm scale-100'
                  : 'text-slate-600 hover:text-slate-900 scale-95'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Merchant Engine</span>
            </button>
          </div>

          {/* Customer Cart Icon */}
          {!isMerchantRoute && (
            <Link
              to="/cart"
              className="relative p-2 rounded-xl text-slate-700 hover:text-blue-600 hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all"
              title="View Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-extrabold flex items-center justify-center border-2 border-white shadow-sm animate-bounce">
                  {cartItemCount}
                </span>
              )}
            </Link>
          )}

          {/* User Profile / Authentication Menu */}
          {user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-xl bg-white border border-slate-200 hover:border-blue-400 text-xs text-slate-700 transition-all shadow-sm group cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-100"
                aria-label="User profile menu"
              >
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 text-white flex items-center justify-center font-bold text-[10px] shadow-sm">
                  {user.name ? user.name[0].toUpperCase() : 'U'}
                </div>
                <div className="text-left hidden md:block">
                  <span className="font-semibold text-xs text-slate-800 group-hover:text-blue-600 block truncate max-w-[90px]">
                    {user.name}
                  </span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180 text-blue-600' : ''}`} />
              </button>

              {/* User Dropdown Popover */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl glass-panel border border-slate-200 bg-white/95 backdrop-blur-2xl shadow-xl p-3 space-y-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  {/* User Profile summary */}
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                        {user.name ? user.name[0].toUpperCase() : 'U'}
                      </div>
                      <div className="overflow-hidden flex-1">
                        <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                        <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
                      </div>
                    </div>
                    <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between text-[10px]">
                      <span className="text-slate-500">Account Type</span>
                      <span className={`px-2 py-0.5 rounded-full font-bold uppercase tracking-wider text-[9px] ${
                        user.role === 'merchant'
                          ? 'bg-cyan-50 text-cyan-700 border border-cyan-200'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}>
                        {user.role}
                      </span>
                    </div>
                  </div>

                  {/* Quick links */}
                  <div className="space-y-1 text-xs">
                    <Link
                      to="/profile"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                    >
                      <User className="w-3.5 h-3.5 text-blue-600" />
                      <span>Account Profile</span>
                    </Link>

                    {user.role === 'merchant' ? (
                      <Link
                        to="/merchant/dashboard"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                      >
                        <TrendingUp className="w-3.5 h-3.5 text-cyan-600" />
                        <span>Merchant Dashboard</span>
                      </Link>
                    ) : (
                      <Link
                        to="/orders"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                      >
                        <Layers className="w-3.5 h-3.5 text-blue-600" />
                        <span>My Orders</span>
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        openAuthModal();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors text-left cursor-pointer"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Switch / Re-Authenticate</span>
                    </button>
                  </div>

                  {/* Sign out */}
                  <div className="pt-2 border-t border-slate-200">
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 transition-all cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={openAuthModal}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition-all cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
              <Link
                to="/login"
                className="hidden sm:inline-flex items-center text-xs text-slate-500 hover:text-slate-900 transition-colors"
              >
                Log in page
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          {!isMerchantRoute && (
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && !isMerchantRoute && (
        <div className="md:hidden px-4 pt-2 pb-4 border-t border-slate-200 bg-white/95 backdrop-blur-2xl space-y-2 animate-in fade-in slide-in-from-top-2">
          <Link
            to="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold ${
              location.pathname === '/' ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Storefront</span>
          </Link>
          <Link
            to="/products"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold ${
              location.pathname === '/products' ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Products</span>
          </Link>
          <Link
            to="/ai-shopping"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold ${
              location.pathname === '/ai-shopping' ? 'bg-blue-600 text-white' : 'text-blue-600 hover:bg-slate-100'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>AI Shopper Assistant</span>
          </Link>
          <Link
            to="/orders"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold ${
              location.pathname === '/orders' ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>My Orders & Tracking</span>
          </Link>
        </div>
      )}
    </header>
  );
}
