import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import { User, Lock, Mail, ClipboardList, CheckCircle2, AlertCircle, ShoppingBag, Eye } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile } = useContext(AuthContext);

  // Profile forms
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Alerts
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Orders lists
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [activeOrderDetails, setActiveOrderDetails] = useState(null);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        const { data } = await API.get('/orders/myorders');
        setOrders(data);
      } catch (err) {
        console.error('Failed to load user orders:', err.message);
      } finally {
        setOrdersLoading(false);
      }
    };
    fetchMyOrders();
  }, []);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const updateData = { name, email };
      if (password) updateData.password = password;

      await updateProfile(updateData);
      setSuccess(true);
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.message || 'Profile update failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <div>
        <h1 className="text-3xl font-extrabold text-slate-100">My Dashboard</h1>
        <p className="text-sm text-slate-450 mt-1">Manage profile credentials and review order status records</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column: Update Profile */}
        <div className="lg:col-span-1">
          <div className="glassmorphism p-6 rounded-3xl border border-dark-800 space-y-5">
            <h3 className="text-lg font-bold text-slate-200 border-b border-dark-800 pb-2">Profile details</h3>
            
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              
              {/* Form alerts */}
              {success && (
                <div className="bg-green-500/10 border border-green-500/25 rounded-xl p-3 flex items-center gap-2 text-xs text-green-400">
                  <CheckCircle2 size={16} className="shrink-0" />
                  <span>Profile updated successfully!</span>
                </div>
              )}
              {error && (
                <div className="bg-red-500/10 border border-red-500/25 rounded-xl p-3 flex items-center gap-2 text-xs text-red-400">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-xs uppercase font-extrabold tracking-wider text-slate-450 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-dark-900 border border-dark-800 focus:border-purple-500 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-200 outline-none"
                  />
                  <User className="absolute left-3 top-2.5 text-slate-500" size={14} />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs uppercase font-extrabold tracking-wider text-slate-450 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-dark-900 border border-dark-800 focus:border-purple-500 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-200 outline-none"
                  />
                  <Mail className="absolute left-3 top-2.5 text-slate-500" size={14} />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs uppercase font-extrabold tracking-wider text-slate-450 mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="Leave blank to keep same"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-dark-900 border border-dark-800 focus:border-purple-500 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-200 outline-none"
                  />
                  <Lock className="absolute left-3 top-2.5 text-slate-500" size={14} />
                </div>
              </div>

              {/* Confirm password */}
              <div>
                <label className="block text-xs uppercase font-extrabold tracking-wider text-slate-450 mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="Leave blank to keep same"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-dark-900 border border-dark-800 focus:border-purple-500 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-200 outline-none"
                  />
                  <Lock className="absolute left-3 top-2.5 text-slate-500" size={14} />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-2.5 text-xs font-bold cursor-pointer"
              >
                {loading ? 'Saving updates...' : 'Update Profile'}
              </button>

            </form>
          </div>
        </div>

        {/* Right Column: Order history */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="flex items-center gap-2 text-slate-200 border-b border-dark-800 pb-2">
            <ClipboardList size={20} className="text-purple-400" />
            <h3 className="text-lg font-bold">Purchase History</h3>
          </div>

          {ordersLoading ? (
            <div className="space-y-4 animate-pulse">
              {[1, 2].map((i) => (
                <div key={i} className="h-20 bg-dark-900 border border-dark-850 rounded-2xl w-full"></div>
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="glassmorphism rounded-2xl p-8 text-center border border-dark-850">
              <div className="inline-flex p-3 bg-dark-900 rounded-full text-slate-500 mb-3">
                <ShoppingBag size={24} />
              </div>
              <p className="text-sm text-slate-500">You haven't placed any virtual orders yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const date = new Date(order.createdAt).toLocaleDateString();
                const statusColors = {
                  pending: 'text-amber-450 bg-amber-950/20 border-amber-500/20',
                  processing: 'text-blue-400 bg-blue-950/20 border-blue-500/20',
                  shipped: 'text-indigo-400 bg-indigo-950/20 border-indigo-500/20',
                  delivered: 'text-green-450 bg-green-950/20 border-green-500/20'
                };

                return (
                  <div key={order._id} className="bg-dark-900 border border-dark-850 p-5 rounded-2xl space-y-4 shadow-sm">
                    
                    {/* Header */}
                    <div className="flex flex-wrap justify-between items-center gap-3 pb-3 border-b border-dark-800/80">
                      <div className="space-y-0.5">
                        <span className="text-xs text-slate-500 block">Order Reference</span>
                        <span className="text-xs font-extrabold text-slate-200">{order._id}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] uppercase font-extrabold px-2.5 py-1 rounded-md border ${statusColors[order.orderStatus] || 'text-slate-400'}`}>
                          {order.orderStatus}
                        </span>
                        
                        <button
                          onClick={() => setActiveOrderDetails(activeOrderDetails === order._id ? null : order._id)}
                          className="p-1.8 rounded-lg bg-dark-800 text-slate-400 hover:text-white cursor-pointer"
                          title="Toggle Purchased Items"
                        >
                          <Eye size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Meta stats */}
                    <div className="grid grid-cols-3 gap-4 text-xs font-semibold text-slate-450">
                      <div>
                        <span>Placed Date:</span>
                        <p className="text-slate-200 font-bold mt-0.5">{date}</p>
                      </div>
                      <div>
                        <span>Total Paid:</span>
                        <p className="text-slate-200 font-bold mt-0.5">${order.totalAmount.toFixed(2)}</p>
                      </div>
                      <div>
                        <span>Payment Status:</span>
                        <p className="text-green-400 font-bold mt-0.5 capitalize">{order.paymentStatus}</p>
                      </div>
                    </div>

                    {/* Toggleable purchased items list */}
                    {activeOrderDetails === order._id && (
                      <div className="border-t border-dark-800/80 pt-4 space-y-2.5">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 block">Purchased Items</span>
                        <div className="flex flex-col gap-2">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center text-xs">
                              <span className="text-slate-300 font-medium truncate max-w-[250px]">{item.name}</span>
                              <span className="text-slate-450">
                                {item.quantity} x <span className="text-slate-200 font-bold">${(item.price * (1 - (item.discount || 0)/100)).toFixed(2)}</span>
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Delivery status */}
                        {order.deliveredAt && (
                          <p className="text-[10px] text-green-400/90 font-semibold pt-1">
                            Delivered at: {new Date(order.deliveredAt).toLocaleString()}
                          </p>
                        )}
                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default Profile;
