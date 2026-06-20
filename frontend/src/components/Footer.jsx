import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 text-slate-600 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="text-xl font-extrabold text-slate-950 mb-4">ShopEZ</h3>
            <p className="text-sm max-w-sm mb-4 leading-relaxed">
              A streamlined shopping platform for browsing products, managing carts, and tracking orders with confidence.
            </p>
            <p className="text-xs text-slate-500">
              &copy; {new Date().getFullYear()} ShopEZ. All rights reserved.
            </p>
          </div>

          <div>
            <h4 className="text-slate-950 font-bold text-sm uppercase mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-cyan-700 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-cyan-700 transition-colors">Products</Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-cyan-700 transition-colors">Shopping Cart</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-slate-950 font-bold text-sm uppercase mb-4">Featured Categories</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/products?category=Electronics" className="hover:text-cyan-700 transition-colors">Electronics</Link>
              </li>
              <li>
                <Link to="/products?category=Fashion" className="hover:text-cyan-700 transition-colors">Fashion</Link>
              </li>
              <li>
                <Link to="/products?category=Sports+%26+Outdoors" className="hover:text-cyan-700 transition-colors">Sports & Outdoors</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
