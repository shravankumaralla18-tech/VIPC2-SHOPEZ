import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import { Trash2, ShoppingBag, CreditCard, ChevronRight, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, cartSubtotal, cartTotal, cartDiscountSavings, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Checkout address states
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('United States');

  // Flow states
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [orderError, setOrderError] = useState(null);
  const [placedOrder, setPlacedOrder] = useState(null);

  // Address validation error
  const [validationError, setValidationError] = useState('');

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');
    setOrderError(null);

    if (!user) {
      navigate('/login', { state: { from: { pathname: '/cart' } } });
      return;
    }

    if (!street || !city || !state || !zipCode || !country) {
      setValidationError('Please fill in your shipping address details.');
      return;
    }

    setCheckoutLoading(true);

    try {
      const orderData = {
        items: cartItems.map(item => ({
          product: item.product._id,
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
          discount: item.product.discount || 0
        })),
        shippingAddress: {
          street,
          city,
          state,
          zipCode,
          country
        },
        totalAmount: cartTotal
      };

      const { data } = await API.post('/orders', orderData);
      
      // Clear items from context
      await clearCart();
      
      setPlacedOrder(data);
    } catch (err) {
      setOrderError(err.response?.data?.message || 'Failed to place order. Try again.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  // If order was successfully placed, display premium receipt
  if (placedOrder) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="inline-flex p-4 bg-green-500/10 rounded-full border border-green-500/20 text-green-400">
          <CheckCircle2 size={48} />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-100">Order Confirmed!</h1>
          <p className="text-sm text-slate-400">
            Thank you for shopping with ShopEZ. Your transaction is complete.
          </p>
        </div>

        <div className="glassmorphism p-6 rounded-2xl border border-dark-800 text-left space-y-4">
          <div className="flex justify-between text-xs border-b border-dark-800 pb-3 text-slate-400">
            <span>Order ID: <span className="font-bold text-slate-200">{placedOrder._id}</span></span>
            <span>Date: {new Date(placedOrder.createdAt).toLocaleDateString()}</span>
          </div>

          <div className="space-y-2.5">
            <h3 className="text-xs uppercase font-extrabold tracking-widest text-slate-500">Shipping Details</h3>
            <p className="text-sm text-slate-300 font-medium">
              {placedOrder.shippingAddress.street}, {placedOrder.shippingAddress.city}, {placedOrder.shippingAddress.state} {placedOrder.shippingAddress.zipCode}, {placedOrder.shippingAddress.country}
            </p>
          </div>

          <div className="border-t border-dark-800 pt-3 flex justify-between items-center">
            <span className="text-sm font-bold text-slate-350">Total Paid (Virtual Balance):</span>
            <span className="text-xl font-extrabold text-gradient-purple-amber">${placedOrder.totalAmount.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex justify-center gap-4 pt-4">
          <Link to="/profile" className="btn-primary">
            View My Orders
          </Link>
          <Link to="/products" className="btn-secondary">
            Keep Shopping
          </Link>
        </div>
      </div>
    );
  }

  // Empty cart view
  if (cartItems.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
        <div className="inline-flex p-4 bg-dark-900 border border-dark-800 rounded-full text-slate-500">
          <ShoppingBag size={40} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-200">Your Cart is Empty</h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            Looks like you haven't added anything to your cart yet. Visit our product listing page to find our latest collection.
          </p>
        </div>
        <Link to="/products" className="btn-primary inline-flex">
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <div>
        <h1 className="text-3xl font-extrabold text-slate-100">Shopping Cart</h1>
        <p className="text-sm text-slate-450 mt-1">Manage items in your shopping bag and proceed to checkout</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Cart items list */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => {
            const prod = item.product;
            const pId = prod._id || prod;
            const hasDiscount = prod.discount > 0;
            const itemPrice = hasDiscount ? prod.price * (1 - prod.discount / 100) : prod.price;

            return (
              <div key={pId} className="flex gap-4 p-4 bg-dark-900 border border-dark-850 rounded-2xl items-center">
                
                {/* Thumb */}
                <Link to={`/products/${pId}`} className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 border border-dark-800 bg-dark-950">
                  <img
                    src={prod.imageUrl || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500'}
                    alt={prod.name}
                    className="w-full h-full object-cover"
                  />
                </Link>

                {/* Info details */}
                <div className="flex-1 min-w-0 space-y-1">
                  <Link to={`/products/${pId}`}>
                    <h4 className="text-sm font-bold text-slate-200 hover:text-purple-400 transition-colors truncate">
                      {prod.name}
                    </h4>
                  </Link>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">{prod.category}</p>
                  
                  {/* Prices */}
                  <div className="flex items-center gap-1.5 pt-0.5">
                    <span className="text-sm font-extrabold text-slate-100">${itemPrice.toFixed(2)}</span>
                    {hasDiscount && (
                      <span className="text-xs text-slate-500 line-through">${prod.price.toFixed(2)}</span>
                    )}
                  </div>
                </div>

                {/* Quantity Adjustment Controls */}
                <div className="flex items-center bg-dark-950 border border-dark-800 rounded-lg">
                  <button
                    onClick={() => updateQuantity(pId, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="px-2 py-1 text-slate-400 hover:bg-dark-800 disabled:opacity-30 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-2.5 text-xs font-extrabold text-slate-200">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(pId, item.quantity + 1)}
                    disabled={item.quantity >= prod.stock}
                    className="px-2 py-1 text-slate-400 hover:bg-dark-800 disabled:opacity-30 cursor-pointer"
                  >
                    +
                  </button>
                </div>

                {/* Remove Trash */}
                <button
                  onClick={() => removeFromCart(pId)}
                  className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/25 rounded-xl transition-all duration-300 cursor-pointer"
                  title="Remove from Cart"
                >
                  <Trash2 size={16} />
                </button>

              </div>
            );
          })}
        </div>

        {/* Pricing Summary and Address details panel */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Summary pricing */}
          <div className="glassmorphism p-6 rounded-3xl border border-dark-800 space-y-4">
            <h3 className="text-base font-bold text-slate-200 pb-3 border-b border-dark-800">Order Summary</h3>
            
            <div className="space-y-2 text-xs font-semibold text-slate-400">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="text-slate-200">${cartSubtotal.toFixed(2)}</span>
              </div>
              {cartDiscountSavings > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>Discount Savings:</span>
                  <span>-${cartDiscountSavings.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping Fee:</span>
                <span>FREE</span>
              </div>
            </div>

            <div className="border-t border-dark-800 pt-3 flex justify-between items-center text-slate-200">
              <span className="text-sm font-bold">Total Amount:</span>
              <span className="text-2xl font-extrabold text-gradient-purple-amber">${cartTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Checkout Shipping form */}
          <div className="glassmorphism p-6 rounded-3xl border border-dark-800 space-y-4">
            <h3 className="text-base font-bold text-slate-200 flex items-center gap-1.5 pb-2 border-b border-dark-800">
              <CreditCard size={18} className="text-purple-400" />
              <span>Checkout Address</span>
            </h3>

            <form onSubmit={handleCheckoutSubmit} className="space-y-4">
              
              {/* Warnings and alerts */}
              {(validationError || orderError) && (
                <div className="bg-red-500/10 border border-red-500/35 rounded-xl p-3 flex items-center gap-2 text-xs text-red-400">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{validationError || orderError}</span>
                </div>
              )}

              {!user && (
                <div className="bg-purple-950/20 border border-purple-500/20 text-purple-300 rounded-xl p-3 text-xs text-center">
                  You are checking out as guest. You will be prompted to Sign In to complete checkout.
                </div>
              )}

              {/* Street Address */}
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-450 mb-1.5">
                  Street Address
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 123 Main St"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full bg-dark-900 border border-dark-800 focus:border-purple-500 rounded-xl py-2 px-3 text-xs text-slate-200 outline-none"
                />
              </div>

              {/* City and State grid */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-450 mb-1.5">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="New York"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-dark-900 border border-dark-800 focus:border-purple-500 rounded-xl py-2 px-3 text-xs text-slate-200 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-450 mb-1.5">
                    State
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="NY"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full bg-dark-900 border border-dark-800 focus:border-purple-500 rounded-xl py-2 px-3 text-xs text-slate-200 outline-none"
                  />
                </div>
              </div>

              {/* Zip code and Country */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-450 mb-1.5">
                    Zip Code
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="10001"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    className="w-full bg-dark-900 border border-dark-800 focus:border-purple-500 rounded-xl py-2 px-3 text-xs text-slate-200 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-450 mb-1.5">
                    Country
                  </label>
                  <input
                    type="text"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-dark-900 border border-dark-800 focus:border-purple-500 rounded-xl py-2 px-3 text-xs text-slate-200 outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={checkoutLoading}
                className="w-full btn-primary flex items-center justify-center gap-2 cursor-pointer py-3 text-sm font-bold"
              >
                {checkoutLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Processing Payment...</span>
                  </>
                ) : (
                  <>
                    <span>Place Virtual Order</span>
                    <ChevronRight size={16} />
                  </>
                )}
              </button>

            </form>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Cart;
