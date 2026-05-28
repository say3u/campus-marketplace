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

  const inputStyle = {
    backgroundColor: '#0f1117',
    border: '1px solid #2a2d3e',
    color: '#f1f5f9',
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4" style={{ backgroundColor: '#0f1117' }}>
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <Link to="/" className="text-base font-bold" style={{ color: '#CC0033' }}>Dormly</Link>
          <h1 className="text-2xl font-bold text-white mt-6 mb-1">Create an account</h1>
          <p className="text-sm" style={{ color: '#64748b' }}>Requires a .edu email address</p>
        </div>

        <div className="rounded-xl border p-6" style={{ backgroundColor: '#16181f', borderColor: '#2a2d3e' }}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#94a3b8' }}>School email</label>
              <input type="email" placeholder="you@school.edu" value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required
                className="w-full rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-900"
                style={inputStyle} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#94a3b8' }}>Username</label>
              <input type="text" placeholder="username" value={form.username}
                onChange={e => setForm(f => ({ ...f, username: e.target.value }))} required
                className="w-full rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-900"
                style={inputStyle} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#94a3b8' }}>Password</label>
              <input type="password" placeholder="Min 8 characters" value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required minLength={8}
                className="w-full rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-900"
                style={inputStyle} />
            </div>
            {error && (
              <p className="text-sm px-3 py-2 rounded-md" style={{ color: '#fca5a5', backgroundColor: 'rgba(204,0,51,0.1)' }}>
                {error}
              </p>
            )}
            <button type="submit" disabled={loading}
              className="w-full text-white py-2 rounded-md text-sm font-semibold disabled:opacity-50 hover:opacity-80 transition-opacity"
              style={{ backgroundColor: '#CC0033' }}>
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm mt-5" style={{ color: '#475569' }}>
          Already have an account?{' '}
          <Link to="/login" className="font-semibold hover:underline" style={{ color: '#CC0033' }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
