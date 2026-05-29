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
      navigate('/browse');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = { backgroundColor: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <Link to="/" className="text-base font-bold" style={{ color: '#14B8A6' }}>doormly</Link>
          <h1 className="text-2xl font-bold mt-6 mb-1" style={{ color: 'var(--text)' }}>Welcome back</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>Sign in to your account</p>
        </div>

        <div className="rounded-xl border p-6 bg-white" style={{ borderColor: 'var(--border)', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text2)' }}>Email</label>
              <input type="email" placeholder="you@school.edu" value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required
                className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400/40"
                style={inputStyle} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text2)' }}>Password</label>
              <input type="password" placeholder="Your password" value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required
                className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400/40"
                style={inputStyle} />
            </div>
            {error && (
              <p className="text-sm px-3 py-2 rounded-lg" style={{ color: '#DC2626', backgroundColor: '#FEF2F2' }}>
                {error}
              </p>
            )}
            <button type="submit" disabled={loading}
              className="w-full text-white py-2 rounded-lg text-sm font-semibold disabled:opacity-50 hover:opacity-85 transition-opacity"
              style={{ backgroundColor: '#14B8A6' }}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm mt-5" style={{ color: 'var(--muted)' }}>
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold hover:underline" style={{ color: '#14B8A6' }}>Sign up</Link>
        </p>
      </div>
    </div>
  );
}
