import React, { useState, useEffect } from 'react';
import { Users, Search, Filter, ArrowUpDown, Sparkles } from 'lucide-react';

export default function CustomersPage() {
  const [segments, setSegments] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedSegment, setSelectedSegment] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics/customers')
      .then((res) => res.json())
      .then((data) => {
        setSegments(data.segments || []);
      })
      .catch((e) => console.error(e));
  }, []);

  useEffect(() => {
    setLoading(true);
    const segQuery = selectedSegment !== 'All' ? `&segment=${encodeURIComponent(selectedSegment)}` : '';
    const searchParam = searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : '';

    fetch(`/api/customers?limit=50${segQuery}${searchParam}`)
      .then((res) => res.json())
      .then((data) => {
        setCustomers(data.customers || []);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
      });
  }, [selectedSegment, searchQuery]);

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-indigo-400" /> K-Means ML Clustering
          </span>
          <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-radar" /> 5 Clusters Synced
          </span>
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
          <Users className="w-6 h-6 text-indigo-400" />
          Customer Intelligence & K-Means Segmentation
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Machine learning clustering into 5 actionable segments based on Recency, Frequency, Monetary spend & behavioral intent
        </p>
      </div>

      {/* 5 K-Means Customer Segment Cluster Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {segments.map((seg) => {
          const isSelected = selectedSegment === seg.segment_name;
          return (
            <div
              key={seg.id}
              onClick={() => setSelectedSegment(isSelected ? 'All' : seg.segment_name)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all duration-300 space-y-2 relative overflow-hidden group ${
                isSelected
                  ? 'bg-purple-950/40 border-purple-500 text-white shadow-xl shadow-purple-950/30 glow-purple ring-1 ring-purple-500/50'
                  : 'glass-panel text-slate-300 hover:border-slate-700 hover:bg-slate-900/90'
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
                  {seg.segment_name}
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-950/80 text-slate-300 font-mono border border-slate-800">
                  {seg.customer_count}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{seg.description}</p>
              <div className="pt-2 border-t border-slate-800/80 text-[11px] flex justify-between items-center text-slate-400">
                <span>Avg AOV:</span>
                <span className="font-bold text-indigo-300 font-mono">₹{Number(seg.avg_aov).toLocaleString('en-IN')}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Customer Ledger Table */}
      <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-4 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-2.5">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Customer Profiles Ledger ({customers.length} Loaded)
            </h3>
            {selectedSegment !== 'All' && (
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 font-semibold flex items-center gap-1.5">
                Filtered: {selectedSegment}
                <button
                  onClick={() => setSelectedSegment('All')}
                  className="hover:text-white font-bold ml-1 text-slate-400"
                >
                  ✕
                </button>
              </span>
            )}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, phone..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-950/80 border border-slate-700 text-white rounded-xl focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800/80">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60">
              <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                <th className="py-3 px-4 font-semibold">Customer</th>
                <th className="py-3 px-4 font-semibold">Segment</th>
                <th className="py-3 px-4 font-semibold">Recency</th>
                <th className="py-3 px-4 font-semibold">Orders</th>
                <th className="py-3 px-4 font-semibold">Total Spend</th>
                <th className="py-3 px-4 font-semibold">AOV</th>
                <th className="py-3 px-4 font-semibold">Predicted CLV</th>
                <th className="py-3 px-4 font-semibold">Discount Sens.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 bg-slate-900/40">
              {customers.map((c) => (
                <tr key={c.id} className="hover:bg-indigo-950/20 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-semibold text-white block">{c.name}</span>
                    <span className="text-[11px] text-slate-500 font-mono">{c.email}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                      {c.segment}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">{c.rfm_recency}d ago</td>
                  <td className="py-3 px-4 text-slate-300 font-mono font-medium">{c.rfm_frequency}</td>
                  <td className="py-3 px-4 font-semibold text-emerald-400 font-mono">
                    ₹{Number(c.rfm_monetary).toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-slate-300 font-mono">₹{Number(c.aov).toLocaleString('en-IN')}</td>
                  <td className="py-3 px-4 font-bold text-indigo-300 font-mono">₹{Number(c.clv).toLocaleString('en-IN')}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-md border ${
                        c.discount_sensitivity === 'High'
                          ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                          : c.discount_sensitivity === 'Medium'
                          ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                          : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                      }`}
                    >
                      {c.discount_sensitivity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
