import { BadgePercent, Gem, PackageSearch, Sparkles, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const EpicShowcase = () => {
  const highlights = [
    { icon: Zap, label: 'Flash-ready deals', value: 'Daily picks' },
    { icon: Gem, label: 'Curated quality', value: 'Verified catalog' },
    { icon: PackageSearch, label: 'Smart discovery', value: 'Fast filters' },
  ];

  return (
    <section className="relative overflow-hidden soft-grid-bg border-y border-cyan-100 bg-white/70">
      <div className="hero-orbit"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 items-center">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 border border-amber-200 px-3 py-1.5 text-xs font-bold text-amber-800">
              <Sparkles size={14} />
              <span>New ShopEZ Experience</span>
            </div>
            <div>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950">
                Discover products with a storefront that feels fast, polished, and alive.
              </h2>
              <p className="mt-3 max-w-2xl text-sm sm:text-base leading-relaxed text-slate-600">
                Clean product browsing, sharp visual feedback, quick filters, and confident checkout cues give ShopEZ a premium retail feel.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/products" className="btn-primary">
                Explore Deals
              </Link>
              <Link to="/products?sort=ratingDesc" className="btn-secondary">
                Top Rated
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3">
            {highlights.map(({ icon: Icon, label, value }) => (
              <div key={label} className="metric-pill rounded-xl p-4 flex items-center gap-4">
                <div className="rounded-lg bg-cyan-50 border border-cyan-100 p-3 text-cyan-700">
                  <Icon size={22} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-slate-500">{label}</p>
                  <p className="text-lg font-black text-slate-950">{value}</p>
                </div>
              </div>
            ))}
            <div className="metric-pill rounded-xl p-4 flex items-center gap-4 border-amber-200">
              <div className="rounded-lg bg-amber-50 border border-amber-100 p-3 text-amber-700">
                <BadgePercent size={22} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-slate-500">Checkout boost</p>
                <p className="text-lg font-black text-slate-950">Discount-ready</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EpicShowcase;
