import React, { useState, useEffect } from 'react';
import { Package, Search, Star, AlertTriangle } from 'lucide-react';

export default function MerchantProductsPage() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/products?limit=50${searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ''}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [searchQuery]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Package className="w-6 h-6 text-indigo-400" />
            Product Inventory & Margin Catalog
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage inventory levels, prices, verified ratings, and AI recommendation tags
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search catalog..."
            className="w-full pl-8 pr-3 py-2 text-xs bg-slate-900 border border-slate-700 text-white rounded-xl focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                <th className="pb-3 font-semibold">Product</th>
                <th className="pb-3 font-semibold">Category</th>
                <th className="pb-3 font-semibold">Price</th>
                <th className="pb-3 font-semibold">Original</th>
                <th className="pb-3 font-semibold">Stock</th>
                <th className="pb-3 font-semibold">Rating</th>
                <th className="pb-3 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <img src={p.image_url} alt={p.name} className="w-9 h-9 rounded-lg object-cover bg-slate-800 shrink-0" />
                      <div>
                        <span className="font-semibold text-white block line-clamp-1">{p.name}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{p.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 text-slate-300">{p.category}</td>
                  <td className="py-3 font-bold text-white">₹{Number(p.price).toLocaleString('en-IN')}</td>
                  <td className="py-3 text-slate-500 line-through">
                    ₹{Number(p.original_price || p.price).toLocaleString('en-IN')}
                  </td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      p.stock < 25 ? 'bg-rose-500/20 text-rose-300' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {p.stock} units
                    </span>
                  </td>
                  <td className="py-3">
                    <span className="flex items-center gap-1 text-amber-400 text-xs">
                      <Star className="w-3 h-3 fill-amber-400" />
                      {p.rating}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Active
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
