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
  Sliders 
} from 'lucide-react';

export default function Navbar() {
  const { role, switchRole, cart, user, openAuthModal, logout } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
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
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#060911]/80 backdrop-blur-2xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo with Glow */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl blur-sm opacity-50 group-hover:opacity-100 transition duration-300" />
              <div className="relative w-9 h-9 rounded-xl bg-slate-950 flex items-center justify-center border border-white/10 shadow-lg">
                <Sparkles className="w-5 h-5 text-indigo-400 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight text-white flex items-center gap-1.5">
                ShopPilot <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-gradient-to-r from-indigo-500/30 to-purple-500/30 text-indigo-300 border border-indigo-500/40 font-bold uppercase tracking-wider">AI</span>
              </span>
              <p className="text-[10px] text-slate-400 font-medium -mt-0.5 hidden sm:block">Autonomous Commerce Growth Engine</p>
            </div>
          </Link>

          {/* Navigation Links for Customer */}
          {!isMerchantRoute && (
            <nav className="hidden md:flex items-center gap-1.5 ml-4">
              <Link
                to="/"
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  location.pathname === '/' ? 'text-white bg-slate-800/90 shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                Storefront
              </Link>
              <Link
                to="/products"
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  location.pathname === '/products' ? 'text-white bg-slate-800/90 shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                Products
              </Link>
              <Link
                to="/ai-shopping"
                className={`relative px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  location.pathname === '/ai-shopping'
                    ? 'text-indigo-300 bg-indigo-950/80 border border-indigo-600/50 shadow-lg shadow-indigo-950/40'
                    : 'text-indigo-400 hover:text-indigo-200 hover:bg-indigo-950/40 border border-indigo-900/40'
                }`}
              >
                <Bot className="w-3.5 h-3.5 animate-pulse text-indigo-400" />
                <span>AI Shopper</span>
                <span className="flex h-1.5 w-1.5 rounded-full bg-indigo-400 animate-ping" />
              </Link>
              <Link
                to="/orders"
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  location.pathname === '/orders' ? 'text-white bg-slate-800/90 shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                Orders
              </Link>
            </nav>
          )}
        </div>

        {/* Right Controls: Role Switcher & Profile */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Animated 1-Click Role Switcher Pill */}
          <div className="relative p-1 rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-inner flex items-center gap-1">
            <button
              onClick={() => handleRoleToggle('customer')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all duration-300 ${
                role === 'customer'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-900/40 scale-100'
                  : 'text-slate-400 hover:text-white scale-95'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Customer Store</span>
            </button>
            <button
              onClick={() => handleRoleToggle('merchant')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all duration-300 ${
                role === 'merchant'
                  ? 'bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 text-white shadow-md shadow-purple-900/40 scale-100'
                  : 'text-slate-400 hover:text-white scale-95'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Merchant Engine</span>
            </button>
          </div>

          {/* Customer Cart Icon with Glow Badge */}
          {!isMerchantRoute && (
            <Link
              to="/cart"
              className="relative p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/70 border border-transparent hover:border-slate-700/60 transition-all"
              title="View Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[10px] font-extrabold flex items-center justify-center border-2 border-slate-950 shadow-md shadow-indigo-600/40 animate-bounce">
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
                className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-xl bg-slate-900/90 border border-slate-700/80 hover:border-indigo-500/50 text-xs text-slate-300 transition-all shadow-sm group cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500"
                aria-label="User profile menu"
              >
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-[10px] shadow-sm">
                  {user.name ? user.name[0].toUpperCase() : 'U'}
                </div>
                <div className="text-left hidden md:block">
                  <span className="font-semibold text-xs text-slate-200 group-hover:text-white block truncate max-w-[90px]">
                    {user.name}
                  </span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180 text-indigo-400' : ''}`} />
              </button>

              {/* User Dropdown Popover */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl glass-panel border border-slate-700/90 bg-[#090D16]/95 backdrop-blur-2xl shadow-2xl p-3 space-y-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  {/* User Profile summary */}
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-indigo-600/30">
                        {user.name ? user.name[0].toUpperCase() : 'U'}
                      </div>
                      <div className="overflow-hidden flex-1">
                        <p className="text-xs font-bold text-white truncate">{user.name}</p>
                        <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                      </div>
                    </div>
                    <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                      <span className="text-slate-400">Account Type</span>
                      <span className={`px-2 py-0.5 rounded-full font-bold uppercase tracking-wider text-[9px] ${
                        user.role === 'merchant'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
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
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
                    >
                      <User className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Account Profile</span>
                    </Link>

                    {user.role === 'merchant' ? (
                      <Link
                        to="/merchant/dashboard"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
                      >
                        <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
                        <span>Merchant Dashboard</span>
                      </Link>
                    ) : (
                      <Link
                        to="/orders"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
                      >
                        <Layers className="w-3.5 h-3.5 text-indigo-400" />
                        <span>My Orders</span>
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        openAuthModal();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors text-left"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Switch / Re-Authenticate</span>
                    </button>
                  </div>

                  {/* Sign out */}
                  <div className="pt-2 border-t border-slate-800/80">
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-white hover:bg-rose-500/20 border border-rose-500/20 transition-all"
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
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
              <Link
                to="/login"
                className="hidden sm:inline-flex items-center text-xs text-slate-400 hover:text-white transition-colors"
              >
                Log in page
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
