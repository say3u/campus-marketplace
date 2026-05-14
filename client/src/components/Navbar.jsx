import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <nav className="bg-white border-b px-6 py-3 flex items-center justify-between">
      <Link to="/" className="text-xl font-bold text-indigo-600">CampusMarket</Link>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <Link to="/listings/new" className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-700">
              + Post
            </Link>
            <Link to="/messages" className="text-gray-600 hover:text-gray-900 text-sm">Messages</Link>
            <Link to="/profile" className="text-gray-600 hover:text-gray-900 text-sm font-medium">{user.username}</Link>
            <button onClick={handleLogout} className="text-gray-400 hover:text-gray-600 text-sm">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-600 hover:text-gray-900 text-sm">Login</Link>
            <Link to="/register" className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-700">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
