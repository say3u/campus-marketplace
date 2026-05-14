import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form.email, form.username, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-bold text-center mb-2">Join CampusMarket</h1>
        <p className="text-gray-400 text-center text-sm mb-8">Requires a .edu email address</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" placeholder="student@yourschool.edu" value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required
            className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          <input type="text" placeholder="Username" value={form.username}
            onChange={e => setForm(f => ({ ...f, username: e.target.value }))} required
            className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          <input type="password" placeholder="Password (min 8 chars)" value={form.password}
            onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required minLength={8}
            className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50">
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-400 mt-6">
          Already have an account? <Link to="/login" className="text-indigo-600 font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
