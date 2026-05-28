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
      navigate('/browse');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 bg-gray-50">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <Link to="/" className="text-base font-bold" style={{ color: '#CC0033' }}>Dormly</Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-6 mb-1">Create an account</h1>
          <p className="text-sm text-gray-500">Requires a .edu email address</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">School email</label>
              <input type="email" placeholder="you@school.edu" value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Username</label>
              <input type="text" placeholder="username" value={form.username}
                onChange={e => setForm(f => ({ ...f, username: e.target.value }))} required
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <input type="password" placeholder="Min 8 characters" value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required minLength={8}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-transparent" />
            </div>
            {error && (
              <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">{error}</p>
            )}
            <button type="submit" disabled={loading}
              className="w-full text-white py-2 rounded-md text-sm font-semibold disabled:opacity-50 transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#CC0033' }}>
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-5">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold hover:underline" style={{ color: '#CC0033' }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
