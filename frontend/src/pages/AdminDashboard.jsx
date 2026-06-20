import { useState, useEffect } from 'react';
import API from '../services/api';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import { 
  DollarSign, ShoppingBag, Users, Layers, TrendingUp, 
  Plus, Edit2, Trash2, Check, X, Loader2, AlertCircle, Eye
} from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview'); // overview, products, orders, users
  
  // Dashboard statistics
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  
  // Products management states
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showProductForm, setShowProductForm] = useState(false);
  
  // Product form fields
  const [pName, setPName] = useState('');
  const [pPrice, setPPrice] = useState('');
  const [pDiscount, setPDiscount] = useState('0');
  const [pCategory, setPCategory] = useState('Electronics');
  const [pStock, setPStock] = useState('');
  const [pDescription, setPDescription] = useState('');
  const [pImageUrl, setPImageUrl] = useState('');
  const [formError, setFormError] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  // Orders management states
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Users management states
  const [usersList, setUsersList] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);

  // Load Overview statistics
  const fetchDashboardStats = async () => {
    try {
      setStatsLoading(true);
      const { data } = await API.get('/admin/dashboard');
      setStats(data);
    } catch (err) {
      console.error('Failed to load dashboard metrics:', err.message);
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  // Fetch tab items conditionally
  useEffect(() => {
    if (activeTab === 'products') {
      fetchProductsList();
    } else if (activeTab === 'orders') {
      fetchOrdersList();
    } else if (activeTab === 'users') {
      fetchUsersList();
    }
  }, [activeTab]);

  // Product actions
  const fetchProductsList = async () => {
    try {
      setProductsLoading(true);
      const { data } = await API.get('/products');
      setProducts(data);
    } catch (err) {
      console.error(err.message);
    } finally {
      setProductsLoading(false);
    }
  };

  const handleOpenAddForm = () => {
    setEditingProduct(null);
    setPName('');
    setPPrice('');
    setPDiscount('0');
    setPCategory('Electronics');
    setPStock('');
    setPDescription('');
    setPImageUrl('');
    setFormError(null);
    setShowProductForm(true);
  };

  const handleOpenEditForm = (prod) => {
    setEditingProduct(prod);
    setPName(prod.name);
    setPPrice(prod.price);
    setPDiscount(prod.discount);
    setPCategory(prod.category);
    setPStock(prod.stock);
    setPDescription(prod.description);
    setPImageUrl(prod.imageUrl);
    setFormError(null);
    setShowProductForm(true);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!pName || !pPrice || !pCategory || pStock === '') {
      setFormError('Please fill in required fields.');
      return;
    }

    setFormLoading(true);
    const productPayload = {
      name: pName,
      price: Number(pPrice),
      discount: Number(pDiscount),
      category: pCategory,
      stock: Number(pStock),
      description: pDescription,
      imageUrl: pImageUrl
    };

    try {
      if (editingProduct) {
        // Edit update
        await API.put(`/products/${editingProduct._id}`, productPayload);
      } else {
        // Add create
        await API.post('/products', productPayload);
      }
      setShowProductForm(false);
      fetchProductsList();
      fetchDashboardStats(); // update totals
    } catch (err) {
      setFormError(err.response?.data?.message || 'Action failed.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await API.delete(`/products/${id}`);
      fetchProductsList();
      fetchDashboardStats();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed.');
    }
  };

  // Orders Actions
  const fetchOrdersList = async () => {
    try {
      setOrdersLoading(true);
      const { data } = await API.get('/admin/orders');
      setOrders(data);
    } catch (err) {
      console.error(err.message);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const { data } = await API.put(`/admin/orders/${orderId}/status`, { orderStatus: newStatus });
      // Update local state list
      setOrders(prev => prev.map(x => x._id === orderId ? data : x));
      fetchDashboardStats(); // refresh total sales if order status triggered payment confirmation details
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update order status');
    }
  };

  // Users Actions
  const fetchUsersList = async () => {
    try {
      setUsersLoading(true);
      const { data } = await API.get('/admin/users');
      setUsersList(data);
    } catch (err) {
      console.error(err.message);
    } finally {
      setUsersLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-100">Administrator Console</h1>
        <p className="text-sm text-slate-450 mt-1">Review business analytics, maintain inventory, and manage client orders</p>
      </div>

      {/* Tabs list menu */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-dark-800 font-semibold text-xs">
        {[
          { id: 'overview', label: 'Dashboard Overview', icon: TrendingUp },
          { id: 'products', label: 'Inventory Manager', icon: Layers },
          { id: 'orders', label: 'Orders Hub', icon: ShoppingBag },
          { id: 'users', label: 'Registered Users', icon: Users }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setShowProductForm(false);
              }}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl border transition-all duration-300 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-purple-600/10 text-purple-400 border-purple-500/30'
                  : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-dark-800'
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active tabs sections */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {statsLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-28 bg-dark-900 border border-dark-850 rounded-2xl"></div>
              ))}
            </div>
          ) : !stats ? (
            <div className="text-center py-10 text-xs text-slate-500">Failed to load statistics.</div>
          ) : (
            <>
              {/* Stats Metrics Boxes */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Revenue */}
                <div className="glassmorphism p-6 rounded-2xl border border-dark-800 flex justify-between items-center relative glow-card">
                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Total Sales</span>
                    <p className="text-2xl font-extrabold text-gradient-purple-amber">${stats.totalSales.toFixed(2)}</p>
                  </div>
                  <div className="p-3 bg-purple-500/10 rounded-xl text-purple-450 border border-purple-500/20">
                    <DollarSign size={20} />
                  </div>
                </div>

                {/* Orders */}
                <div className="glassmorphism p-6 rounded-2xl border border-dark-800 flex justify-between items-center relative glow-card">
                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Orders Placed</span>
                    <p className="text-2xl font-extrabold text-slate-200">{stats.totalOrders}</p>
                  </div>
                  <div className="p-3 bg-blue-500/10 rounded-xl text-blue-450 border border-blue-500/20">
                    <ShoppingBag size={20} />
                  </div>
                </div>

                {/* Products count */}
                <div className="glassmorphism p-6 rounded-2xl border border-dark-800 flex justify-between items-center relative glow-card">
                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Active Items</span>
                    <p className="text-2xl font-extrabold text-slate-200">{stats.totalProducts}</p>
                  </div>
                  <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-450 border border-emerald-500/20">
                    <Layers size={20} />
                  </div>
                </div>

                {/* Users count */}
                <div className="glassmorphism p-6 rounded-2xl border border-dark-800 flex justify-between items-center relative glow-card">
                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Total Customers</span>
                    <p className="text-2xl font-extrabold text-slate-200">{stats.totalUsers}</p>
                  </div>
                  <div className="p-3 bg-pink-500/10 rounded-xl text-pink-450 border border-pink-500/20">
                    <Users size={20} />
                  </div>
                </div>

              </div>

              {/* Charts grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Sales Chart Area */}
                <div className="lg:col-span-2 glassmorphism p-6 rounded-3xl border border-dark-800 space-y-4">
                  <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Weekly Revenue Analytics</h3>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={stats.salesChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#9333ea" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#9333ea" stopOpacity={0.0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="date" stroke="#646492" fontSize={10} tickLine={false} />
                        <YAxis stroke="#646492" fontSize={10} tickLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: '#11111f', borderColor: '#343451', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                        <Area type="monotone" dataKey="sales" stroke="#a855f7" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Category Product Distribution Chart */}
                <div className="lg:col-span-1 glassmorphism p-6 rounded-3xl border border-dark-800 space-y-4 flex flex-col justify-between">
                  <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Category Spread</h3>
                  <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={stats.categoryDistribution} layout="vertical">
                        <XAxis type="number" stroke="#646492" fontSize={8} hide />
                        <YAxis dataKey="name" type="category" stroke="#9333ea" fontSize={9} width={80} tickLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: '#11111f', borderColor: '#343451', color: '#fff', fontSize: '10px' }} />
                        <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={12}>
                          {stats.categoryDistribution.map((entry, index) => {
                            const colors = ['#9333ea', '#ec4899', '#10b981', '#f59e0b'];
                            return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                          })}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-[10px] text-slate-500 text-center leading-relaxed">
                    Visualizes total product listings mapped per e-commerce category.
                  </p>
                </div>

              </div>
            </>
          )}
        </div>
      )}

      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-200">Catalog Inventory</h3>
            {!showProductForm && (
              <button onClick={handleOpenAddForm} className="btn-primary !px-4 !py-2 text-xs flex items-center gap-1 cursor-pointer">
                <Plus size={14} />
                <span>Add Product</span>
              </button>
            )}
          </div>

          {/* Form to Create/Edit */}
          {showProductForm && (
            <div className="glassmorphism p-6 rounded-3xl border border-purple-500/20 space-y-4">
              <div className="flex justify-between items-center border-b border-dark-800 pb-2">
                <h4 className="font-bold text-sm text-slate-200">
                  {editingProduct ? `Edit Details: ${editingProduct.name}` : 'Create New Product'}
                </h4>
                <button onClick={() => setShowProductForm(false)} className="text-slate-400 hover:text-white cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleProductSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {formError && (
                  <div className="col-span-full bg-red-500/10 border border-red-500/35 rounded-xl p-3 flex items-center gap-2 text-xs text-red-400">
                    <AlertCircle size={16} />
                    <span>{formError}</span>
                  </div>
                )}

                {/* Name */}
                <div className="md:col-span-2 space-y-1">
                  <label className="text-[10px] font-extrabold uppercase text-slate-450">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={pName}
                    onChange={(e) => setPName(e.target.value)}
                    className="w-full bg-dark-900 border border-dark-800 focus:border-purple-500 rounded-xl py-2 px-3 text-xs text-slate-200 outline-none"
                  />
                </div>

                {/* Category */}
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase text-slate-450">Category *</label>
                  <select
                    value={pCategory}
                    onChange={(e) => setPCategory(e.target.value)}
                    className="w-full bg-dark-900 border border-dark-800 focus:border-purple-500 rounded-xl py-2 px-3 text-xs text-slate-200 outline-none cursor-pointer"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Sports & Outdoors">Sports & Outdoors</option>
                    <option value="Home & Kitchen">Home & Kitchen</option>
                  </select>
                </div>

                {/* Price */}
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase text-slate-450">Base Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={pPrice}
                    onChange={(e) => setPPrice(e.target.value)}
                    className="w-full bg-dark-900 border border-dark-800 focus:border-purple-500 rounded-xl py-2 px-3 text-xs text-slate-200 outline-none"
                  />
                </div>

                {/* Discount */}
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase text-slate-450">Discount (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={pDiscount}
                    onChange={(e) => setPDiscount(e.target.value)}
                    className="w-full bg-dark-900 border border-dark-800 focus:border-purple-500 rounded-xl py-2 px-3 text-xs text-slate-200 outline-none"
                  />
                </div>

                {/* Stock */}
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase text-slate-450">Inventory Stock *</label>
                  <input
                    type="number"
                    required
                    value={pStock}
                    onChange={(e) => setPStock(e.target.value)}
                    className="w-full bg-dark-900 border border-dark-800 focus:border-purple-500 rounded-xl py-2 px-3 text-xs text-slate-200 outline-none"
                  />
                </div>

                {/* Image URL */}
                <div className="md:col-span-3 space-y-1">
                  <label className="text-[10px] font-extrabold uppercase text-slate-450">Image URL</label>
                  <input
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={pImageUrl}
                    onChange={(e) => setPImageUrl(e.target.value)}
                    className="w-full bg-dark-900 border border-dark-800 focus:border-purple-500 rounded-xl py-2 px-3 text-xs text-slate-200 outline-none"
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-3 space-y-1">
                  <label className="text-[10px] font-extrabold uppercase text-slate-450">Description</label>
                  <textarea
                    rows={3}
                    value={pDescription}
                    onChange={(e) => setPDescription(e.target.value)}
                    className="w-full bg-dark-900 border border-dark-800 focus:border-purple-500 rounded-xl p-3 text-xs text-slate-200 outline-none resize-none"
                  ></textarea>
                </div>

                <div className="col-span-full flex gap-3 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setShowProductForm(false)}
                    className="btn-secondary !px-4 !py-2 text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="btn-primary !px-4 !py-2 text-xs flex items-center gap-1 cursor-pointer"
                  >
                    {formLoading ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                    <span>Save Product</span>
                  </button>
                </div>

              </form>
            </div>
          )}

          {/* Products table list */}
          {productsLoading ? (
            <div className="space-y-2 animate-pulse">
              {[1, 2, 3].map(i => <div key={i} className="h-14 bg-dark-900 border border-dark-850 rounded-xl"></div>)}
            </div>
          ) : (
            <div className="overflow-x-auto glassmorphism rounded-2xl border border-dark-800">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-dark-800 text-slate-450 uppercase font-extrabold tracking-wider bg-dark-950/40">
                    <th className="p-4">Product details</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Discount</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-800/60 font-medium text-slate-300">
                  {products.map((p) => (
                    <tr key={p._id} className="hover:bg-dark-900/30">
                      <td className="p-4 flex items-center gap-3 min-w-[200px]">
                        <img src={p.imageUrl || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=100'} className="w-10 h-10 rounded-lg object-cover bg-dark-950" />
                        <span className="font-bold truncate max-w-[150px]">{p.name}</span>
                      </td>
                      <td className="p-4">{p.category}</td>
                      <td className="p-4">${p.price.toFixed(2)}</td>
                      <td className="p-4 text-purple-400">{p.discount}%</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded font-bold ${p.stock === 0 ? 'text-red-400 bg-red-950/20' : 'text-slate-300'}`}>
                          {p.stock}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleOpenEditForm(p)}
                            className="p-2 bg-dark-800 hover:bg-purple-950/40 border border-dark-700 hover:border-purple-500/35 hover:text-purple-450 rounded-xl transition-all cursor-pointer"
                            title="Edit"
                          >
                            <Edit2 size={12} />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p._id)}
                            className="p-2 bg-dark-800 hover:bg-red-950/40 border border-dark-700 hover:border-red-500/35 hover:text-red-450 rounded-xl transition-all cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-slate-200">Customer Orders Dashboard</h3>
          
          {ordersLoading ? (
            <div className="space-y-2 animate-pulse">
              {[1, 2].map(i => <div key={i} className="h-14 bg-dark-900 border border-dark-850 rounded-xl"></div>)}
            </div>
          ) : (
            <div className="overflow-x-auto glassmorphism rounded-2xl border border-dark-800">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-dark-800 text-slate-450 uppercase font-extrabold tracking-wider bg-dark-950/40">
                    <th className="p-4">Order reference</th>
                    <th className="p-4">Customer info</th>
                    <th className="p-4">Date placed</th>
                    <th className="p-4">Total Amount</th>
                    <th className="p-4">Payment</th>
                    <th className="p-4">Shipping Address</th>
                    <th className="p-4">Order status / Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-800/60 font-semibold text-slate-300">
                  {orders.map((order) => {
                    const dateStr = new Date(order.createdAt).toLocaleDateString();
                    const statusColors = {
                      pending: 'text-amber-450 border-amber-500/20 bg-amber-950/10',
                      processing: 'text-blue-400 border-blue-500/20 bg-blue-950/10',
                      shipped: 'text-indigo-400 border-indigo-500/20 bg-indigo-950/10',
                      delivered: 'text-green-450 border-green-500/20 bg-green-950/10'
                    };

                    return (
                      <tr key={order._id} className="hover:bg-dark-900/30">
                        <td className="p-4 font-mono font-bold text-slate-400 select-all">{order._id}</td>
                        <td className="p-4">
                          <span className="block text-slate-200 font-bold">{order.user?.name || 'Guest User'}</span>
                          <span className="block text-[10px] text-slate-500">{order.user?.email || 'N/A'}</span>
                        </td>
                        <td className="p-4">{dateStr}</td>
                        <td className="p-4 font-bold text-slate-200">${order.totalAmount.toFixed(2)}</td>
                        <td className="p-4 text-green-400 capitalize">{order.paymentStatus}</td>
                        <td className="p-4 truncate max-w-[150px]" title={`${order.shippingAddress?.street}, ${order.shippingAddress?.city}`}>
                          {order.shippingAddress?.street}, {order.shippingAddress?.city}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <select
                              value={order.orderStatus}
                              onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                              className={`bg-dark-900 border focus:outline-none rounded-lg p-1.5 text-[10px] font-bold uppercase transition-colors cursor-pointer ${statusColors[order.orderStatus] || 'border-dark-750 text-slate-300'}`}
                            >
                              <option value="pending">Pending</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                            </select>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'users' && (
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-slate-200">Registered Accounts</h3>

          {usersLoading ? (
            <div className="space-y-2 animate-pulse">
              {[1, 2].map(i => <div key={i} className="h-12 bg-dark-900 border border-dark-850 rounded-xl"></div>)}
            </div>
          ) : (
            <div className="overflow-x-auto glassmorphism rounded-2xl border border-dark-800">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-dark-800 text-slate-450 uppercase font-extrabold tracking-wider bg-dark-950/40">
                    <th className="p-4">User ID</th>
                    <th className="p-4">Full Name</th>
                    <th className="p-4">Email address</th>
                    <th className="p-4">Role role</th>
                    <th className="p-4 text-right">Created Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-800/60 font-semibold text-slate-300">
                  {usersList.map((usr) => (
                    <tr key={usr._id} className="hover:bg-dark-900/30">
                      <td className="p-4 font-mono text-slate-450">{usr._id}</td>
                      <td className="p-4 text-slate-200 font-bold">{usr.name}</td>
                      <td className="p-4 text-slate-350">{usr.email}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-extrabold tracking-wide ${
                          usr.role === 'admin' 
                            ? 'bg-purple-950/20 text-purple-400 border border-purple-550/20' 
                            : 'bg-dark-800 text-slate-400 border border-transparent'
                        }`}>
                          {usr.role}
                        </span>
                      </td>
                      <td className="p-4 text-right text-slate-500">
                        {new Date(usr.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
