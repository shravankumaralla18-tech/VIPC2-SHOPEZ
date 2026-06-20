import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../services/api';
import ProductCard from '../components/ProductCard';
import { Search, Filter, SlidersHorizontal, RefreshCw } from 'lucide-react';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter States initialized from URL params if present
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [priceMin, setPriceMin] = useState(searchParams.get('priceMin') || '');
  const [priceMax, setPriceMax] = useState(searchParams.get('priceMax') || '');

  // Synchronize input fields with URL changes (e.g. from header search)
  useEffect(() => {
    setSearch(searchParams.get('search') || '');
    setCategory(searchParams.get('category') || '');
  }, [searchParams]);

  // Fetch products when parameters update
  useEffect(() => {
    const fetchFilteredProducts = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (search) queryParams.append('search', search);
        if (category) queryParams.append('category', category);
        if (sort) queryParams.append('sort', sort);
        if (priceMin) queryParams.append('priceMin', priceMin);
        if (priceMax) queryParams.append('priceMax', priceMax);

        // Update URL query parameters
        setSearchParams(queryParams, { replace: true });

        const { data } = await API.get(`/products?${queryParams.toString()}`);
        setProducts(data);
      } catch (error) {
        console.error('Error loading products:', error.message);
      } finally {
        setLoading(false);
      }
    };

    // Debounce price input searches slightly to prevent too many DB queries
    const delayDebounce = setTimeout(() => {
      fetchFilteredProducts();
    }, 250);

    return () => clearTimeout(delayDebounce);
  }, [search, category, sort, priceMin, priceMax, setSearchParams]);

  const resetFilters = () => {
    setSearch('');
    setCategory('');
    setSort('newest');
    setPriceMin('');
    setPriceMax('');
  };

  const categoriesList = ['Electronics', 'Fashion', 'Sports & Outdoors', 'Home & Kitchen'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-950">Product Catalog</h1>
        <p className="text-sm text-slate-600 mt-1">Search, filter, and sort available products.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Filters Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-5 rounded-lg border border-slate-200 space-y-6 shadow-sm">
            
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2 text-slate-950 font-bold">
                <SlidersHorizontal size={18} />
                <span>Filters</span>
              </div>
              <button 
                onClick={resetFilters} 
                className="text-xs text-cyan-700 hover:text-cyan-800 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <RefreshCw size={12} />
                Reset
              </button>
            </div>

            {/* Keyword Search */}
            <div className="space-y-2">
              <label className="text-xs uppercase font-extrabold text-slate-500">Search Keyword</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Headphones"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100 rounded-lg py-2 pl-3 pr-9 text-xs text-slate-900 outline-none"
                />
                <Search size={14} className="absolute right-3 top-3 text-slate-500" />
              </div>
            </div>

            {/* Categories */}
            <div className="space-y-2.5">
              <label className="text-xs uppercase font-extrabold text-slate-500">Category</label>
              <div className="flex flex-col gap-1.5">
                <button
                  onClick={() => setCategory('')}
                  className={`text-left text-xs font-semibold px-3 py-2 rounded-xl transition-all duration-200 ${
                    category === ''
                      ? 'bg-cyan-50 text-cyan-800 border border-cyan-200'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  All Categories
                </button>
                {categoriesList.map((cat, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCategory(cat)}
                    className={`text-left text-xs font-semibold px-3 py-2 rounded-xl transition-all duration-200 ${
                      category === cat
                        ? 'bg-cyan-50 text-cyan-800 border border-cyan-200'
                        : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50 border border-transparent'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Ranges */}
            <div className="space-y-2">
              <label className="text-xs uppercase font-extrabold text-slate-500">Price Range ($)</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100 rounded-lg py-2 px-3 text-xs text-slate-900 outline-none"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100 rounded-lg py-2 px-3 text-xs text-slate-900 outline-none"
                />
              </div>
            </div>

            {/* Sorting Selection */}
            <div className="space-y-2">
              <label className="text-xs uppercase font-extrabold text-slate-500">Sort By</label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100 rounded-lg py-2 px-3 text-xs text-slate-900 outline-none cursor-pointer"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
                <option value="ratingDesc">Top Customer Rated</option>
              </select>
            </div>

          </div>
        </div>

        {/* Products Grid Area */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white border border-slate-200 rounded-lg p-4 space-y-4 animate-pulse">
                  <div className="bg-slate-100 aspect-square rounded-lg"></div>
                  <div className="h-4 bg-slate-100 rounded w-2/3"></div>
                  <div className="h-4 bg-slate-100 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-lg p-12 text-center border border-slate-200 shadow-sm">
              <div className="inline-flex p-4 bg-slate-50 rounded-full border border-slate-200 text-slate-500 mb-4">
                <Filter size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-950">No Products Found</h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1">
                We couldn't find any products matching your active filters. Try expanding your parameters or searching for something else.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default Products;
