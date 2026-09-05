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
  Menu,
  X,
  Compass,
  ArrowRight
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

  // Close mobile drawer on route change
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
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#070A12]/85 backdrop-blur-2xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Navigation */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl blur-sm opacity-60 group-hover:opacity-100 transition duration-300" />
              <div className="relative w-9 h-9 rounded-xl bg-slate-950 flex items-center justify-center border border-white/15 shadow-lg">
                <Sparkles className="w-5 h-5 text-indigo-400 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <span className="text-base font-black tracking-tight text-white flex items-center gap-1.5">
                IntelliCart <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-gradient-to-r from-indigo-500/25 to-purple-500/25 text-indigo-300 border border-indigo-500/40 font-black uppercase tracking-wider font-mono">AI</span>
              </span>
              <p className="text-[10px] text-slate-400 font-medium -mt-0.5 hidden sm:block">Autonomous AI Commerce Platform</p>
            </div>
          </Link>

          {/* Desktop Navigation Links for Customer */}
          {!isMerchantRoute && (
            <nav className="hidden md:flex items-center gap-1 ml-4">
              <Link
                to="/"
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  location.pathname === '/' ? 'text-white bg-white/10 shadow-sm' : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                Storefront
              </Link>
              <Link
                to="/products"
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  location.pathname === '/products' ? 'text-white bg-white/10 shadow-sm' : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                Catalog
              </Link>
              <Link
                to="/ai-shopping"
                className={`relative px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  location.pathname === '/ai-shopping'
                    ? 'text-indigo-300 bg-indigo-950/80 border border-indigo-500/50 shadow-lg shadow-indigo-950/50'
                    : 'text-indigo-400 hover:text-indigo-200 hover:bg-indigo-950/40 border border-indigo-900/50'
                }`}
              >
                <Bot className="w-3.5 h-3.5 text-indigo-400" />
                <span>AI Shopper</span>
                <span className="flex h-1.5 w-1.5 rounded-full bg-indigo-400 animate-ping" />
              </Link>
              <Link
                to="/orders"
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  location.pathname === '/orders' ? 'text-white bg-white/10 shadow-sm' : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                Orders
              </Link>
            </nav>
          )}
        </div>

        {/* Right Controls: Role Switcher & Profile & Cart */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Persona Switcher Pill */}
          <div className="relative p-1 rounded-2xl bg-slate-950/80 border border-white/10 shadow-inner flex items-center gap-1">
            <button
              onClick={() => handleRoleToggle('customer')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all duration-300 ${
                role === 'customer'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-900/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Store</span>
            </button>
            <button
              onClick={() => handleRoleToggle('merchant')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all duration-300 ${
                role === 'merchant'
                  ? 'bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 text-white shadow-md shadow-purple-900/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Merchant</span>
            </button>
          </div>

          {/* Customer Cart Button */}
          {!isMerchantRoute && (
            <Link
              to="/cart"
              className="relative p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 border border-white/10 transition-all"
              title="Shopping Cart"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[10px] font-black flex items-center justify-center border-2 border-slate-950 shadow-md shadow-indigo-600/40 animate-bounce">
                  {cartItemCount}
                </span>
              )}
            </Link>
          )}

          {/* User Profile Popover */}
          {user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-xl bg-slate-900/90 border border-white/10 hover:border-indigo-500/50 text-xs text-slate-300 transition-all shadow-sm cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500"
                aria-label="User profile menu"
              >
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-black text-[10px] shadow-sm">
                  {user.name ? user.name[0].toUpperCase() : 'U'}
                </div>
                <div className="text-left hidden lg:block">
                  <span className="font-semibold text-xs text-slate-200 block truncate max-w-[85px]">
                    {user.name}
                  </span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180 text-indigo-400' : ''}`} />
              </button>

              {/* User Dropdown Popover */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl glass-panel-elevated border border-white/15 bg-[#090D18]/95 shadow-2xl p-3 space-y-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-white/10">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-black text-xs shadow-md">
                        {user.name ? user.name[0].toUpperCase() : 'U'}
                      </div>
                      <div className="overflow-hidden flex-1">
                        <p className="text-xs font-bold text-white truncate">{user.name}</p>
                        <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                      </div>
                    </div>
                    <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[10px]">
                      <span className="text-slate-400">Persona Role</span>
                      <span className={`px-2 py-0.5 rounded-full font-bold uppercase tracking-wider text-[9px] font-mono ${
                        user.role === 'merchant'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      }`}>
                        {user.role}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs">
                    <Link
                      to="/profile"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <User className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Account Profile & RFM</span>
                    </Link>

                    {user.role === 'merchant' ? (
                      <Link
                        to="/merchant/dashboard"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
                        <span>Merchant Executive Console</span>
                      </Link>
                    ) : (
                      <Link
                        to="/orders"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <Layers className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Order Ledger & Tracking</span>
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        openAuthModal();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-colors text-left cursor-pointer"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Switch Persona</span>
                    </button>
                  </div>

                  <div className="pt-2 border-t border-white/10">
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-white hover:bg-rose-500/20 border border-rose-500/20 transition-all cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={openAuthModal}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}

          {/* Mobile Drawer Hamburger Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 border border-white/10 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#070A12]/95 backdrop-blur-2xl px-4 pt-3 pb-5 space-y-3 animate-in slide-in-from-top duration-200">
          <nav className="space-y-1">
            <Link
              to="/"
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                location.pathname === '/' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>Storefront</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
            </Link>
            <Link
              to="/products"
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                location.pathname === '/products' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>Hardware Catalog</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
            </Link>
            <Link
              to="/ai-shopping"
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold ${
                location.pathname === '/ai-shopping'
                  ? 'bg-indigo-950/80 text-indigo-300 border border-indigo-500/40'
                  : 'text-indigo-400 hover:bg-indigo-950/30'
              }`}
            >
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4" />
                <span>AI Shopping Copilot</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
            </Link>
            <Link
              to="/orders"
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                location.pathname === '/orders' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>Orders Ledger</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
            </Link>
            <Link
              to="/cart"
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                location.pathname === '/cart' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>Cart ({cartItemCount} items)</span>
              <ShoppingBag className="w-3.5 h-3.5 text-slate-400" />
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

