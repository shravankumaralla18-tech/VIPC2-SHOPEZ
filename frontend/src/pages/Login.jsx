import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';

const Login = () => {
  const { login, user, error, loading } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (user) {
      navigate(redirectPath, { replace: true });
    }
  }, [user, navigate, redirectPath]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (!email || !password) {
      setValidationError('Please fill in all fields.');
      return;
    }

    try {
      await login(email, password);
    } catch (err) {
      // Error is managed by AuthContext.
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-md w-full bg-white border border-slate-200 p-8 rounded-lg shadow-sm">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-slate-950 tracking-tight">Welcome Back</h2>
          <p className="mt-2 text-sm text-slate-600">
            Sign in to manage your cart, orders, and account details.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {(error || validationError) && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2.5 text-sm text-red-700">
              <AlertCircle size={18} className="shrink-0" />
              <span>{validationError || error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 mb-2">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
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
                placeholder="Password"
                className="w-full bg-slate-50 border border-slate-300 focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100 rounded-lg py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition-all duration-200"
              />
              <Lock className="absolute left-3 top-3.5 text-slate-500" size={16} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Signing In...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-cyan-700 hover:text-cyan-800 font-semibold transition-colors duration-200">
            Create one
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
