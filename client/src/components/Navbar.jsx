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
      style={{ backgroundColor: '#0F172A', borderColor: '#1e293b' }}>
      <div className="flex items-center gap-8">
        <Link to="/" className="text-lg font-bold tracking-tight text-white">
          Doormly
        </Link>
        {user && (
          <div className="hidden sm:flex items-center gap-6">
            <Link to="/browse" className="text-sm text-slate-400 hover:text-white transition-colors">Browse</Link>
            <Link to="/messages" className="text-sm text-slate-400 hover:text-white transition-colors">Messages</Link>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Theme toggle */}
        <button onClick={toggle}
          className="w-8 h-8 flex items-center justify-center rounded-md transition-colors hover:bg-white/10"
          title={dark ? 'Switch to light mode' : 'Switch to dark mode'}>
          {dark
            ? <Sun size={15} className="text-slate-400" />
            : <Moon size={15} className="text-slate-400" />
          }
        </button>

        {user ? (
          <>
            <Link to="/listings/new"
              className="text-sm font-semibold text-white px-4 py-1.5 rounded-md transition-opacity hover:opacity-80"
              style={{ backgroundColor: '#3B82F6' }}>
              + Sell
            </Link>
            <Link to="/profile" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              {user.username}
            </Link>
            <button onClick={handleLogout} className="text-sm text-slate-500 hover:text-slate-300 transition-colors">
              Sign out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-sm text-slate-400 hover:text-white font-medium transition-colors">
              Log in
            </Link>
            <Link to="/register"
              className="text-sm font-semibold text-white px-4 py-1.5 rounded-md transition-opacity hover:opacity-80"
              style={{ backgroundColor: '#3B82F6' }}>
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
