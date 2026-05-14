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

  const inputClass = "w-full border-2 border-gray-100 rounded-xl px-4 py-3 focus:outline-none font-medium";

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 bg-gray-50">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-black" style={{ color: '#CC0033' }}>Dormly</Link>
          <h1 className="text-2xl font-black text-gray-900 mt-3">Create your account</h1>
          <p className="text-gray-400 mt-1 text-sm">Requires a .edu email address</p>
        </div>

        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">School Email</label>
              <input type="email" placeholder="you@school.edu" value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required
                className={inputClass}
                onFocus={e => e.target.style.borderColor = '#CC0033'}
                onBlur={e => e.target.style.borderColor = '#f3f4f6'} />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Username</label>
              <input type="text" placeholder="username" value={form.username}
                onChange={e => setForm(f => ({ ...f, username: e.target.value }))} required
                className={inputClass}
                onFocus={e => e.target.style.borderColor = '#CC0033'}
                onBlur={e => e.target.style.borderColor = '#f3f4f6'} />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Password</label>
              <input type="password" placeholder="Min 8 characters" value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required minLength={8}
                className={inputClass}
                onFocus={e => e.target.style.borderColor = '#CC0033'}
                onBlur={e => e.target.style.borderColor = '#f3f4f6'} />
            </div>
            {error && (
              <div className="text-sm rounded-xl px-4 py-3 font-medium bg-red-50 border border-red-100" style={{ color: '#CC0033' }}>
                {error}
              </div>
            )}
            <button type="submit" disabled={loading}
              className="w-full text-white py-3.5 rounded-xl font-black text-base disabled:opacity-50 transition-opacity shadow-md mt-2"
              style={{ backgroundColor: '#CC0033' }}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-400 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="font-black" style={{ color: '#CC0033' }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
