import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-bold text-center mb-2">Welcome back</h1>
        <p className="text-gray-400 text-center text-sm mb-8">Sign in to your campus account</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" placeholder="Your .edu email" value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required
            className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          <input type="password" placeholder="Password" value={form.password}
            onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required
            className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-400 mt-6">
          No account? <Link to="/register" className="text-indigo-600 font-medium">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
