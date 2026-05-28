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
    <nav className="bg-white border-b border-gray-200 px-6 py-0 flex items-center justify-between sticky top-0 z-50 h-14">
      <div className="flex items-center gap-8">
        <Link to="/" className="text-lg font-bold tracking-tight" style={{ color: '#CC0033' }}>
          Dormly
        </Link>
        {user && (
          <div className="hidden sm:flex items-center gap-6">
            <Link to="/browse" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Browse</Link>
            <Link to="/messages" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Messages</Link>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        {user ? (
          <>
            <Link
              to="/listings/new"
              className="text-sm font-semibold text-white px-4 py-1.5 rounded-md transition-colors"
              style={{ backgroundColor: '#CC0033' }}
            >
              Sell an item
            </Link>
            <Link to="/profile" className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors">
              {user.username}
            </Link>
            <button onClick={handleLogout} className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
              Sign out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors">
              Log in
            </Link>
            <Link
              to="/register"
              className="text-sm font-semibold text-white px-4 py-1.5 rounded-md transition-colors"
              style={{ backgroundColor: '#CC0033' }}
            >
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
