import React, { useState, useEffect } from 'react';
import { Package, Search, Star, AlertTriangle, RefreshCw, X, Check, Layers } from 'lucide-react';

export default function MerchantProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => setCategories([{ id: 'all', name: 'All' }, ...data]))
      .catch((e) => console.error(e));
  }, []);

  const fetchProducts = () => {
    setLoading(true);
    const catQuery = selectedCategory !== 'All' ? `&category=${encodeURIComponent(selectedCategory)}` : '';
    const searchParam = searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : '';

    fetch(`/api/products?limit=60${catQuery}${searchParam}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchQuery]);

  const lowStockCount = products.filter((p) => p.stock <= 25).length;
  const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center gap-1">
              <Package className="w-3 h-3 text-indigo-400" /> Catalog Inventory
            </span>
            <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-radar" /> 110 SKUs Synced
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Product Inventory & Catalog</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Manage unit stocks, price points, verified ratings, and AI recommendation distribution
          </p>
        </div>

        <button
          onClick={fetchProducts}
          className="px-4 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white transition-all flex items-center gap-2 text-xs font-semibold shadow-md cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
          <span>Sync Inventory</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl glass-panel border border-slate-800 space-y-1 shadow">
          <span className="text-[11px] text-slate-400 block">Catalog SKUs</span>
          <span className="text-xl font-black text-white font-mono">{products.length}</span>
        </div>
        <div className="p-4 rounded-2xl glass-panel border border-slate-800 space-y-1 shadow">
          <span className="text-[11px] text-slate-400 block">Total Units in Stock</span>
          <span className="text-xl font-black text-indigo-400 font-mono">{totalStock.toLocaleString()}</span>
        </div>
        <div className="p-4 rounded-2xl glass-panel border border-slate-800 space-y-1 shadow">
          <span className="text-[11px] text-slate-400 block">Low Stock Alerts</span>
          <span className={`text-xl font-black font-mono ${lowStockCount > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
            {lowStockCount} SKUs
          </span>
        </div>
        <div className="p-4 rounded-2xl glass-panel border border-slate-800 space-y-1 shadow">
          <span className="text-[11px] text-slate-400 block">Razorpay Ready</span>
          <span className="text-xl font-black text-emerald-400 font-mono">100%</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.name
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'glass-panel text-slate-400 hover:text-white border border-slate-800/80'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search SKUs, names..."
            className="w-full pl-9 pr-8 py-2 text-xs bg-slate-900/90 border border-slate-700/80 text-white rounded-xl focus:outline-none focus:border-indigo-500 transition-colors shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5 rounded cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Products Table */}
      <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-4 shadow-2xl">
        <div className="overflow-x-auto rounded-xl border border-slate-800/80">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60">
              <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                <th className="py-3 px-4 font-semibold">Product</th>
                <th className="py-3 px-4 font-semibold">Category</th>
                <th className="py-3 px-4 font-semibold">Online Price</th>
                <th className="py-3 px-4 font-semibold">List Price</th>
                <th className="py-3 px-4 font-semibold">Inventory Units</th>
                <th className="py-3 px-4 font-semibold">Rating</th>
                <th className="py-3 px-4 font-semibold text-right">Gateway Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 bg-slate-900/40">
              {products.map((p) => {
                const isLow = p.stock <= 25;
                return (
                  <tr key={p.id} className="hover:bg-indigo-950/20 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img src={p.image_url} alt={p.name} className="w-10 h-10 rounded-xl object-cover bg-slate-800 shrink-0 border border-slate-700/60" />
                        <div className="min-w-0">
                          <span className="font-semibold text-white block line-clamp-1">{p.name}</span>
                          <span className="text-[10px] text-slate-500 font-mono">{p.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-300">{p.category}</td>
                    <td className="py-3 px-4 font-bold text-white font-mono">
                      ₹{Number(p.price).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-slate-500 line-through font-mono">
                      ₹{Number(p.original_price || p.price).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold font-mono ${
                        isLow ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-slate-800/80 text-slate-300 border border-slate-700/50'
                      }`}>
                        {p.stock} units
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="flex items-center gap-1 text-amber-300 text-xs font-bold">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {p.rating}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Active
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
