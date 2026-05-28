import { Link, useNavigate } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <nav className="sticky top-0 z-50 h-14 flex items-center justify-between px-6 border-b"
      style={{
        backgroundColor: dark ? '#111827' : '#ffffff',
        borderColor: dark ? '#1F2937' : '#E5E7EB',
      }}>
      <div className="flex items-center gap-8">
        <Link to="/" className="text-lg font-bold tracking-tight" style={{ color: '#16A34A' }}>
          doormly
        </Link>
        {user && (
          <div className="hidden sm:flex items-center gap-6">
            <Link to="/browse"
              className="text-sm font-medium transition-colors"
              style={{ color: dark ? '#9CA3AF' : '#4B5563' }}>
              Browse
            </Link>
            <Link to="/messages"
              className="text-sm font-medium transition-colors"
              style={{ color: dark ? '#9CA3AF' : '#4B5563' }}>
              Messages
            </Link>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Theme toggle */}
        <button onClick={toggle}
          className="w-8 h-8 flex items-center justify-center rounded-md transition-colors"
          style={{ color: dark ? '#9CA3AF' : '#6B7280' }}
          title={dark ? 'Switch to light mode' : 'Switch to dark mode'}>
          {dark ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        {user ? (
          <>
            <Link to="/listings/new"
              className="text-sm font-semibold text-white px-4 py-1.5 rounded-md transition-opacity hover:opacity-80"
              style={{ backgroundColor: '#16A34A' }}>
              + Sell
            </Link>
            <Link to="/profile"
              className="text-sm font-medium transition-colors"
              style={{ color: dark ? '#D1D5DB' : '#374151' }}>
              {user.username}
            </Link>
            <button onClick={handleLogout}
              className="text-sm transition-colors"
              style={{ color: dark ? '#6B7280' : '#9CA3AF' }}>
              Sign out
            </button>
          </>
        ) : (
          <>
            <Link to="/login"
              className="text-sm font-medium transition-colors"
              style={{ color: dark ? '#9CA3AF' : '#4B5563' }}>
              Log in
            </Link>
            <Link to="/register"
              className="text-sm font-semibold text-white px-4 py-1.5 rounded-md transition-opacity hover:opacity-80"
              style={{ backgroundColor: '#16A34A' }}>
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
