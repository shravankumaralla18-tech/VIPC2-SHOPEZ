import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock, User, Shield, AlertCircle, Loader2 } from 'lucide-react';

const Register = () => {
  const { register, user, error, loading } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [validationError, setValidationError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (!name || !email || !password) {
      setValidationError('Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters.');
      return;
    }

    try {
      await register(name, email, password, role);
    } catch (err) {
      // Error is managed by AuthContext.
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-md w-full bg-white border border-slate-200 p-8 rounded-lg shadow-sm">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-slate-950 tracking-tight">Create Account</h2>
          <p className="mt-2 text-sm text-slate-600">
            Set up your ShopEZ account to save carts and track orders.
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {(error || validationError) && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2.5 text-sm text-red-700">
              <AlertCircle size={18} className="shrink-0" />
              <span>{validationError || error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 mb-2">Full Name</label>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full bg-slate-50 border border-slate-300 focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100 rounded-lg py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition-all duration-200"
              />
              <User className="absolute left-3 top-3.5 text-slate-500" size={16} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 mb-2">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className="w-full bg-slate-50 border border-slate-300 focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100 rounded-lg py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition-all duration-200"
              />
              <Mail className="absolute left-3 top-3.5 text-slate-500" size={16} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 mb-2">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full bg-slate-50 border border-slate-300 focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100 rounded-lg py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition-all duration-200"
              />
              <Lock className="absolute left-3 top-3.5 text-slate-500" size={16} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 mb-2">Account Type</label>
            <div className="relative">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100 rounded-lg py-3 pl-10 pr-4 text-sm text-slate-900 outline-none appearance-none transition-all duration-200 cursor-pointer"
              >
                <option value="user">Customer</option>
                <option value="admin">Administrator</option>
              </select>
              <Shield className="absolute left-3 top-3.5 text-slate-500" size={16} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <span>Create Account</span>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="text-cyan-700 hover:text-cyan-800 font-semibold transition-colors duration-200">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
