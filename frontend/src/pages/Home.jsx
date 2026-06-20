import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import ProductCard from '../components/ProductCard';
import { ArrowRight, CreditCard, ShieldCheck, Truck, Headphones, PackageCheck } from 'lucide-react';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await API.get('/products');
        setFeaturedProducts(data.slice(0, 4));
      } catch (err) {
        console.error('Error fetching featured products:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = [
    { name: 'Electronics', count: '12 items' },
    { name: 'Fashion', count: '8 items' },
    { name: 'Sports & Outdoors', count: '5 items' },
    { name: 'Home & Kitchen', count: '6 items' },
  ];

  const benefits = [
    { title: 'Fast fulfillment', detail: 'Reliable delivery options', icon: Truck },
    { title: 'Secure checkout', detail: 'Protected payment flow', icon: ShieldCheck },
    { title: 'Flexible payment', detail: 'Simple card checkout', icon: CreditCard },
    { title: 'Customer support', detail: 'Help when you need it', icon: Headphones },
  ];

  return (
    <div className="pb-16">
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-cyan-50 border border-cyan-100 rounded-full text-xs font-semibold text-cyan-800">
              <PackageCheck size={14} />
              <span>Curated catalog for everyday shopping</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-950 leading-tight">
                Shop smarter with a clean, reliable product experience.
              </h1>
              <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
                Browse products, compare prices, review availability, and manage your orders from one organized shopping workspace.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link to="/products" className="btn-primary flex items-center justify-center gap-2">
                <span>Browse Products</span>
                <ArrowRight size={18} />
              </Link>
              <Link to="/register" className="btn-secondary flex items-center justify-center">
                Create Account
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="bg-slate-100 border border-slate-200 rounded-xl p-5 shadow-sm">
              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=900"
                  alt="Customer shopping online"
                  className="w-full aspect-[4/3] object-cover"
                />
                <div className="p-5 grid grid-cols-3 gap-4 border-t border-slate-200">
                  <div>
                    <p className="text-2xl font-bold text-slate-950">31</p>
                    <p className="text-xs font-medium text-slate-500">Products</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-950">4</p>
                    <p className="text-xs font-medium text-slate-500">Categories</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-950">24/7</p>
                    <p className="text-xs font-medium text-slate-500">Access</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {benefits.map(({ title, detail, icon: Icon }) => (
            <div key={title} className="bg-white border border-slate-200 rounded-lg p-5 flex items-start gap-4 shadow-sm">
              <div className="p-2.5 bg-cyan-50 border border-cyan-100 rounded-lg text-cyan-700">
                <Icon size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-950">{title}</h4>
                <p className="text-sm text-slate-500 mt-1">{detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-end justify-between mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-950">Shop By Category</h2>
            <p className="text-sm text-slate-600 mt-1">Find the right section quickly.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/products?category=${encodeURIComponent(cat.name)}`}
              className="bg-white border border-slate-200 rounded-lg p-5 hover:border-cyan-500 hover:shadow-md transition-all duration-200"
            >
              <h3 className="font-bold text-slate-950">{cat.name}</h3>
              <span className="text-sm text-slate-500 mt-2 block">{cat.count}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-950">Featured Products</h2>
            <p className="text-sm text-slate-600 mt-1">Recently highlighted items from the catalog.</p>
          </div>
          <Link to="/products" className="text-sm font-bold text-cyan-700 hover:text-cyan-800 flex items-center gap-1 transition-colors">
            <span>View All</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-lg p-4 space-y-4 animate-pulse">
                <div className="bg-slate-100 aspect-square rounded-lg"></div>
                <div className="h-4 bg-slate-100 rounded w-2/3"></div>
                <div className="h-4 bg-slate-100 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
