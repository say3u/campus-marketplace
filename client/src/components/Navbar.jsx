import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <nav className="bg-white border-b px-6 py-3 flex items-center justify-between sticky top-0 z-50 shadow-sm">
      <Link to="/" className="text-2xl font-black tracking-tight" style={{ color: '#CC0033' }}>
        Dormly
      </Link>

      <div className="flex items-center gap-3">
        {user ? (
          <>
            <Link to="/messages" className="text-gray-500 hover:text-gray-800 text-sm font-medium transition-colors">
              Messages
            </Link>
            <Link
              to="/listings/new"
              className="text-white text-sm font-bold px-4 py-2 rounded-full transition-colors"
              style={{ backgroundColor: '#CC0033' }}
              onMouseEnter={e => e.target.style.backgroundColor = '#a30028'}
              onMouseLeave={e => e.target.style.backgroundColor = '#CC0033'}
            >
              + Post Item
            </Link>
            <span className="text-sm font-bold text-gray-700 px-3 py-1.5 bg-gray-100 rounded-full">
              {user.username}
            </span>
            <button onClick={handleLogout} className="text-gray-400 hover:text-gray-600 text-sm transition-colors">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">
              Login
            </Link>
            <Link
              to="/register"
              className="text-white text-sm font-bold px-5 py-2 rounded-full transition-colors"
              style={{ backgroundColor: '#CC0033' }}
            >
              Sign Up Free
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
