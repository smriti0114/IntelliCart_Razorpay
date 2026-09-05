import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Package, ShoppingCart, CreditCard, 
  TrendingUp, FlaskConical, Sparkles, Settings, ArrowUpRight,
  Menu, X, Shield, Activity
} from 'lucide-react';

export default function MerchantLayout() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Executive Dashboard', path: '/merchant/dashboard', icon: LayoutDashboard },
    { label: 'Autonomous AI Growth', path: '/merchant/ai', icon: Sparkles, badge: 'Live AI' },
    { label: 'Revenue Simulator', path: '/merchant/revenue', icon: TrendingUp },
    { label: 'Customer Segments', path: '/merchant/customers', icon: Users },
    { label: 'A/B Experiments', path: '/merchant/experiments', icon: FlaskConical },
    { label: 'Orders Ledger', path: '/merchant/orders', icon: ShoppingCart },
    { label: 'Payments & Gateway', path: '/merchant/payments', icon: CreditCard },
    { label: 'Product Inventory', path: '/merchant/products', icon: Package },
    { label: 'Settings & Guardrails', path: '/merchant/settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950/90 backdrop-blur-xl sticky top-16 z-30">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
          <span className="text-xs font-black text-white tracking-tight uppercase">Merchant Console</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white cursor-pointer"
        >
          {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      {/* Mobile Menu Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30 top-28"
        />
      )}

      {/* Merchant Sidebar */}
      <aside
        className={`w-full md:w-64 glass-panel border-r border-slate-800/80 p-4 space-y-6 shrink-0 md:min-h-screen flex flex-col justify-between transition-all duration-300 ${
          mobileMenuOpen ? 'block' : 'hidden md:flex'
        }`}
      >
        <div className="space-y-5">
          <div className="px-2 py-1">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-radar" />
              <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest block">
                Merchant Operations
              </span>
            </div>
            <h2 className="text-sm font-black text-white tracking-tight">AI Commerce Console</h2>
            <p className="text-[11px] text-slate-400 mt-0.5">Automated Intelligence & Settlement</p>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-purple-600/15 text-purple-300 border-l-2 border-l-purple-400 border-y border-r border-purple-500/30 font-semibold shadow-md shadow-purple-950/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-purple-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Live Telemetry Health Box */}
        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-[11px] space-y-2 mt-auto">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-radar" />
            <span>Agent Telemetry Stream</span>
          </div>
          <p className="text-slate-400 text-[10px] leading-relaxed">
            Connected via WebSockets (Port 5001). Auditing decision payloads in real-time.
          </p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}
