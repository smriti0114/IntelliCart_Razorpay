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
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Package className="w-6 h-6 text-blue-600" />
            Product Inventory & Margin Catalog
          </h1>
          <p className="text-xs text-slate-500 mt-1">
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
            className="w-full pl-8 pr-3 py-2 text-xs bg-white border border-slate-300 text-slate-900 placeholder-slate-400 rounded-xl focus:outline-none focus:border-blue-500 shadow-inner"
          />
        </div>
      </div>

      <div className="p-6 rounded-3xl card-premium border border-slate-200 space-y-4 shadow-sm">
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50">
              <tr className="border-b border-slate-200 text-slate-600 text-[11px]">
                <th className="py-3 px-4 font-semibold">Product</th>
                <th className="py-3 px-4 font-semibold">Category</th>
                <th className="py-3 px-4 font-semibold">Price</th>
                <th className="py-3 px-4 font-semibold">Original</th>
                <th className="py-3 px-4 font-semibold">Stock</th>
                <th className="py-3 px-4 font-semibold">Rating</th>
                <th className="py-3 px-4 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-500">
                    <div className="flex items-center justify-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                      <span>Loading inventory catalog...</span>
                    </div>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-500">
                    No products found.
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="hover:bg-blue-50/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img src={p.image_url} alt={p.name} className="w-9 h-9 rounded-lg object-cover bg-slate-100 shrink-0 border border-slate-200" />
                        <div>
                          <span className="font-semibold text-slate-900 block line-clamp-1">{p.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{p.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-700">{p.category}</td>
                    <td className="py-3 px-4 font-bold text-slate-900 font-mono">₹{Number(p.price).toLocaleString('en-IN')}</td>
                    <td className="py-3 px-4 text-slate-400 line-through font-mono">
                      ₹{Number(p.original_price || p.price).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        p.stock < 25 ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}>
                        {p.stock} units
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="flex items-center gap-1 text-amber-600 text-xs font-semibold">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        {p.rating}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Active
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
