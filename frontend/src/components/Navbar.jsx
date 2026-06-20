import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { ShoppingCart, User, LogOut, Search, Settings, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartCount } = useContext(CartContext);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-extrabold font-sans tracking-tight text-slate-950">
              ShopEZ
            </Link>
            
            {/* Desktop Navigation Links */}
            <div className="hidden md:flex ml-10 space-x-6 text-sm font-semibold">
              <Link to="/" className="text-slate-600 hover:text-cyan-700 transition-colors duration-200">
                Home
              </Link>
              <Link to="/products" className="text-slate-600 hover:text-cyan-700 transition-colors duration-200">
                Products
              </Link>
            </div>
          </div>

          {/* Search bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-6">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100 rounded-lg py-2 pl-4 pr-10 text-sm text-slate-900 placeholder-slate-500 outline-none transition-all duration-200"
              />
              <button type="submit" className="absolute right-3 top-2.5 text-slate-500 hover:text-cyan-700" aria-label="Search">
                <Search size={18} />
              </button>
            </form>
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Cart Icon */}
            <Link to="/cart" className="relative p-2.5 rounded-lg bg-white border border-slate-300 hover:border-cyan-600 hover:text-cyan-700 text-slate-700 transition-colors duration-200">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-cyan-700 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-sm border border-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Dropdown/Links */}
            {user ? (
              <div className="flex items-center space-x-3">
                {user.role === 'admin' && (
                  <Link to="/admin" className="flex items-center space-x-1.5 px-3 py-2 bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 rounded-lg text-cyan-800 text-xs font-semibold transition-colors duration-200">
                    <Settings size={14} />
                    <span>Admin</span>
                  </Link>
                )}
                
                <Link to="/profile" className="flex items-center space-x-1.5 text-sm font-semibold text-slate-700 hover:text-cyan-700 transition-colors duration-200">
                  <User size={18} className="text-slate-500" />
                  <span className="max-w-[100px] truncate">{user.name}</span>
                </Link>

                <button onClick={logout} className="p-2.5 rounded-lg bg-white border border-slate-300 hover:border-red-300 hover:text-red-600 text-slate-600 transition-colors duration-200 cursor-pointer" aria-label="Sign out">
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="text-sm font-semibold text-slate-700 hover:text-cyan-700 transition-colors duration-200">
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary text-xs font-semibold !px-4 !py-2">
                  Create Account
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Buttons */}
          <div className="flex md:hidden items-center space-x-3">
            <Link to="/cart" className="relative p-2 rounded-lg bg-white border border-slate-300 text-slate-700">
              <ShoppingCart size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-cyan-700 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-lg bg-white border border-slate-300 text-slate-700" aria-label="Toggle menu">
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-4 shadow-xl">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 focus:border-cyan-600 rounded-lg py-2 pl-4 pr-10 text-sm text-slate-900 outline-none"
            />
            <button type="submit" className="absolute right-3 top-2.5 text-slate-500" aria-label="Search">
              <Search size={18} />
            </button>
          </form>

          {/* Links */}
          <div className="flex flex-col space-y-3 font-semibold text-slate-700">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="hover:text-cyan-700 py-1">
              Home
            </Link>
            <Link to="/products" onClick={() => setMobileMenuOpen(false)} className="hover:text-cyan-700 py-1">
              Products
            </Link>
            {user && user.role === 'admin' && (
              <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="text-cyan-700 hover:text-cyan-800 py-1">
                Admin
              </Link>
            )}
            {user && (
              <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="hover:text-cyan-700 py-1">
                My Profile / Orders
              </Link>
            )}
          </div>

          <div className="border-t border-slate-200 pt-3">
            {user ? (
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-700 truncate max-w-[150px]">
                  {user.name}
                </span>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-1 text-sm text-red-600 hover:text-red-700 font-semibold"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-sm text-slate-700 hover:text-cyan-700 font-semibold">
                  Sign In
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="btn-primary text-xs font-semibold !px-4 !py-2">
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
