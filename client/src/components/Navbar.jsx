import { Link, useNavigate } from 'react-router-dom';
import { Sun, Moon, ShoppingBag } from 'lucide-react';
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
        backgroundColor: dark ? '#0F0F0F' : '#ffffff',
        borderColor: dark ? '#1F1F1F' : '#E5E7EB',
      }}>
      <div className="flex items-center gap-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ backgroundColor: '#16A34A' }}>
            <ShoppingBag size={13} className="text-white" />
          </div>
          <span className="text-base font-bold tracking-tight" style={{ color: dark ? '#F5F5F5' : '#111111' }}>
            doormly
          </span>
        </Link>

        {user && (
          <div className="hidden sm:flex items-center gap-6">
            <Link to="/browse" className="text-sm font-medium transition-colors"
              style={{ color: dark ? '#A3A3A3' : '#4B5563' }}>
              Browse
            </Link>
            <Link to="/messages" className="text-sm font-medium transition-colors"
              style={{ color: dark ? '#A3A3A3' : '#4B5563' }}>
              Messages
            </Link>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button onClick={toggle}
          className="w-8 h-8 flex items-center justify-center rounded-md transition-colors"
          style={{ color: dark ? '#A3A3A3' : '#6B7280' }}
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
            <Link to="/profile" className="text-sm font-medium transition-colors"
              style={{ color: dark ? '#D4D4D4' : '#374151' }}>
              {user.username}
            </Link>
            <button onClick={handleLogout} className="text-sm transition-colors"
              style={{ color: dark ? '#737373' : '#9CA3AF' }}>
              Sign out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-sm font-medium transition-colors"
              style={{ color: dark ? '#A3A3A3' : '#4B5563' }}>
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
