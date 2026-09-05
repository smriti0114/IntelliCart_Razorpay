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
      {/* Search & Sort Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-blue-600" /> Catalog Telemetry
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Curated Tech Hardware</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Browse verified laptops, dev machines, flagship audio, and smart gear
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search specs, Ryzen, RTX, OLED..."
              className="w-full pl-9 pr-8 py-2.5 text-xs bg-white border border-slate-300 text-slate-900 placeholder-slate-400 rounded-xl focus:outline-none focus:border-blue-500 transition-colors shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-700 shadow-sm">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent focus:outline-none text-slate-900 text-xs cursor-pointer font-medium"
            >
              <option value="popularity" className="bg-white text-slate-900">Popularity</option>
              <option value="price_asc" className="bg-white text-slate-900">Price: Low to High</option>
              <option value="price_desc" className="bg-white text-slate-900">Price: High to Low</option>
              <option value="rating" className="bg-white text-slate-900">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.name)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
              selectedCategory === cat.name
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 scale-105'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
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
            <div key={n} className="h-80 rounded-3xl bg-slate-100 border border-slate-200 animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm">
          <p className="text-base font-bold text-slate-800">No products match your criteria</p>
          <button
            onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 text-blue-700 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => {
            const discountPct = product.original_price
              ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
              : 0;

            return (
              <div
                key={product.id}
                className="group flex flex-col justify-between p-4 rounded-3xl card-premium border border-slate-200 space-y-3 shadow-sm relative overflow-hidden"
              >
                <div className="space-y-3">
                  <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent pointer-events-none opacity-40 group-hover:opacity-20 transition-opacity" />
                    
                    <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-white/95 text-blue-700 backdrop-blur-md border border-slate-200 shadow-sm">
                      {product.category}
                    </span>
                    
                    <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1 backdrop-blur-md shadow-sm">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      {product.rating}
                    </span>

                    {discountPct > 0 && (
                      <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-md text-[9px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 backdrop-blur-md">
                        {discountPct}% OFF
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                </div>

                <div className="pt-3 mt-auto border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-black text-slate-900 font-mono">
                      ₹{Number(product.price).toLocaleString('en-IN')}
                    </div>
                    {product.original_price && (
                      <div className="text-[10px] text-slate-400 line-through font-mono">
                        ₹{Number(product.original_price).toLocaleString('en-IN')}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Link
                      to={`/products/${product.id}`}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 text-[11px] font-semibold transition-all border border-slate-200"
                    >
                      Specs
                    </Link>
                    <button
                      onClick={() => addToCart(product)}
                      className="p-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white transition-all shadow-md shadow-blue-600/20 active:scale-90 cursor-pointer"
                      title="Add to Cart"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
