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
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-violet-700 border border-blue-200 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-blue-600" /> K-Means ML Clustering
          </span>
          <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-radar" /> 5 Clusters Synced
          </span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
          <Users className="w-6 h-6 text-blue-600" />
          Customer Intelligence & K-Means Segmentation
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
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
              className={`p-4 rounded-2xl border cursor-pointer transition-all duration-300 space-y-2 relative overflow-hidden group shadow-sm ${
                isSelected
                  ? 'bg-blue-50/80 border-blue-500 text-slate-900 ring-2 ring-blue-200 shadow-md'
                  : 'card-premium text-slate-700 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {seg.segment_name}
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-white text-slate-700 font-mono border border-slate-200">
                  {seg.customer_count}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{seg.description}</p>
              <div className="pt-2 border-t border-slate-100 text-[11px] flex justify-between items-center text-slate-600">
                <span>Avg AOV:</span>
                <span className="font-bold text-blue-600 font-mono">₹{Number(seg.avg_aov).toLocaleString('en-IN')}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Customer Ledger Table */}
      <div className="p-6 rounded-3xl card-premium space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2.5">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Customer Profiles Ledger ({customers.length} Loaded)
            </h3>
            {selectedSegment !== 'All' && (
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-blue-50 text-violet-700 border border-blue-200 font-semibold flex items-center gap-1.5">
                Filtered: {selectedSegment}
                <button
                  onClick={() => setSelectedSegment('All')}
                  className="hover:text-blue-900 font-bold ml-1 text-slate-400 cursor-pointer"
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
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 text-slate-900 placeholder-slate-400 rounded-xl focus:outline-none focus:border-blue-500 transition-colors shadow-inner"
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50">
              <tr className="border-b border-slate-200 text-slate-600 text-[11px]">
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
            <tbody className="divide-y divide-slate-100 bg-white">
              {loading ? (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-slate-500">
                    <div className="flex items-center justify-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                      <span>Loading customer intelligence records...</span>
                    </div>
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-slate-500">
                    No customer records found matching the query.
                  </td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr key={c.id} className="hover:bg-blue-50/40 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-900 block">{c.name}</span>
                      <span className="text-[11px] text-slate-400 font-mono">{c.email}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-violet-700 border border-blue-200">
                        {c.segment}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">{c.rfm_recency}d ago</td>
                    <td className="py-3 px-4 text-slate-700 font-mono font-medium">{c.rfm_frequency}</td>
                    <td className="py-3 px-4 font-semibold text-emerald-600 font-mono">
                      ₹{Number(c.rfm_monetary).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-slate-700 font-mono">₹{Number(c.aov).toLocaleString('en-IN')}</td>
                    <td className="py-3 px-4 font-bold text-blue-600 font-mono">₹{Number(c.clv).toLocaleString('en-IN')}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-md border ${
                          c.discount_sensitivity === 'High'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : c.discount_sensitivity === 'Medium'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}
                      >
                        {c.discount_sensitivity}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
