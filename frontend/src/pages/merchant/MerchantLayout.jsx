import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Package, ShoppingCart, CreditCard, 
  TrendingUp, FlaskConical, Sparkles, Settings, ArrowUpRight
} from 'lucide-react';

export default function MerchantLayout() {
  const location = useLocation();

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
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col md:flex-row">
      {/* Merchant Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 p-4 space-y-6 shrink-0 md:min-h-screen flex flex-col justify-between shadow-sm">
        <div className="space-y-5">
          <div className="px-2 py-1">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest block">
                Merchant Operations
              </span>
            </div>
            <h2 className="text-sm font-black text-slate-900 tracking-tight">Growth Engine Console</h2>
          </div>

          <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 scrollbar-none">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 whitespace-nowrap md:whitespace-normal ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-l-2 border-l-blue-600 border-y border-r border-blue-200 font-semibold shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="ml-2 px-2 py-0.5 rounded-full text-[9px] font-bold bg-violet-100 text-violet-700 border border-violet-200">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Live Telemetry Health Box */}
        <div className="hidden md:block p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] space-y-2 mt-auto shadow-inner">
          <div className="flex items-center gap-2 text-emerald-700 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-radar" />
            <span>Agent Telemetry Stream</span>
          </div>
          <p className="text-slate-500 text-[10px] leading-relaxed">
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
