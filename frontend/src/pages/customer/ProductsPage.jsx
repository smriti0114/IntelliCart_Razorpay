import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Search, Filter, Star, ShoppingCart, ArrowUpDown, Sparkles } from 'lucide-react';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popularity');
  const [loading, setLoading] = useState(true);
  const { addToCart } = useApp();

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => setCategories([{ id: 'all', name: 'All' }, ...data]))
      .catch((e) => console.error(e));
  }, []);

  useEffect(() => {
    setLoading(true);
    const catQuery = selectedCategory !== 'All' ? `&category=${encodeURIComponent(selectedCategory)}` : '';
    const searchParam = searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : '';
    const sortParam = `&sort=${sortBy}`;

    fetch(`/api/products?limit=50${catQuery}${searchParam}${sortParam}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [selectedCategory, searchQuery, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Product Catalog</h1>
          <p className="text-xs text-slate-400 mt-1">
            Browse 110+ high-performance laptops, flagships, and developer hardware
          </p>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search specs, RTX, M3..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-900 border border-slate-700 text-white rounded-xl focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-300">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent focus:outline-none text-white text-xs cursor-pointer"
            >
              <option value="popularity" className="bg-slate-900">Popularity</option>
              <option value="price_asc" className="bg-slate-900">Price: Low to High</option>
              <option value="price_desc" className="bg-slate-900">Price: High to Low</option>
              <option value="rating" className="bg-slate-900">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.name)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${
              selectedCategory === cat.name
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-indigo-600/30 scale-105'
                : 'glass-panel text-slate-400 hover:text-white border border-slate-800/80 hover:border-slate-700'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div key={n} className="h-80 rounded-3xl bg-slate-900/60 border border-slate-800 animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 rounded-3xl glass-panel border border-slate-800 space-y-4">
          <p className="text-base font-bold text-slate-200">No products match your criteria</p>
          <button
            onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 text-indigo-300 hover:bg-slate-700 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="group flex flex-col justify-between p-4 rounded-3xl glass-panel glass-panel-hover border border-slate-800 space-y-3 shadow-xl relative overflow-hidden"
            >
              <div className="space-y-3">
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-800">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />
                  <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-950/80 text-indigo-300 backdrop-blur-md border border-slate-700/60">
                    {product.category}
                  </span>
                  <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1 backdrop-blur-md">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    {product.rating}
                  </span>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              </div>

              <div className="pt-3 mt-auto border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <div className="text-sm font-black text-white font-mono">
                    ₹{Number(product.price).toLocaleString('en-IN')}
                  </div>
                  {product.original_price && (
                    <div className="text-[10px] text-slate-500 line-through font-mono">
                      ₹{Number(product.original_price).toLocaleString('en-IN')}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <Link
                    to={`/products/${product.id}`}
                    className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-semibold transition-all border border-slate-700/60"
                  >
                    Specs
                  </Link>
                  <button
                    onClick={() => addToCart(product)}
                    className="p-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white transition-all shadow-md shadow-indigo-600/30 active:scale-90"
                    title="Add to Cart"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
