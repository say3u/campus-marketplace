import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sun, Moon, Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import api from '../lib/api';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [bannerDismissed, setBannerDismissed] = useState(false);

  const { data: conversations = [] } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => api.get('/conversations').then(r => r.data),
    enabled: !!user,
    refetchInterval: 15000,
  });
  const totalUnread = conversations.reduce((sum, c) => sum + (c.unread_count || 0), 0);

  function handleLogout() {
    logout();
    navigate('/');
  }

  function handleSearch(e) {
    e.preventDefault();
    if (user) {
      navigate(`/browse${search ? `?search=${encodeURIComponent(search)}` : ''}`);
    } else {
      navigate('/login');
    }
  }

  return (
    <div className="sticky top-0 z-50">
    {user && !user.email_verified && !bannerDismissed && (
      <div className="flex items-center justify-center gap-3 text-xs py-2 px-4 font-medium"
        style={{ backgroundColor: '#DC2626', color: '#ffffff' }}>
        <span>
          Please verify your email to unlock all features.{' '}
          <button onClick={() => api.post('/auth/resend-verification', { email: user.email }).catch(() => {})}
            className="underline font-semibold">Resend email</button>
        </span>
        <button onClick={() => setBannerDismissed(true)}
          className="ml-2 text-base leading-none font-bold hover:opacity-60"
          style={{ color: '#ffffff' }}>✕</button>
      </div>
    )}
    <nav className="h-16 flex items-center px-6 border-b gap-4"
      style={{
        backgroundColor: dark ? '#0F0F0F' : 'var(--surface)',
        borderColor: dark ? '#1F1F1F' : 'var(--border)',
      }}>

      {/* Left */}
      <div className="flex items-center gap-6 flex-1">
        <Link to="/" className="text-xl font-black tracking-tight" style={{ color: 'var(--brand)' }}>
          doormly
        </Link>
        {user && (
          <div className="hidden sm:flex items-center gap-6">
            <Link to="/browse" className="text-sm font-medium transition-colors"
              style={{ color: dark ? '#A3A3A3' : '#4B5563' }}>Browse</Link>
            <Link to="/favorites" className="text-sm font-medium transition-colors"
              style={{ color: dark ? '#A3A3A3' : '#4B5563' }}>Saved</Link>
            <Link to="/messages" className="text-sm font-medium transition-colors relative"
              style={{ color: dark ? '#A3A3A3' : '#4B5563' }}>
              Messages
              {totalUnread > 0 && (
                <span className="absolute -top-1.5 -right-3 min-w-[16px] h-4 flex items-center justify-center rounded-full text-white px-1"
                  style={{ backgroundColor: '#f43f5e', fontSize: '10px', fontWeight: 700 }}>
                  {totalUnread > 9 ? '9+' : totalUnread}
                </span>
              )}
            </Link>
          </div>
        )}
      </div>

      {/* Center search */}
      <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-auto">
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: 'var(--muted)' }} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search listings..."
            className="w-full rounded-lg pl-9 pr-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-teal-400/40"
            style={{ backgroundColor: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)' }}
          />
        </div>
      </form>

      {/* Right */}
      <div className="flex items-center gap-3 flex-1 justify-end">
        <button onClick={toggle}
          className="w-8 h-8 flex items-center justify-center rounded-md transition-colors"
          style={{ color: dark ? '#A3A3A3' : '#6B7280' }}
          title={dark ? 'Switch to light mode' : 'Switch to dark mode'}>
          {dark ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        <Link to={user ? '/listings/new' : '/register'}
          className="text-sm font-bold text-white px-5 py-2 rounded-lg transition-opacity hover:opacity-85"
          style={{ backgroundColor: 'var(--brand)', boxShadow: '0 2px 8px rgba(20,184,166,0.35)' }}>
          + Sell Now
        </Link>

        {user ? (
          <>
            <Link to="/profile" className="text-sm font-medium transition-colors"
              style={{ color: dark ? '#D4D4D4' : '#374151' }}>{user.username}</Link>
            <button onClick={handleLogout} className="text-sm transition-colors"
              style={{ color: dark ? '#737373' : '#9CA3AF' }}>Sign out</button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-sm font-medium transition-colors"
              style={{ color: dark ? '#A3A3A3' : '#4B5563' }}>Log in</Link>
            <Link to="/register" className="text-sm font-medium transition-colors"
              style={{ color: dark ? '#A3A3A3' : '#4B5563' }}>Sign up</Link>
          </>
        )}
      </div>
    </nav>
    </div>
  );
}
