import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Search, Filter, Star, ShoppingCart, ArrowUpDown, Sparkles, Check, Flame, SlidersHorizontal, X } from 'lucide-react';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popularity');
  const [loading, setLoading] = useState(true);
  const { addToCart, showToast } = useApp();

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

  const handleAddToCart = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    showToast(`Added "${product.name}" to cart`, 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-400" /> Curated Technology Catalog
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              {products.length > 0 ? `${products.length} Products Available` : 'Loading items...'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            High-Performance Hardware & Gadgets
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Browse flagship laptops, developer workstations, high-fidelity audio, and intelligent accessories with Razorpay settlement.
          </p>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search specs, RTX, M3, Apple..."
              className="w-full pl-9 pr-8 py-2.5 text-xs bg-slate-900/90 border border-slate-700/80 text-white rounded-xl focus:outline-none focus:border-indigo-500 transition-colors shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5 rounded"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-700/80 rounded-xl px-3 py-2.5 text-xs text-slate-300 shadow-inner">
            <ArrowUpDown className="w-3.5 h-3.5 text-indigo-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent focus:outline-none text-white text-xs cursor-pointer"
            >
              <option value="popularity" className="bg-slate-900">Popularity (Recommended)</option>
              <option value="price_asc" className="bg-slate-900">Price: Low to High</option>
              <option value="price_desc" className="bg-slate-900">Price: High to Low</option>
              <option value="rating" className="bg-slate-900">Highest Customer Rating</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.name;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30 scale-105 border border-indigo-400/30'
                  : 'glass-panel text-slate-400 hover:text-white border border-slate-800/80 hover:border-slate-700'
              }`}
            >
              {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div key={n} className="h-96 rounded-3xl bg-slate-900/60 border border-slate-800 animate-pulse p-4 space-y-4">
              <div className="w-full aspect-video bg-slate-800 rounded-2xl" />
              <div className="h-4 bg-slate-800 rounded w-3/4" />
              <div className="h-3 bg-slate-800 rounded w-full" />
              <div className="h-3 bg-slate-800 rounded w-2/3" />
              <div className="h-8 bg-slate-800 rounded-xl mt-4" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 rounded-3xl glass-panel border border-slate-800 space-y-4 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">No products match your criteria</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            We couldn't find anything matching "{searchQuery}" in {selectedCategory}. Try resetting your filters.
          </p>
          <button
            onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
            className="px-5 py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-90 transition-opacity shadow-md shadow-indigo-600/30"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => {
            const hasDiscount = product.original_price && product.original_price > product.price;
            const discountPct = hasDiscount
              ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
              : 0;
            const isBestSeller = product.rating >= 4.7;
            const isLowStock = product.stock && product.stock <= 15;

            return (
              <div
                key={product.id}
                className="group flex flex-col justify-between p-4 rounded-3xl glass-panel glass-panel-hover border border-slate-800 space-y-3 shadow-xl relative overflow-hidden transition-all duration-300 hover:border-slate-700/80"
              >
                <div className="space-y-3">
                  {/* Product Image Thumbnail */}
                  <Link to={`/products/${product.id}`} className="block relative aspect-video rounded-2xl overflow-hidden bg-slate-900 border border-slate-800/80">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />
                    
                    {/* Category pill */}
                    <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-950/85 text-indigo-300 backdrop-blur-md border border-slate-700/60 shadow">
                      {product.category}
                    </span>

                    {/* Discount or Best Seller Badge */}
                    <div className="absolute top-2.5 right-2.5 flex flex-col gap-1 items-end">
                      {hasDiscount && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-rose-500/90 text-white backdrop-blur-md shadow">
                          -{discountPct}%
                        </span>
                      )}
                      {isBestSeller && !hasDiscount && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 backdrop-blur-md flex items-center gap-1">
                          <Flame className="w-2.5 h-2.5 text-amber-400" /> Best Seller
                        </span>
                      )}
                    </div>

                    {/* Stock Indicator if low */}
                    {isLowStock && (
                      <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded text-[9px] font-bold bg-rose-950/80 text-rose-300 border border-rose-500/30 backdrop-blur-md">
                        Only {product.stock} left in stock
                      </span>
                    )}
                  </Link>

                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="flex items-center gap-1 text-[11px] font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {product.rating}
                        <span className="text-[10px] text-slate-400 font-normal">({product.reviews_count || 120})</span>
                      </span>
                      <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        Razorpay Ready
                      </span>
                    </div>

                    <Link to={`/products/${product.id}`} className="block">
                      <h3 className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                </div>

                <div className="pt-3 mt-auto border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <div>
                    <div className="text-sm font-black text-white font-mono">
                      ₹{Number(product.price).toLocaleString('en-IN')}
                    </div>
                    {hasDiscount && (
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
                      Details
                    </Link>
                    <button
                      onClick={(e) => handleAddToCart(product, e)}
                      className="p-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white transition-all shadow-md shadow-indigo-600/30 hover:scale-105 active:scale-95 cursor-pointer"
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
